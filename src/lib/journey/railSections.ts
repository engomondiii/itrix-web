/**
 * The closed rail-section vocabulary.
 *
 * Rails are CONTENT, not layout. The backend (apps/journey/constants.py →
 * services/rails.py) decides which sections a subject may see at their current
 * state, identity_state and disclosure ceiling. This file MIRRORS that
 * vocabulary — it never re-decides it.
 *
 * Two rules, enforced here rather than trusted to callers:
 *   1. An unknown section key renders NOTHING and warns in development. It is
 *      never guessed at, never shown as a placeholder, and never throws.
 *   2. A rail whose authorized list is empty does not mount at all. There is no
 *      empty decorative dashboard.
 *
 * Surface 1 v4.0 §3.2 · Architecture v2.5 §11.6
 */

import type { ComponentType } from 'react';

export const LEFT_RAIL_SECTIONS = [
  'heard', 'reflection', 'pitch_slides', 'saved_questions', 'public_assets',
  'pathway', 'documents_viewed', 'documents', 'decisions', 'open_questions',
  'nda_checklist', 'public_documents', 'value_artifacts', 'meeting_notes',
  'assessment_nav', 'decision_log', 'customer_team', 'history',
  'poc_milestones', 'workload_scope', 'benchmark_protocol', 'versions',
  'integration', 'acceptance', 'governance', 'commercial_documents',
  'decision_history', 'overview', 'outcomes', 'deployments', 'support',
  'knowledge', 'training', 'meetings', 'feedback',
] as const;

export const RIGHT_RAIL_SECTIONS = [
  'confidentiality', 'nda_info', 'next_question', 'recommended_pathway',
  'open_brief', 'next_best_action', 'disclosure_boundary', 'human_intro',
  'specialist', 'scheduling', 'reason', 'nda_owner', 'status',
  'action_required', 'next_milestone', 'owners', 'open_actions', 'meeting',
  'technical_owner', 'open_risks', 'approvals', 'next_review',
  'executive_owners', 'counsel', 'next_meeting', 'open_decisions',
  'relationship_team', 'support_sla', 'next_success_review',
  'satisfaction_pulse', 'quick_help',
] as const;

export type LeftRailSection = (typeof LEFT_RAIL_SECTIONS)[number];
export type RightRailSection = (typeof RIGHT_RAIL_SECTIONS)[number];
export type RailSectionKey = LeftRailSection | RightRailSection;

const LEFT_SET: ReadonlySet<string> = new Set(LEFT_RAIL_SECTIONS);
const RIGHT_SET: ReadonlySet<string> = new Set(RIGHT_RAIL_SECTIONS);

export function isLeftRailSection(key: string): key is LeftRailSection {
  return LEFT_SET.has(key);
}
export function isRightRailSection(key: string): key is RightRailSection {
  return RIGHT_SET.has(key);
}
export function isRailSection(key: string): key is RailSectionKey {
  return LEFT_SET.has(key) || RIGHT_SET.has(key);
}

/* ── Rail growth (Surface 1 v4.0 §3.3, Architecture v2.5 §11.6) ─────────────
     1      ambient structure only            ~24px edge / no panel
     2–3    compact memory and guidance       ~160–200px
     4–6    functional navigation + action    ~220–260px
     7–10   full workspace rails              ~240–280px, centre stays ≥640px  */
export type RailWidth = 'ambient' | 'compact' | 'functional' | 'workspace';

export function railWidthForState(journeyNumber: number | null | undefined): RailWidth {
  if (!journeyNumber || journeyNumber <= 1) return 'ambient';
  if (journeyNumber <= 3) return 'compact';
  if (journeyNumber <= 6) return 'functional';
  return 'workspace';
}

export const RAIL_WIDTH_CLASS: Record<RailWidth, string> = {
  ambient: 'w-6',
  compact: 'w-[184px]',
  functional: 'w-[240px]',
  workspace: 'w-[264px]',
};

/* ── The registry ──────────────────────────────────────────────────────────
   Phase 2 ships the seventeen sections States 2–6 can authorize. The workspace
   sections (7–10) are Phase 3 and resolve to null until then — a known key with
   no renderer is expected and silent; an UNKNOWN key is the one worth warning
   about, because it means the two vocabularies have drifted.                */

/**
 * The props every registered section accepts.
 *
 * `sectionKey` is always passed by RailSection. Sections that will render
 * backend-supplied data in Phase 3 declare their own optional props ALONGSIDE
 * this one — declaring it is what makes them assignable to the registry, and it
 * is why a section can never be registered with a required prop the resolver
 * has no way to supply.
 */
export interface RailSectionRenderProps {
  sectionKey?: string;
}

export type RailSectionComponent = ComponentType<RailSectionRenderProps>;

let REGISTRY: Partial<Record<RailSectionKey, RailSectionComponent>> = {};

/** Called once by components/shell/rails/index.ts. Keeps this module import-cycle free. */
export function registerRailSections(entries: Partial<Record<RailSectionKey, RailSectionComponent>>): void {
  REGISTRY = { ...REGISTRY, ...entries };
}

export function resolveRailSection(key: string): RailSectionComponent | null {
  const found = REGISTRY[key as RailSectionKey];
  if (found) return found;

  if (process.env.NODE_ENV !== 'production' && !isRailSection(key)) {
    console.warn(
      `[rails] Unknown section key "${key}". The frontend vocabulary has drifted ` +
        'from apps/journey/constants.py. Nothing was rendered.',
    );
  }
  return null;
}

/** Which of an authorized list this build can actually draw. Used to decide mounting. */
export function renderableSections(keys: readonly string[]): string[] {
  return keys.filter((k) => resolveRailSection(k) !== null);
}
