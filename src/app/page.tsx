import { StructuredData } from '@/components/seo/StructuredData';
import { LandingSurface } from '@/components/arrival/LandingSurface';

/**
 * The front door.
 *
 * ONE QUESTION, AND NOTHING AROUND IT (Surface 1 v6.0 §2.1).
 *
 * This page renders the CENTRE ONLY. ShellModeGate mounts the surround — the
 * wordmark, Sign in, and the pinned legal strip in arrival mode; the conversation
 * rail once a thread exists.
 *
 * The six centre elements, in order:
 *   3  main question    "What would you like computation to do better?" — the H1
 *   4  supporting line
 *   5  composer         attach + the itriX X, NO counter, NO "Begin review"
 *   6  safety notice    (inside the composer footer)
 *   7  rotating prompts one at a time, five in the cycle, one per family
 *   8  pathway hint
 *
 * WHAT IS NOT HERE, and must not come back: the situation framing line (deleted from
 * the product, R31), navigation links, an audience strip, a how-it-works list, a
 * marketing footer, or anything scrollable below the pathway hint (R29, R32).
 *
 * Submitting does not navigate (R21). The switch to the working shell is a re-render
 * of a mounted tree, not a route change — which is exactly why the visitor's first
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
