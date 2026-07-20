/**
 * WebSocket URL builders. Routes mirror the backend channels (Backend v6.0 §7.2):
 *
 *   ws/review/{threadId}/     the ANONYMOUS plane, session-authenticated
 *   ws/client-page/{token}/   capability-token gated
 *   ws/portal/                the client plane
 *
 * v5.0 CHANGE: `review` is now keyed by THREAD, not by review session. The
 * conversation is the unit of subscription because the conversation is the
 * surface (Architecture v2.6 §14.1).
 */
import { siteConfig } from '@/config/site.config';

function base(): string {
  return siteConfig.wsUrl.replace(/\/$/, '');
}

export const wsUrls = {
  review: (threadId: string) => `${base()}/review/${encodeURIComponent(threadId)}/`,
  clientPage: (token: string) => `${base()}/client-page/${encodeURIComponent(token)}/`,
  portal: () => `${base()}/portal/`,
};
