import { StructuredData } from '@/components/seo/StructuredData';
import { LandingSurface } from '@/components/arrival/LandingSurface';

/**
 * The front door.
 *
 * TWO SURFACES, ONE THRESHOLD (Surface 1 v5.0 §2, State 1):
 *
 *   BEFORE the first prompt   the approved arrival screen — header, quiet left
 *                             and right rails, the big centre, the footer. This
 *                             is the signed-off package, rendered as designed.
 *   AFTER the first prompt    the conversation shell takes over in place.
 *
 * The seven approved centre elements are identical across both, in this order:
 *   1  situation framing   "You already know computation is holding you back."
 *   2  main question       "What would you like computation to do better?"
 *   3  supporting line
 *   4  composer            attach + arrow, NO counter, NO "Begin review" button
 *   5  safety notice       (inside the composer footer)
 *   6  five example prompts, one per functional family
 *   7  pathway hint
 *
 * Submitting still does not navigate (R21). The switch is a re-render of a
 * mounted tree, not a route change — which is exactly why the visitor's first
 * sentence survives it.
 */
export default function HomePage() {
  return (
    <>
      <StructuredData />
      <LandingSurface />
    </>
  );
}
