/**
 * The closed sidebar-section vocabulary.
 *
 * The sidebar is CONTENT, not layout. The backend
 * (apps/journey/constants.py → services/shell.py) decides which sections a
 * subject may see at their current state, identity_state and disclosure ceiling.
 * This file MIRRORS that vocabulary — it never re-decides it.
 *
 * It replaces lib/journey/railSections.ts. The right value rail is retired; the
 * left rail became navigation. The v4.0 left-rail MEMORY sections (heard,
 * reflection, pitch_slides, open_questions, meeting_notes) are deliberately not
 * carried over: that content is the transcript now, which is the actual record
 * rather than a summary of one.
 *
 * Three rules, enforced here rather than trusted to callers:
 *   1. An unknown section key renders NOTHING and warns in development. It is
 *      never guessed at, never shown as a placeholder, and never throws.
 *   2. A section with no renderable content does not mount. There is no empty
 *      decorative dashboard.
 *   3. The five BASE sections always render, so a visitor always has orientation
 *      and a route to policy — even at State 1 with an empty conversation list.
 *
 * Surface 1 v5.0 §3.2–3.3 · Architecture v2.6 §11.6 · Backend v6.0 §3.2
 */

import type { ComponentType } from 'react';

/** Present at every state, for every identity. */
export const BASE_SIDEBAR_SECTIONS = [
  'brand_nav',
  'new_review',
  'conversations',
  'explore',
  'legal',
] as const;

/** Added as the relationship becomes real. Authorized by the backend, never here. */
export const GROWTH_SIDEBAR_SECTIONS = [
  'documents',
  'pathway',
  'nda',
  'workspace_assessment',
  'workspace_poc',
  'workspace_integration',
  'decisions',
  'governance',
  'outcomes',
  'deployments',
  'support',
  'knowledge',
  'meetings',
  'feedback',
] as const;

export const SIDEBAR_SECTIONS = [
  ...BASE_SIDEBAR_SECTIONS,
  ...GROWTH_SIDEBAR_SECTIONS,
] as const;

export type BaseSidebarSection = (typeof BASE_SIDEBAR_SECTIONS)[number];
export type GrowthSidebarSection = (typeof GROWTH_SIDEBAR_SECTIONS)[number];
export type SidebarSectionKey = (typeof SIDEBAR_SECTIONS)[number];

const KNOWN: ReadonlySet<string> = new Set(SIDEBAR_SECTIONS);
const BASE_SET: ReadonlySet<string> = new Set(BASE_SIDEBAR_SECTIONS);

export function isSidebarSection(key: string): key is SidebarSectionKey {
  return KNOWN.has(key);
}

export function isBaseSection(key: string): key is BaseSidebarSection {
  return BASE_SET.has(key);
}

/* ── Default growth, used only when the backend sent nothing ────────────────
   This is a FALLBACK for the anonymous plane and for a backend that predates
   the shell contract. It is never allowed to widen what the backend said: when
   a payload arrives, `sectionsFromContract` uses it verbatim.

   States 1–3 add nothing — the thread itself carries the memory.             */
export function defaultSectionsForState(journeyState: number | null | undefined): string[] {
  const n = journeyState ?? 1;
  const out: string[] = [...BASE_SIDEBAR_SECTIONS];
  if (n >= 4) out.push('documents', 'pathway');
  if (n >= 6) out.push('nda');
  if (n >= 7) out.push('workspace_assessment', 'decisions');
  if (n >= 8) out.push('workspace_poc');
  if (n >= 9) out.push('workspace_integration', 'governance');
  if (n >= 10) out.push('outcomes', 'deployments', 'support', 'knowledge', 'meetings', 'feedback');
  return out;
}

/**
 * Resolve the list the sidebar should attempt to render.
 *
 * The backend's answer wins whenever it gave one. The base sections are unioned
 * in because they are orientation and policy access, not entitlements — a
 * visitor with no relationship still needs a way to reach the privacy policy.
 * Order is preserved and duplicates are dropped.
 */
export function sectionsFromContract(
  authorized: readonly string[] | null | undefined,
  journeyState: number | null | undefined,
): string[] {
  const source = authorized && authorized.length > 0
    ? [...BASE_SIDEBAR_SECTIONS, ...authorized]
    : defaultSectionsForState(journeyState);

  const seen = new Set<string>();
  return source.filter((key) => {
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* ── The registry ───────────────────────────────────────────────────────────
   Phase 1 shipped the five base sections; PHASE 3 adds the workspace and
   State 10 family. A KNOWN key with no renderer is still expected and silent —
   the backend vocabulary can grow ahead of this build. An UNKNOWN key is the one
   worth warning about, because it means this vocabulary has drifted from
   apps/journey/constants.py.                                                  */

/**
 * The props every registered section accepts.
 *
 * `sectionKey` is always passed by SidebarSection. A section that will render
 * backend-supplied data in a later phase declares its own optional props
 * ALONGSIDE this one. Declaring it is what makes a component assignable to the
 * registry, and it is why a section can never be registered with a required
 * prop the resolver has no way to supply.
 */
export interface SidebarSectionRenderProps {
  sectionKey?: string;
}

export type SidebarSectionComponent = ComponentType<SidebarSectionRenderProps>;

let REGISTRY: Partial<Record<SidebarSectionKey, SidebarSectionComponent>> = {};

/** Called once by components/shell/sidebarRegistry.ts. Keeps this module cycle-free. */
export function registerSidebarSections(
  entries: Partial<Record<SidebarSectionKey, SidebarSectionComponent>>,
): void {
  REGISTRY = { ...REGISTRY, ...entries };
}

export function resolveSidebarSection(key: string): SidebarSectionComponent | null {
  const found = REGISTRY[key as SidebarSectionKey];
  if (found) return found;

  if (process.env.NODE_ENV !== 'production' && !isSidebarSection(key)) {
    console.warn(
      `[sidebar] Unknown section key "${key}". The frontend vocabulary has drifted ` +
        'from apps/journey/constants.py. Nothing was rendered.',
    );
  }
  return null;
}

/** Which of an authorized list this build can actually draw. Decides mounting. */
export function renderableSections(keys: readonly string[]): string[] {
  return keys.filter((k) => resolveSidebarSection(k) !== null);
}
