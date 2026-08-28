/**
 * Composer, conversation-rail and transcript copy — single source.
 *
 * Every string the visitor reads around the conversation lives here so a wording
 * change is one edit with one owner, and so no component can quietly drift from
 * the approved copy.
 *
 * Playbook v1.7 §12, §13, §16 · Surface 1 v6.0 §2.1, §3.5, §3.6
 */

import { CENTER_COPY, CENTER_COPY_KO } from '@/lib/content/centerCopy';

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
  /**
   * THE THREE HELP ACTIONS, AND WHAT EACH ONE ACTUALLY DOES.
   *
   * These were a list of three plain `<li>` strings — no handler, no href, nothing
   * happened when you clicked them. They now populate the composer with an opening
   * sentence and hand focus back to it, so the request travels the SAME governed
   * path as every other turn: persisted, routed, and answered or escalated by the
   * backend that already knows how to route a support request
   * (`qualification.py` detects one and assigns a human).
   *
   * That is deliberately not a separate contact form. A second channel would be a
   * second place for a request to be lost, and it would arrive without the
   * conversation that produced it.
   */
  quickHelpExpanded: [
    'Message your specialist',
    'Ask for a call',
    'Open a support request',
  ],
  /** The sentence each action puts in the composer. Indexes match the labels above. */
  quickHelpPrompts: [
    'I would like to speak to the specialist who is looking at this.',
    'Could we arrange a call about this review?',
    'I would like to open a support request about this.',
  ],
  quickHelpHint: 'Each one starts a message you can edit before sending.',
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

export const COMPOSER_COPY_KO = {
  placeholder:CENTER_COPY_KO.promptPlaceholder, placeholderContinuing:'메시지를 입력한 뒤 Enter를 눌러 보내세요.', textareaLabel:CENTER_COPY_KO.promptAriaLabel,
  sendLabel:'itriX에 질문', attachLabel:'파일 첨부', keyHint:'Enter로 보내기 · Ctrl + X로 itriX에 질문', keyHintNewline:'Shift + Enter로 줄바꿈', tooShort:CENTER_COPY_KO.tooShort,
  serverCap:'한 메시지에 담기에는 너무 깁니다. 두 부분으로 나눠 보내 주세요. 내용은 손실되지 않았습니다.',
  unreachable:'현재 itriX에 연결할 수 없어 아직 검토되지 않았습니다. 메시지는 저장되어 있습니다. 잠시 후 다시 시도해 주세요.', preparing:'itriX가 응답을 준비하고 있습니다.',
} as const;
export const RAIL_COPY_KO = { newChat:'새 대화', conversationsLabel:'내 대화', conversationsEmpty:'대화가 여기에 표시됩니다.', signIn:CENTER_COPY_KO.signIn, signOut:'로그아웃', exploreLabel:'itriX 살펴보기', openNavigation:'탐색 메뉴 열기', closeNavigation:'탐색 메뉴 닫기', collapse:'대화 목록 접기', expand:'대화 목록 펼치기', rename:'이름 바꾸기', delete:'삭제' } as const;
export const HEADER_COPY_KO = { quickHelp:'도움 받기', quickHelpExpanded:['전문가에게 메시지','통화 요청','지원 요청 열기'], quickHelpPrompts:['이 내용을 검토하는 전문가와 이야기하고 싶습니다.','이 리뷰에 대해 통화를 잡을 수 있을까요?','이 문제에 대한 지원 요청을 열고 싶습니다.'], quickHelpHint:'각 항목은 보내기 전에 수정할 수 있는 메시지를 입력창에 채웁니다.', threadActions:'대화 옵션', untitled:'새 대화', openContent:'콘텐츠 열기', hideContent:'콘텐츠 숨기기' } as const;
export const STATE_LABEL_KO: Record<number,string> = {1:'리뷰',2:'리뷰',3:'상황 반영',4:'내 브리프',5:'확인됨',6:'NDA',7:'평가',8:'PoC',9:'통합',10:'고객 성공'};
export const TRANSCRIPT_COPY_KO = { regionLabel:'itriX와의 대화', visitorTurn:'나', itrixTurn:'itriX', newMessages:'아래에 새 응답이 있습니다', jumpToLatest:'최신 응답으로 이동', underReview:'전문가가 공유 전에 이 응답을 검토하고 있습니다. 잠시 후 이 메시지가 업데이트됩니다.', halted:'정확하지 않을 수 있는 응답을 중단했습니다. 전문가가 정확한 답변을 준비하고 있습니다.' } as const;
