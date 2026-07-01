import { trackEvent } from './trackEvent';

/**
 * drawer.opened — logged whenever a visitor opens a closed-by-default info drawer
 * ("pulled, not pushed"). This is a visitor action surfaced to the cockpit (§18);
 * it is internal telemetry only and never shown to the visitor.
 */
export function trackDrawerOpened(drawerId: string, title: string): void {
  trackEvent('drawer.opened', { drawerId, title });
}
