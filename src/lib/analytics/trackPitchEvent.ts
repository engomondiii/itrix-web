import { trackEvent } from './trackEvent';

/**
 * Pitch-analytics telemetry (Phase 3). These events feed the cockpit's pitch
 * analytics (§18) so the team can see how a customized page is engaged with:
 * which slides are viewed, how long, what CTA is clicked, questions asked, reopens.
 * All internal — never shown to the visitor.
 */

interface PitchContext {
  token: string;
  leadId?: string | null;
  pitchType?: string | null;
}

export function trackPitchOpened(ctx: PitchContext, slides: number): void {
  trackEvent('pitch.opened', { ...ctx, slides });
}

export function trackPitchSlideViewed(ctx: PitchContext, slideKey: string, index: number): void {
  trackEvent('pitch.slide_viewed', { ...ctx, slideKey, index });
}

export function trackPitchSlideDwell(ctx: PitchContext, slideKey: string, ms: number): void {
  trackEvent('pitch.slide_dwell', { ...ctx, slideKey, ms });
}

export function trackPitchCtaClicked(ctx: PitchContext, cta: string): void {
  trackEvent('pitch.cta_clicked', { ...ctx, cta });
}

export function trackPitchQuestionAsked(ctx: PitchContext): void {
  trackEvent('pitch.question_asked', { ...ctx });
}

export function trackPitchReopened(ctx: PitchContext): void {
  trackEvent('pitch.reopened', { ...ctx });
}
