/**
 * WebSocket URL builders (Phase 3). Base comes from siteConfig.wsUrl
 * (e.g. ws://localhost:8000/ws). Routes mirror the backend channels:
 *   ws/review/{session}/  ·  ws/client-page/{token}/  ·  ws/portal/
 */
import { siteConfig } from '@/config/site.config';

function base(): string {
  return siteConfig.wsUrl.replace(/\/$/, '');
}

export const wsUrls = {
  review: (sessionId: string) => `${base()}/review/${encodeURIComponent(sessionId)}/`,
  clientPage: (token: string) => `${base()}/client-page/${encodeURIComponent(token)}/`,
  portal: () => `${base()}/portal/`,
};
