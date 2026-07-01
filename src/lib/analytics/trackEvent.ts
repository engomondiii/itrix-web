/** Lightweight, SSR-safe analytics dispatcher. No-ops on the server; pushes to
 *  window.dataLayer when present and logs in development. Never throws. */
export type AnalyticsPayload = Record<string, unknown>;

interface DataLayerWindow extends Window {
  dataLayer?: AnalyticsPayload[];
}

/**
 * Known event names. Phase 2 registers the account-invite + portal events so the
 * cockpit (§18) and analytics can rely on a stable vocabulary. Any string is still
 * accepted; this union is documentation + editor autocomplete, not a hard gate.
 */
export type KnownEvent =
  | 'review.prompt_started'
  | 'review.diagnosed'
  | 'drawer.opened'
  | 'pitch.opened'
  | 'account.invite_intent'
  | 'account.invite_claimed'
  | 'account.invite_fallback'
  | 'portal.signed_in'
  | 'portal.signed_out'
  | 'portal.message_sent'
  | 'portal.document_opened'
  | 'portal.data_room_locked_view'
  | 'portal.nda_requested'
  | (string & {});

export function trackEvent(name: KnownEvent, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;
  try {
    const event: AnalyticsPayload = { event: name, ...payload, ts: Date.now() };
    const w = window as DataLayerWindow;
    if (!Array.isArray(w.dataLayer)) w.dataLayer = [];
    w.dataLayer.push(event);
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', name, payload);
    }
  } catch {
    /* analytics must never break the app */
  }
}
