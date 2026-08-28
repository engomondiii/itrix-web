/**
 * The approved invariant center — copy, single source.
 *
 * Source: Playbook v1.7 §12. Surface 1 v6.0 §2.1.
 *
 *   NON-NEGOTIABLE
 *   Retain the exact opening question. The first prompt is the actual beginning
 *   of the review. Do not replace it with a new opening and do not ask the
 *   visitor to repeat the same input.
 *
 * v6.0 — WHAT WAS DELETED, AND WHY IT IS NOT COMING BACK
 * `situationFraming` is GONE: "You already know computation is holding you back."
 * has left the product (Playbook v1.7 §00 change 1, R31). It was not moved and it
 * was not resized. The MAIN QUESTION is now the only large sentence on the
 * arrival screen and the route's only h1. If you find that line anywhere in
 * `src/`, in a seeded template, or in a `metadata.description`, it is a bug.
 *
 * Every string a visitor reads on the first screen lives here so a wording change
 * is one edit with one owner. Do not inline any of these in a component.
 */

/**
 * The approved confidentiality wording, re-exported here so every surface that
 * needs it imports from ONE place: the composer footer, the attachment flow and
 * the artifact views all read this symbol.
 *
 * DO NOT REWORD WITHOUT LEGAL SIGN-OFF (Architecture v2.7 §19.4). Because the
 * composer is present at every state from 1 to 10, this notice is present at
 * every state.
 */
export { CONFIDENTIALITY_NOTICE } from '@/lib/content/ctaCopy';

export const CENTER_COPY = {
  /** Technical label above the question (IBM Plex Mono, uppercase, tracked). */
  eyebrow: 'Mathematical intelligence',

  /**
   * THE MAIN QUESTION. The single most important sentence on the platform, and
   * from v6.0 the arrival route's ONLY h1 — display face at
   * `--arrival-question-size`, which lands on the Brand Manual H1 of 56px desktop
   * / 32px mobile.
   *
   * It invites a problem; it does not announce a product.
   * Approved 2026-07. Requires Brand & Messaging + Park Dae-hyuk sign-off to change.
   */
  mainQuestion: 'What would you like computation to do better?',

  /** Placeholder inside the composer. Grey hint text, never a label. */
  promptPlaceholder: 'Type your message here, then press Enter to send.',

  /** Accessible name for the composer textarea (visually hidden). */
  promptAriaLabel: 'Describe your compute challenge',

  /** The short safety note directly under the composer. */
  safetyNote: 'A non-confidential summary is enough to begin.',

  /**
   * THE WORDMARK DESCRIPTOR — beside the logo, top left. Not a link.
   *
   * v6.0: "AI" is removed. It reads "Computational Infrastructure company"
   * (Playbook v1.7 §00 change 4). Only the DESCRIPTOR changed; the corporate
   * positioning line in the Knowledge Core is untouched.
   */
  descriptor: 'Computational Infrastructure company',

  /**
   * The only control in the top right of the arrival screen.
   * v6.0: replaces "NDA access" everywhere it appeared.
   */
  signIn: 'Sign in',

  /**
   * v7.0 Phase 4. The second — and last — link on the arrival screen.
   *
   * `Sign in` stays FIRST and stays the primary of the two: most people arriving at the
   * top right of this screen have an account. `Sign up` sits beside it as a quieter
   * secondary link, not a button and not a dropdown — a menu on the front door is chrome,
   * and R32 permits exactly these two links plus the four legal instruments.
   */
  signUp: 'Sign up',

  /** Section label above the rotating prompts. */
  examplesLabel: 'Optional question ideas',

  /** Reveal the five prompts as a static list, for anyone who should not wait. */
  showAllPrompts: 'Show all five',
  hideAllPrompts: 'Show one at a time',

  /** Accessible names for the carousel controls. */
  previousPrompt: 'Previous example',
  nextPrompt: 'Next example',
  promptGroupLabel: 'Optional questions you can place in the composer',

  /** The four-step pathway hint below the prompts. */
  pathwayHint: ['You share', 'itriX reflects', 'You receive a tailored brief', 'You decide what happens next'],

  /** Validation message when the visitor submits an empty or too-short sentence. */
  tooShort: 'Add a little more so we can read the structure of the problem.',
} as const;

/*
 * RETIRED IN v5.0 and still retired: the two arrival rail copy blocks, the
 * labelled start button, and the character counter. RETIRED IN v6.0: the
 * situation framing line, the arrival navigation links, and the dark arrival
 * footer. Nothing here reinstates any of them.
 */

/** The drawer behind the "what can be shared before an NDA?" control. */
export const NDA_DRAWER = {
  tier: 'Controlled public',
  title: 'What can be shared before an NDA?',
  body:
    'You can describe the business pressure, workload family, current environment, and the outcome you would like to improve. Please do not share proprietary code, internal benchmark data, architecture details, or other confidential material before an NDA.',
  dismiss: 'Understood',
} as const;

/**
 * The review surface (Playbook v1.7 §13). The review CONTINUES from the
 * center sentence — it never re-asks for it.
 */
export const REVIEW_COPY = {
  sectionTitle: 'Compute Bottleneck Review',
  capturedLabel: 'What we heard',
  capturedIntro: 'Here is what we heard. Edit it if we captured it imperfectly.',
  addMore: 'Add anything else that would help us understand it.',
  continue: 'Continue',
  /** Shown ONLY when the visitor landed on /review directly, with no center sentence. */
  coldStartQuestion: CENTER_COPY.mainQuestion,
  /** The field label in that same cold-start case. */
  coldStartLabel: 'Describe the bottleneck or opportunity in one non-confidential sentence',
} as const;

export const CENTER_COPY_KO = {
  eyebrow:'수학적 지능',
  mainQuestion:'계산이 무엇을 더 잘했으면 하나요?',
  promptPlaceholder:'메시지를 입력한 뒤 Enter를 눌러 보내세요.',
  promptAriaLabel:'계산 과제 설명',
  safetyNote:'시작할 때는 비기밀 요약이면 충분합니다.',
  descriptor:'계산 인프라 기업', signIn:'로그인', signUp:'회원가입',
  examplesLabel:'선택 가능한 질문 아이디어', showAllPrompts:'다섯 개 모두 보기', hideAllPrompts:'하나씩 보기',
  previousPrompt:'이전 예시', nextPrompt:'다음 예시', promptGroupLabel:'입력창에 넣을 수 있는 선택 질문',
  pathwayHint:['당신이 설명합니다','itriX가 반영합니다','맞춤형 브리프를 받습니다','다음에 무엇을 할지 당신이 결정합니다'],
  tooShort:'문제의 구조를 이해할 수 있도록 조금만 더 설명해 주세요.',
} as const;
export const NDA_DRAWER_KO = { tier:'제어된 공개', title:'NDA 이전에 무엇을 공유할 수 있나요?', body:'비즈니스 압력, 워크로드 종류, 현재 환경, 개선하고 싶은 결과는 설명할 수 있습니다. NDA 이전에는 독점 코드, 내부 벤치마크 데이터, 아키텍처 세부사항 등 기밀 자료를 공유하지 마세요.', dismiss:'확인했습니다' } as const;
export const REVIEW_COPY_KO = { sectionTitle:'컴퓨트 병목 리뷰', capturedLabel:'itriX가 이해한 내용', capturedIntro:'다음은 itriX가 이해한 내용입니다. 정확하지 않다면 수정해 주세요.', addMore:'상황을 이해하는 데 도움이 되는 내용을 더 알려 주세요.', continue:'계속', coldStartQuestion:CENTER_COPY_KO.mainQuestion, coldStartLabel:'병목 또는 기회를 비기밀 문장 하나로 설명해 주세요' } as const;
