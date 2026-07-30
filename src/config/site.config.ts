import { brand } from '@/constants/brand';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000/ws';

/** Boolean env reads. Any value other than 'true' (case-insensitive) is false. */
function flag(value: string | undefined): boolean {
  return (value ?? '').toLowerCase() === 'true';
}

/**
 * Feature flags. All default OFF so a fresh deploy is safe.
 *
 *   conversationSurface — v5.0 Phase 1. The conversation shell, the minimal
 *                         landing and the no-navigation composer. With it OFF
 *                         every route renders bare rather than inside a
 *                         half-migrated shell, so the phase is reversible in
 *                         production.
 *   streamingTurns      — v5.0 Phase 2. Streamed assistant turns.
 *   attachments         — v5.0 Phase 2. Any-format uploads in the composer.
 *   adaptiveQuestions   — v5.0 Phase 2. Generated follow-up questions and chips.
 *   customerSuccess     — Phase 3. The State 10 zone and the overlay that begins
 *                         at the first payment.
 *   realtime            — live WebSockets for shell + turns + presence
 *   clientPortal        — the (portal) route group
 *   agentChat           — embedded governed agent chat
 *
 * ORDERING RULE (Architecture v2.6 Appendix B.1): a frontend flag may only be
 * enabled once its backend counterpart is on. Turning on `attachments` against a
 * backend without ENABLE_ATTACHMENTS presents a control that cannot succeed,
 * which is worse than not offering it.
 *
 * NOTE the deliberate name divergence: NEXT_PUBLIC_ENABLE_STREAMING_TURNS pairs
 * with the backend's ENABLE_ANONYMOUS_STREAMING. The backend flag admits
 * unidentified visitors to streaming; this one renders streamed turns on any
 * plane.
 */
export const featureFlags = {
  conversationSurface: flag(process.env.NEXT_PUBLIC_ENABLE_CONVERSATION_SURFACE),
  /**
   * v6.0 Phase 1. Governs whether the BACKEND'S `shell_mode` is trusted.
   *
   * It does NOT gate the structural change. The bare arrival screen, the
   * conversation rail, the itriX X control, the rotating prompts and the legal
   * routes ship unconditionally, because none of them needs a backend and all of
   * them were asked for. What this flag governs is narrower and real: until
   * Backend v7.0 Phase 1 is deployed, `shell_mode` is absent from the contract and
   * the surface falls back to its own threshold — has the visitor spoken?
   *
   * Reversal of the visual change is `git revert`, not a flag. That is stated
   * plainly because Surface 1 v6.0 §05 describes the flag as making the phase
   * reversible in production, and keeping a second, dead shell alive to make that
   * literally true would have been the worse trade.
   */
  twoModeShell: flag(process.env.NEXT_PUBLIC_ENABLE_TWO_MODE_SHELL),
  /**
   * v6.0 Phase 2. The content pane — the third zone.
   *
   * With it off, artifacts render inline in the transcript exactly as they did in
   * v5.0: the reference card is still appended (R35), and "Open here" expands the
   * artifact in place. So the phase is genuinely reversible in production, unlike
   * the structural Phase 1 change.
   */
  contentPane: flag(process.env.NEXT_PUBLIC_ENABLE_CONTENT_PANE),
  /**
   * v6.0 Phase 2. Rendered Markdown in assistant turns.
   *
   * ORDERING CONSTRAINT, and it is a governance one rather than a technical one:
   * this must NOT be enabled until the backend's marker-normalised stream-guard pass
   * is live (Backend v7.0 Phase 2, Architecture v2.7 §19.9 rule 5). Markdown syntax
   * can split a prohibited pattern past a matcher that only sees raw text —
   * `gua*ran*tee` renders as the word the guard exists to stop. Rendering before the
   * second pass ships would widen what a prohibited pattern can hide behind.
   *
   * With it off, turns render as newline-split paragraphs, as in v5.0.
   */
  markdownTurns: flag(process.env.NEXT_PUBLIC_ENABLE_MARKDOWN_TURNS),
  /**
   * v6.0 Phase 3. Affirmative assent to the Terms and the Privacy Policy, taken at
   * WORKSPACE CREATION and nowhere else (Architecture v2.7 §19.10, R44).
   *
   * NOT at the first sentence. Gating the composer behind a click-wrap would ask for a
   * commitment before anything has been given, which is the one rule this whole surface
   * is built on. Browsing and the first turn are governed by NOTICE — the pinned legal
   * strip plus the confidentiality line.
   *
   * With the flag off, the checkbox renders and blocks locally but nothing is POSTed —
   * so the gate is honest even before Backend v7.0 Phase 3 ships the assent record.
   */
  legalAssent: flag(process.env.NEXT_PUBLIC_ENABLE_LEGAL_ASSENT),
  streamingTurns: flag(process.env.NEXT_PUBLIC_ENABLE_STREAMING_TURNS),
  attachments: flag(process.env.NEXT_PUBLIC_ENABLE_ATTACHMENTS),
  adaptiveQuestions: flag(process.env.NEXT_PUBLIC_ENABLE_ADAPTIVE_QUESTIONS),
  customerSuccess: flag(process.env.NEXT_PUBLIC_ENABLE_CUSTOMER_SUCCESS),
  realtime: flag(process.env.NEXT_PUBLIC_ENABLE_REALTIME),
  clientPortal: flag(process.env.NEXT_PUBLIC_ENABLE_CLIENT_PORTAL),
  agentChat: flag(process.env.NEXT_PUBLIC_ENABLE_AGENT_CHAT),
} as const;

export const siteConfig = {
  name: brand.name,
  title: `${brand.name} — ${brand.positioning}`,
  description:
    'iTrix builds computational AI infrastructure for sustainable AI. ALPHA Compute diagnoses how a workload is represented; ALPHA Core validates whether the transformed representation can run.',
  keywords: [
    'computational AI infrastructure', 'sustainable AI', 'ALPHA Compute',
    'ALPHA Core', 'AXIOM', 'CRE', 'FQNM', 'compute bottleneck',
  ],
  url: siteUrl,
  apiUrl,
  wsUrl,
  /** The portal lives inside this same site; base kept for absolute links. */
  portalUrl: `${siteUrl}/workspace`,
  ogImage: '/og-image.png',
  thesis: brand.thesis,
  featureFlags,
} as const;
