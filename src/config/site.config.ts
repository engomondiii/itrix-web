import { brand } from '@/constants/brand';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';
const wsUrl = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000/ws';

/** Boolean env reads. Any value other than 'true' (case-insensitive) is false. */
function flag(value: string | undefined): boolean {
  return (value ?? '').toLowerCase() === 'true';
}

/**
 * Feature flags. Phase 3 finalizes the realtime reads: with realtime + agentChat ON,
 * journey + chat run over live WebSockets (GET/poll stays as the fallback); with them
 * OFF, everything degrades to the Phase 1/2 polling behavior. clientPortal gates the
 * (portal) route group. All default OFF so a fresh deploy is safe.
 *   realtime      → live WebSockets for journey + chat + presence (ws/*)
 *   clientPortal  → the (portal) route group
 *   agentChat     → embedded governed agent chat (live streaming when realtime on)
 */
export const featureFlags = {
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
    'computational AI infrastructure',
    'sustainable AI',
    'ALPHA Compute',
    'ALPHA Core',
    'AXIOM',
    'CRE',
    'FQNM',
    'compute bottleneck',
  ],
  url: siteUrl,
  apiUrl,
  wsUrl,
  /** The portal lives inside this same site (Playbook §03); base kept for absolute links. */
  portalUrl: `${siteUrl}/workspace/overview`,
  ogImage: '/og-image.png',
  thesis: brand.thesis,
  featureFlags,
} as const;
