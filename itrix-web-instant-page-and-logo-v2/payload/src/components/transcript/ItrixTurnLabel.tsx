import { ItrixLogo } from '@/components/brand/ItrixLogo';

/**
 * THE itriX TURN LABEL — the brand wordmark used where a speaker label sits above
 * an itriX turn in the transcript.
 *
 * WHY THIS EXISTS
 * The speaker label above each turn is styled by `.turn__label`, which applies
 * `text-transform: uppercase`. That is correct for the generic role label ("YOU")
 * but it turned the brand name into "ITRIX", which is not the wordmark — the mark is
 * `itriX` (lowercase i-t-r-i, capital X), exactly as the primary logo draws it
 * (Brand Manual §2.3, and `brand.wordmark`). Rendering the supplied logo asset here
 * shows the mark faithfully instead of a CSS-uppercased approximation, in both the
 * settled turn and the pending ("working") indicator that shares the same label.
 *
 * SIZING
 * The wordmark is ≈3.24:1. At 44px wide it stands ≈14px tall — the visual weight of
 * the 12px mono label it replaces — so it reads as a label, not a banner. The
 * surrounding `.turn__label` spacing is preserved by keeping this inline in the same
 * <p>. The logo's own `alt="itriX"` carries the accessible name; the wrapping element
 * is aria-hidden-free so screen readers still announce the brand.
 */
export function ItrixTurnLabel({ width = 44 }: { width?: number }) {
  return <ItrixLogo width={width} className="turn__brand" />;
}
