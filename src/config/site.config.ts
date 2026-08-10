import { brand } from '@/constants/brand';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000/ws';

/** Boolean env reads. Any value other than 'true' (case-insensitive) is false. */
function flag(value: string | undefined): boolean {
  return (value ?? '').toLowerCase() === 'true';
}

/**
 * A flag that DEFAULTS ON, and only `false` turns it off (v8.0).
 *
 * Used for exactly one thing: `openSignup`. Architecture v2.9 retires that flag as a
 * product gate and keeps it as a KILL SWITCH, which inverts its default — an unset
 * variable now has to mean "registration is available".
 *
 * ── AND A TYPO HAS TO FAIL SAFE IN THE OTHER DIRECTION ────────────────────
 * `flag()` is strict on purpose: for a feature that is off by default, `'ture'` meaning
 * OFF is the safe reading. Here the safe reading is the opposite — a mistyped value must
 * not silently close the front door — so anything that is not literally `false` leaves it
 * open. That asymmetry is deliberate and is the reason this is a separate helper rather
 * than a parameter on `flag()`.
 *
 * NOTE this is NOT the dashboard's `useMocks !== 'false'` pattern, which was a defect: there
 * the default-on value bypassed authentication. Here the default-on value is the product
 * decision itself, and it grants nothing — reach is unchanged by having an account (R59).
 */
function flagDefaultOn(value: string | undefined): boolean {
  return (value ?? '').toLowerCase() !== 'false';
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
  /**
   * v7.0 Phase 4. The designed authentication zone.
   *
   * Reserved for a staged rollout; the four routes render unconditionally because they
   * replace three pages that already existed and one that did not, and there is no older
   * version worth keeping alive behind a switch. Reversal is `git revert`.
   */
  authZone: flag(process.env.NEXT_PUBLIC_ENABLE_AUTH_ZONE),
  /**
   * v7.0 Phase 4. The password-reset flow.
   *
   * With it off the request form still renders and still shows its confirmation — which
   * is correct, because the confirmation is deliberately true whether or not anything was
   * sent. Turn it on with Backend v7.1 Phase 4.
   */
  passwordReset: flag(process.env.NEXT_PUBLIC_ENABLE_PASSWORD_RESET),
  /**
   * v8.0 Phase 5. OPEN REGISTRATION — and it DEFAULTS ON (Architecture v2.9 §27, R60).
   *
   * v7.0 had this off with four consequences recorded against it. The decision was taken
   * the other way, and three of the four do not survive contact with the code: the ceiling
   * is min(plane cap, state ceiling) and State 1 is `public`, so a registered subject who
   * has said nothing reaches exactly what an anonymous visitor reaches (R59); Layer 1
   * qualifies conversations, not forms; and a persona is inferred from what somebody SAID,
   * so silence keys to nothing and no pitch room renders.
   *
   * What was left was the real risk — anyone can register anyone's work address — and that
   * is answered by verification (R66) and by one-account-per-address (R63) on the backend.
   *
   * IT IS NOW A KILL SWITCH RATHER THAN A PRODUCT GATE. With it thrown, /sign-up renders the
   * invitation path only and /api/auth/register returns 404. That off state is specified and
   * still in the tree, because a switch whose off state has been deleted is not a switch
   * (§27.10).
   */
  openSignup: flagDefaultOn(process.env.NEXT_PUBLIC_ENABLE_OPEN_SIGNUP),
  /**
   * v8.0 Phase 5. The collapsed invitation-code option on /sign-up.
   *
   * Defaults ON. It is the path an invited person uses when they closed the email and typed
   * the site name into a browser, and it is never removed (R68) — an invitation is how itriX
   * opens a workspace FOR somebody, which is worth more now that it carries no
   * administrative freight.
   */
  signupInviteCode: flagDefaultOn(process.env.NEXT_PUBLIC_ENABLE_SIGNUP_INVITE_CODE),
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
    'itriX builds computational AI infrastructure for sustainable AI. ALPHA Compute diagnoses how a workload is represented; ALPHA Core validates whether the transformed representation can run.',
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
