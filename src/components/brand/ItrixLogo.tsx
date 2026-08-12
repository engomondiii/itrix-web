import Image from 'next/image';

/**
 * THE itriX WORDMARK — the supplied brand assets.
 *
 * Two cuts of the same lockup were supplied so the mark can sit on either a light
 * or a dark surface without a stroke or a halo:
 *
 *   variant="light"  →  /brand/itrix-logo-primary.png   (ink mark, for LIGHT bg)
 *   variant="dark"   →  /brand/itrix-logo-inverse.png   (reversed mark, for DARK bg)
 *
 * "light" / "dark" name the SURFACE the mark sits on, not the colour of the mark
 * itself — the light-surface cut is the dark (ink) wordmark, and vice-versa. The
 * whole current surface is light (`--canvas`), so "light" is the default and is
 * what renders today; the dark cut is here for any dark surface that a later phase
 * introduces (a dark rail, a dark hero) so it can be used without editing assets.
 *
 * Brand Manual §2.3–2.4: the wordmark renders at ≥120px wide with clear space
 * equal to the lowercase "i" height. The caller's padding enforces the clear space
 * so a neighbouring nav item cannot encroach on it.
 *
 * ── LOGO REFRESH (2026-08-12, supplied vector) ──────────────────────────────
 * Every asset under /brand is now generated from the supplied VECTOR wordmark
 * (929×286, ten paths: six letterforms plus the four-piece split X). Previous
 * generations were raster cuts, and the one before that was traced from a draft
 * .ai whose X was not the final letterform — this is the first generation where
 * the vector IS the source, so the SVGs are exact and the PNGs are renders of
 * them rather than the other way round.
 *
 * TWO DELIBERATE CHANGES TO THE SUPPLIED FILE:
 *   * `fill="black"` became the brand ink `#1F2937`. Pure black is not a token
 *     in Brand Manual v3.1, and the mark has to sit beside body text set in the
 *     same ink without reading as a different weight of dark.
 *   * `<title>` was added, so a screen reader announces "itriX" rather than
 *     falling back to a filename. The supplied file had neither title nor desc.
 *
 * The X is also emitted on its own (itrix-x.svg / itrix-x-inverse.svg), split
 * out by GEOMETRY — the four paths whose origin sits right of x=560 — rather
 * than by path order, so a future re-export cannot silently reorder it into the
 * wrong asset. The checklist in Brand Manual §2 requires the symbol as its own
 * asset and the supplied file did not include one.
 *
 * The lockup is 929:286 ≈ 3.25:1. The height follows the width from that exact
 * ratio so it is never stretched.
 */
export interface ItrixLogoProps {
  /** Rendered width in px. The approved header uses 120 desktop / 96 mobile. */
  width?: number;
  className?: string;
  priority?: boolean;
  /** The SURFACE the mark sits on. `light` (default) uses the ink cut; `dark` the reversed cut. */
  variant?: 'light' | 'dark';
}

/** Exact aspect ratio of the supplied vector wordmark (both cuts share it). */
const ASPECT = 929 / 286;

const SOURCES: Record<'light' | 'dark', string> = {
  light: '/brand/itrix-logo-primary.png',
  dark: '/brand/itrix-logo-inverse.png',
};

export function ItrixLogo({
  width = 120,
  className = '',
  priority = false,
  variant = 'light',
}: ItrixLogoProps) {
  const height = Math.round(width / ASPECT);

  return (
    <Image
      src={SOURCES[variant]}
      alt="itriX"
      width={width}
      height={height}
      priority={priority}
      className={`itrix-logo ${className}`}
      style={{ width, height: 'auto' }}
    />
  );
}
