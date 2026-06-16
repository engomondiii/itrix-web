import { trackEvent } from './trackEvent';

export function trackCTAClick(input: { label: string; href?: string; location?: string }): void {
  trackEvent('cta_click', { label: input.label, href: input.href, location: input.location });
}
