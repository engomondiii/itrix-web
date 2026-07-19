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
 *   customerSuccess   — Phase 3. The State 10 zone and the overlay that begins
 *                       at the first payment. With it off the success routes
 *                       render their unavailable state and fetch nothing.
 *   relationshipShell — Phase 2. Drives the shell from the backend journey
 *                       payload: real rail contracts, state-aware growth, and
 *                       centre morphing. With it OFF the rails stay ambient and
 *                       every route behaves exactly as it did in Phase 1.
 *   realtime          — live WebSockets for journey + rails + chat + presence
 *   clientPortal      — the (portal) route group
 *   agentChat         — embedded governed agent chat
 */
export const featureFlags = {
  relationshipShell: flag(process.env.NEXT_PUBLIC_ENABLE_RELATIONSHIP_SHELL),
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
  portalUrl: `${siteUrl}/workspace/overview`,
  ogImage: '/og-image.png',
  thesis: brand.thesis,
  featureFlags,
} as const;
