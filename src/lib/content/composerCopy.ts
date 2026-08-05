/**
 * Composer, conversation-rail and transcript copy — single source.
 *
 * Every string the visitor reads around the conversation lives here so a wording
 * change is one edit with one owner, and so no component can quietly drift from
 * the approved copy.
 *
 * Playbook v1.7 §12, §13, §16 · Surface 1 v6.0 §2.1, §3.5, §3.6
 */

import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * The composer label by journey state (Surface 1 v6.0 §3.5).
 *
 * ONE composer at every state — only the label changes. It is the same visual
 * language throughout and never becomes a chat bubble.
 */
export function composerLabelForState(journeyState: number | null | undefined): string {
  const n = journeyState ?? 1;
  if (n <= 1) return CENTER_COPY.mainQuestion;
  if (n >= 10) return 'What can we improve for you?';
  return 'Ask itriX';
}

export const COMPOSER_COPY = {
  /** Placeholder inside the textarea. Grey hint text, never a label. */
  placeholder: CENTER_COPY.promptPlaceholder,

  /** Placeholder once the conversation is under way. */
  placeholderContinuing: 'Type your message here, then press Enter to send.',

  /** Accessible name for the textarea (visually hidden). */
  textareaLabel: CENTER_COPY.promptAriaLabel,

  /**
   * ACCESSIBLE NAME FOR THE ICON-ONLY SEND CONTROL.
   *
   * v6.0: the arrow is gone. The glyph is the itriX X, and the control is named
   * "Ask itriX" (Playbook v1.7 §00 change 5, R39). Not "Send", because the X is
   * the brand mark rather than a direction — and not "Close", which is what a
   * symmetrical ✕ would read as on a submit control.
   */
  sendLabel: 'Ask itriX',

  /** The attach control's accessible name. */
  attachLabel: 'Attach files',

  /**
   * THE VISIBLE KEY HINT. Text, not a tooltip, so it reaches a screen reader and
   * survives on touch (Surface 1 v6.0 §3.6).
   *
   * `Ctrl + X` is an ACCELERATOR. Enter and the button remain the advertised
   * paths, and the hint says Enter first for that reason.
   */
  keyHint: 'Enter to send · Ctrl + X to ask itriX',
  keyHintNewline: 'Shift + Enter for a new line',

  /** Validation when the visitor sends an empty or near-empty sentence. */
  tooShort: CENTER_COPY.tooShort,

  /**
   * The server safety cap (Backend v7.0 §2.3) is 100,000 characters. There is NO
   * user-facing limit and no counter; this string exists only for the rare case
   * where the server refuses. It names the number rather than silently
   * truncating the visitor's problem.
   */
  serverCap: 'That is longer than we can take in one message. Please send it in two parts — nothing has been lost.',

  /**
   * The honest degraded state. We never fabricate an itriX answer, so when the
   * backend cannot be reached the visitor is told plainly and their words are
   * kept.
   */
  unreachable:
    'We could not reach itriX just now, so this has not been reviewed yet. Your message is saved — try sending again in a moment.',

  /** The quiet placeholder while the first response is being prepared. */
  preparing: 'itriX is preparing a response.',
} as const;

/**
 * Conversation-rail strings (Playbook v1.7 §16A).
 *
 * NEVER IN THE RAIL: a marketing link, a product page, `Approach`, an inferred
 * company, a persona label, a score, a tier or a stage number. The rail names
 * conversations. That is all it does.
 */
export const RAIL_COPY = {
  newChat: 'New chat',
  conversationsLabel: 'Your conversations',
  conversationsEmpty: 'Your conversations will appear here.',
  signIn: CENTER_COPY.signIn,
  signOut: 'Sign out',
  /**
   * NOT a rail string, and it is here only because ExploreGroup still reads it
   * through the SIDEBAR_COPY alias.
   *
   * Explore is a CONTENT-PANE section from v6.0 (Architecture v2.7 §11.6); the rail
   * carries no marketing labels. Phase 2 mounts ExploreGroup inside the pane and
   * this line moves to the pane's copy module with it. Leaving the component
   * compiling was the cheaper trade than rewriting it twice.
   */
  exploreLabel: 'Explore itriX',
  openNavigation: 'Open navigation',
  closeNavigation: 'Close navigation',
  collapse: 'Collapse conversations',
  expand: 'Expand conversations',
  rename: 'Rename',
  delete: 'Delete',
} as const;

/**
 * Kept as an alias for one release.
 *
 * Six shipped modules import `SIDEBAR_COPY`. Renaming the symbol and every
 * importer in the same change would make this phase's diff harder to review for
 * no behavioural gain, so the new name is authoritative and the old one points
 * at it. Phase 2 removes this line.
 */
export const SIDEBAR_COPY = RAIL_COPY;

/** Conversation header strings (Playbook v1.7 §16F). */
export const HEADER_COPY = {
  quickHelp: 'Get help',
  quickHelpExpanded: [
    'Message your specialist',
    'Ask for a call',
    'Open a support request',
  ],
  threadActions: 'Conversation options',
  untitled: 'New chat',
  /** Phase 2 mounts the content pane. The control is declared now, inert. */
  openContent: 'Open content',
  hideContent: 'Hide content',
} as const;

/** Plain-language state labels. Never a number, never a tier (Playbook §16F). */
export const STATE_LABEL: Record<number, string> = {
  1: 'Review',
  2: 'Review',
  3: 'Reflection',
  4: 'Your brief',
  5: 'Qualified',
  6: 'NDA',
  7: 'Assessment',
  8: 'PoC',
  9: 'Integration',
  10: 'Customer success',
};

export function stateLabelFor(journeyState: number | null | undefined): string {
  return STATE_LABEL[journeyState ?? 1] ?? STATE_LABEL[1];
}

/** Transcript strings (Playbook v1.7 §13). */
export const TRANSCRIPT_COPY = {
  regionLabel: 'Your conversation with itriX',
  visitorTurn: 'You',
  itrixTurn: 'itriX',
  newMessages: 'New response below',
  jumpToLatest: 'Jump to the latest',
  underReview:
    'A specialist is reviewing this response before we share it. We will update this message shortly.',
  halted:
    'We stopped that response before it finished. A specialist is preparing an accurate answer for you now.',
} as const;
