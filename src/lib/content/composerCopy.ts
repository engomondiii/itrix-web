/**
 * Composer, sidebar and transcript copy — single source.
 *
 * Every string the visitor reads around the conversation lives here so a wording
 * change is one edit with one owner, and so no component can quietly drift from
 * the approved copy.
 *
 * Playbook v1.6 §12, §13, §16 · Surface 1 v5.0 §2.1, §3.5
 */

import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * The composer label by journey state (Surface 1 v5.0 §3.5).
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
  placeholderContinuing: 'Reply to itriX, or add anything else that would help.',

  /** Accessible name for the textarea (visually hidden). */
  textareaLabel: CENTER_COPY.promptAriaLabel,

  /**
   * ACCESSIBLE NAME FOR THE ICON-ONLY SEND CONTROL.
   *
   * There is no button labelled "Begin review". The send control is an arrow,
   * and an icon-only control therefore REQUIRES a name (Surface 1 v5.0 §7.4).
   */
  sendLabel: 'Send',

  /** Phase 2. Declared now so the attach control has one home for its name. */
  attachLabel: 'Attach files',

  /** Keyboard hint, shown quietly beneath the composer on pointer devices. */
  keyboardHint: 'Enter to send · Shift + Enter for a new line',

  /** Validation when the visitor sends an empty or near-empty sentence. */
  tooShort: CENTER_COPY.tooShort,

  /**
   * The server safety cap (Backend v6.0 §2.3) is 100,000 characters. There is NO
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

/** Sidebar strings (Playbook v1.6 §16A, §16B, §16D). */
export const SIDEBAR_COPY = {
  newReview: 'New review',
  conversationsLabel: 'Your reviews',
  conversationsEmpty: 'Your reviews will appear here.',
  exploreLabel: 'Explore itriX',
  ndaAccess: 'Sign in',
  openNavigation: 'Open navigation',
  closeNavigation: 'Close navigation',
  collapse: 'Collapse sidebar',
  expand: 'Expand sidebar',
  rename: 'Rename',
  delete: 'Delete',
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Security', href: '/security' },
    { label: 'Disclosure policy', href: '/disclosure' },
  ],
} as const;

/** Conversation header strings (Playbook v1.6 §16E). */
export const HEADER_COPY = {
  quickHelp: 'Get help',
  quickHelpExpanded: [
    'Message your specialist',
    'Ask for a call',
    'Open a support request',
  ],
  threadActions: 'Conversation options',
  untitled: 'New review',
} as const;

/** Plain-language state labels. Never a number, never a tier (Playbook §16E). */
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

/** Transcript strings (Playbook v1.6 §13). */
export const TRANSCRIPT_COPY = {
  regionLabel: 'Your conversation with itriX',
  visitorTurn: 'You',
  itrixTurn: 'itriX',
  newMessages: 'New response below',
  jumpToLatest: 'Jump to the latest',
  /** Phase 2 governance strings, declared now so Governance owns one location. */
  underReview:
    'A specialist is reviewing this response before we share it. We will update this message shortly.',
  halted:
    'We stopped that response before it finished. A specialist is preparing an accurate answer for you now.',
} as const;
