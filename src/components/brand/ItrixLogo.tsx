import Image from 'next/image';

/**
 * THE itriX WORDMARK — the supplied brand asset.
 *
 * `assets/itrix-logo-primary.png` from the approved landing package
 * (itriX_Brand_Aligned_First_Landing_Page_v1.0). It replaces the typeset
 * "itri<span>X</span>" fallback that earlier phases used: that was a stand-in
 * built from Space Grotesk, not the real lockup, and it rendered the X in accent
 * blue where the actual mark does something else.
 *
 * Brand Manual §2.3–2.4: the wordmark renders at ≥120px wide with clear space
 * equal to the lowercase "i" height. The `pr-*` padding on the link enforces the
 * clear space so a neighbouring nav item cannot encroach on it.
 *
 * The source PNG is 752×343 (≈2.19:1), so the height follows the width to keep
 * the aspect ratio exact rather than approximating it.
 */
export interface ItrixLogoProps {
  /** Rendered width in px. The approved header uses 120 desktop / 96 mobile. */
  width?: number;
  className?: string;
  priority?: boolean;
}

const ASPECT = 752 / 343;

export function ItrixLogo({ width = 120, className = '', priority = false }: ItrixLogoProps) {
  const height = Math.round(width / ASPECT);

  return (
    <Image
      src="/brand/itrix-logo-primary.png"
      alt="itriX"
      width={width}
      height={height}
      priority={priority}
      className={`itrix-logo ${className}`}
      style={{ width, height: 'auto' }}
    />
  );
}
