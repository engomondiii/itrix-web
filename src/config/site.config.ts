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
