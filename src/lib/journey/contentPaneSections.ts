/**
 * THE CLOSED CONTENT-PANE VOCABULARY (Architecture v2.7 §11.6, §11.6B).
 *
 * The pane is where the WORK is read. The rail never grows; only this does.
 *
 * ── WHAT THE PANE IS NOT ────────────────────────────────────────────────────
 * It is NOT the right value rail that v2.6 retired. Every row that v2.6 §11.6A
 * re-homed stays re-homed, and v2.7 §2.7 restates the re-homing as a prohibition:
 * the pane carries no next-best-action, no confidentiality notice, no quick help,
 * no specialist card, no scheduling card and no satisfaction pulse. Those live in
 * the conversation, where the visitor is.
 *
 * Mirrored from apps/journey/constants.py — NEVER re-decided here. An unknown key
 * renders nothing and logs, exactly as an unknown rail section does.
 */

export const CONTENT_PANE_SECTIONS = [
  'artifacts',
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
  'explore',
  'legal',
] as const;

export type ContentPaneSection = (typeof CONTENT_PANE_SECTIONS)[number];

const KNOWN: ReadonlySet<string> = new Set(CONTENT_PANE_SECTIONS);

export function isContentPaneSection(key: string): key is ContentPaneSection {
  return KNOWN.has(key);
}

/**
 * PHASE 3: EVERY SECTION HAS A RENDERER.
 *
 * Phase 2 shipped seven and filtered the rest, because an authorized-but-blank tab
 * wastes a click. Phase 3 closes the set, so the filter is no longer about what this
 * build can draw — it is about what the section is BACKED BY, which is a different
 * question and the reason for the two sets below.
 *
 * `PHASE_2_RENDERABLE` is kept as a deprecated alias for one release: it is imported
 * by tests/unit and by anything written against Phase 2. It now equals the full set.
 */
export const RENDERABLE_SECTIONS: ReadonlySet<ContentPaneSection> = new Set(CONTENT_PANE_SECTIONS);

/** @deprecated Use RENDERABLE_SECTIONS. Retained for one release. */
export const PHASE_2_RENDERABLE = RENDERABLE_SECTIONS;

/**
 * ARTIFACT-BACKED SECTIONS — shown only when a matching artifact exists.
 *
 * These render a governed artifact the thread has actually produced. Whether one
 * exists is knowable locally, from the payload already in hand, so filtering on it
 * costs nothing and avoids a tab that opens onto an empty state.
 */
export const ARTIFACT_BACKED: Readonly<Record<string, readonly string[]>> = {
  artifacts: [],   // any approved artifact; handled specially by the caller
  documents: ['document'],
  workspace_assessment: ['boundary_waste_map'],
  workspace_poc: ['poc_evidence'],
  workspace_integration: ['integration_readiness'],
};

/**
 * RELATIONSHIP-BACKED SECTIONS — shown when the BACKEND AUTHORIZED THEM.
 *
 * ── WHY THESE ARE NOT FILTERED ON CONTENT ───────────────────────────────────
 * Their content lives behind a client-JWT fetch (outcomes, support, deployments and
 * the rest). Filtering on "does it have anything in it" would mean fetching all ten
 * before drawing a single tab — ten requests on every thread open, to decide whether
 * to show a tab.
 *
 * The authorization IS the signal. §11.6 authorizes these per state: `outcomes` only
 * appears in the contract at State 10, `nda` at State 6. So a backend that sends the
 * key is telling us the section exists for this subject, and each section renders its
 * own honest empty state if the fetch comes back thin.
 */
export const RELATIONSHIP_BACKED: ReadonlySet<ContentPaneSection> = new Set<ContentPaneSection>([
  'pathway', 'nda', 'decisions', 'governance',
  'outcomes', 'deployments', 'support', 'knowledge', 'meetings', 'feedback',
]);

/**
 * The State 10 sections, which additionally require the customer-success flag.
 *
 * With the flag off their hooks are inert by design, so showing the tabs would
 * produce six permanent empty states rather than six sections.
 */
export const CUSTOMER_SUCCESS_SECTIONS: ReadonlySet<ContentPaneSection> = new Set<ContentPaneSection>([
  'outcomes', 'deployments', 'support', 'knowledge', 'meetings', 'feedback',
]);

/**
 * `explore` and `legal` always resolve.
 *
 * They are ORIENTATION, not entitlement — the same reasoning as the three rail
 * sections. `legal` in particular is not optional: the four instruments are "not
 * permitted to disappear at any width" (§2.4).
 */
const ALWAYS: ContentPaneSection[] = ['explore', 'legal'];

export function contentPaneSectionsFromContract(
  authorized: readonly string[] | null | undefined,
): ContentPaneSection[] {
  const incoming: ContentPaneSection[] = [];

  for (const key of authorized ?? []) {
    if (isContentPaneSection(key)) incoming.push(key);
    else warnUnknown(key);
  }

  const out: ContentPaneSection[] = [];
  const seen = new Set<string>();
  for (const key of [...incoming, ...ALWAYS]) {
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

function warnUnknown(key: string): void {
  if (process.env.NODE_ENV === 'production') return;
  console.warn(
    `[content-pane] "${key}" is not a content-pane section. The vocabulary is ` +
      'mirrored from apps/journey/constants.py (Architecture v2.7 §11.6) and has ' +
      'drifted. Nothing was rendered.',
  );
}
