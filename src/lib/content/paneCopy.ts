/**
 * CONTENT-PANE COPY — single source (Playbook v1.7 §16B–16E).
 *
 * The pane is a READING SURFACE, not a pitch. There is no offer here, no
 * countdown, no availability line, and no wording that asks for anything. If a
 * string in this file ever starts selling, the pane has become the thing §2.7
 * forbids.
 */

import type { ContentPaneSection } from '@/lib/journey/contentPaneSections';

export const PANE_COPY = {
  /** The pane header. Names what it holds, and claims nothing about it. */
  header: 'What itriX has prepared',

  /** Shown when the thread has produced nothing yet. */
  empty: 'Nothing has been prepared yet. Describe your bottleneck and we will start here.',

  /** Shown when a section is authorized but this build cannot render it. */
  notYet: 'This opens here shortly.',

  close: 'Hide content',
  open: 'Open content',
  collapse: 'Collapse the reading pane',
  expand: 'Expand the reading pane',

  /** The pane, as a landmark. */
  regionLabel: 'What itriX has prepared for you',

  /** Switch between the artifacts a thread has produced. */
  artifactSwitcherLabel: 'Prepared for you',

  /**
   * PHASE 3. The feedback section keeps half of its promise and says so.
   *
   * "What we did about it" is the change digest, and it renders. "What you have told
   * us" has NO READ ENDPOINT — the feedback endpoints are write-only by design, so a
   * customer's candid rating cannot become something they are later shown. Rather than
   * imply a record exists, the section points at where feedback is actually answered.
   */
  feedbackNote: 'Anything you tell us is answered in your conversation, by the person who owns it.',

  /** PHASE 3. What an NDA opens up, in the approved framing. */
  ndaNote: 'An NDA lets us look at your actual workload structure, share validation boundaries, and prepare a scoped assessment. Protection is here to make a real conversation possible, not to slow it down.',
} as const;

/**
 * Section labels, from Playbook v1.7 §16E.
 *
 * Plain language, and never a state number, a tier, a score or an internal name.
 */
export const PANE_SECTION_LABEL: Record<ContentPaneSection, string> = {
  artifacts: 'Prepared',
  documents: 'Documents',
  pathway: 'Your pathway',
  nda: 'NDA',
  workspace_assessment: 'Your assessment',
  workspace_poc: 'PoC',
  workspace_integration: 'Integration',
  decisions: 'Decisions',
  governance: 'Decision log',
  outcomes: 'Outcomes',
  deployments: 'Deployments',
  support: 'Support',
  knowledge: 'Learning',
  meetings: 'Meetings',
  feedback: 'Feedback',
  explore: 'Explore',
  legal: 'Legal',
};

/**
 * One-line descriptions, used as the section's standfirst.
 *
 * Playbook v1.7 §16E, verbatim. Each says what the section HOLDS. None of them makes a
 * claim, offers anything, or implies a next step — the pane is a reading surface, and
 * a standfirst that started selling would be the first sign it had stopped being one.
 */
export const PANE_SECTION_INTRO: Partial<Record<ContentPaneSection, string>> = {
  documents: 'What has been shared, and what has been viewed.',
  pathway: 'Where things stand and what has been decided.',
  nda: 'What is done and what is outstanding.',
  workspace_assessment:
    'Intake, baseline, the Boundary Waste Map of your workload, feasibility, the benchmark, and what we would recommend proving next.',
  workspace_poc: 'The baseline, the measures we agreed, and where each milestone stands.',
  workspace_integration: 'Readiness, accepted evidence, governance and commercial documents.',
  decisions: 'What has been agreed, and when.',
  governance: 'The shared record of what was decided and by whom.',
  outcomes: 'Your agreed outcomes and their status.',
  deployments: 'Environments, versions and health.',
  support: 'Your open requests.',
  knowledge: 'Training, documentation and release notes.',
  meetings: 'Past notes and what is scheduled.',
  feedback: 'What you have told us, and what we did about it.',
};

/**
 * PHASE 3. What a section says when it has nothing in it.
 *
 * A SENTENCE, never a skeleton. A relationship-backed section is authorized by state,
 * so "authorized but thin" is a normal condition rather than a loading failure — and a
 * shimmering placeholder for data that is not coming is a small lie told repeatedly.
 */
export const PANE_SECTION_EMPTY: Partial<Record<ContentPaneSection, string>> = {
  documents: 'Nothing has been shared here yet.',
  pathway: 'Nothing has been prepared yet. It will appear here as it is.',
  nda: 'We can go a long way on non-confidential descriptions.',
  workspace_assessment: 'Your assessment will appear here once it begins.',
  workspace_poc: 'Evidence appears here as it is produced.',
  workspace_integration: 'Integration material will appear here when it is ready.',
  decisions: 'Nothing has been agreed yet.',
  governance: 'The decision log is empty so far.',
  outcomes: 'Your agreed outcomes will appear here.',
  deployments: 'Nothing is deployed yet.',
  support: 'You have no open requests.',
  knowledge: 'Training and documentation will appear here.',
  meetings: 'Nothing is scheduled yet.',
};
