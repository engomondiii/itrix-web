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
 * The source PNGs are ≈1446×446 (≈3.24:1); the height follows the width from that
 * exact ratio so the lockup is never stretched.
 */
export interface ItrixLogoProps {
  /** Rendered width in px. The approved header uses 120 desktop / 96 mobile. */
  width?: number;
  className?: string;
  priority?: boolean;
  /** The SURFACE the mark sits on. `light` (default) uses the ink cut; `dark` the reversed cut. */
  variant?: 'light' | 'dark';
}

/** Exact aspect ratio of the supplied wordmark assets (both cuts share it). */
const ASPECT = 1446 / 446;

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
