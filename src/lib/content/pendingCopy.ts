/**
 * WHILE ITRIX IS WORKING (Playbook v1.7 §13.2, Surface 1 v6.0 §3.10, R42).
 *
 * ── THERE ARE EXACTLY THREE STAGE STRINGS ───────────────────────────────────
 *
 * They change on screen when the system ACTUALLY changes stage, driven by the
 * backend's `message.stage` event, and never on a timer. Adding a fourth,
 * softening one, or making one sound busier than it is requires Governance
 * sign-off — because a surface that fakes progress teaches visitors to distrust
 * everything else it says.
 *
 * And never "itriX is typing": nobody is typing. The prohibition covers the
 * metaphor as well as the phrase — no ellipsis animation, no bouncing dots, no
 * avatar, no wording that implies a person at a keyboard.
 */

export const PENDING_STAGES = ['retrieving', 'composing', 'checking'] as const;

export type PendingStage = (typeof PENDING_STAGES)[number];

const KNOWN: ReadonlySet<string> = new Set(PENDING_STAGES);

export function isPendingStage(value: unknown): value is PendingStage {
  return typeof value === 'string' && KNOWN.has(value);
}

/** The only three strings. */
export const PENDING_STAGE_LABEL: Record<PendingStage, string> = {
  retrieving: 'Retrieving approved material',
  composing: 'Composing your answer',
  checking: 'Checking before sending',
};

export const PENDING_COPY = {
  /**
   * Announced ONCE, politely, when the wait begins. Stage changes are NOT
   * announced — narrating three transitions per turn would make the surface
   * unusable with a screen reader.
   */
  announcement: 'Processing your request',

  /**
   * After PENDING_TIMEOUT_MS with neither a delta nor a stage event. It says what
   * is true — this is taking longer than usual — and offers a way out. It does not
   * invent a reason, and it does not silently spin.
   */
  timeout: 'This is taking longer than usual.',
  retry: 'Try again',

  /** Fallback while no stage has been reported yet. */
  waiting: 'Processing…',
} as const;

/** Default 20s, overridable per environment. */
export const PENDING_TIMEOUT_MS = Number.parseInt(
  process.env.NEXT_PUBLIC_PENDING_TIMEOUT_MS ?? '20000',
  10,
);


export const PENDING_STAGE_LABEL_KO: Record<PendingStage, string> = {
  retrieving: '승인된 자료 확인 중',
  composing: '답변 구성 중',
  checking: '전송 전 확인 중',
};

export const PENDING_COPY_KO = {
  announcement: '요청을 처리하고 있습니다',
  timeout: '평소보다 시간이 더 걸리고 있습니다.',
  retry: '다시 시도',
  waiting: '처리 중…',
} as const;
