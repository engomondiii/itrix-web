/** Lightweight, SSR-safe analytics dispatcher. No-ops on the server; pushes to
 *  window.dataLayer when present and logs in development. Never throws. */
export type AnalyticsPayload = Record<string, unknown>;

interface DataLayerWindow extends Window {
  dataLayer?: AnalyticsPayload[];
}

export function trackEvent(name: string, payload: AnalyticsPayload = {}): void {
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
