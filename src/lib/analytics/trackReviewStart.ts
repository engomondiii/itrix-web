import { trackEvent } from './trackEvent';
import type { PressureArea } from '@/types/review.types';

export function trackReviewStart(input: { pressures: PressureArea[]; environment: string | null; source?: string }): void {
  trackEvent('review_start', {
    pressures: input.pressures,
    environment: input.environment,
    source: input.source ?? 'review',
  });
}
