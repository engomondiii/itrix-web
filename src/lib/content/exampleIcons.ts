import type { FunctionalFamily } from '@/lib/content/examplePrompts';

/**
 * The five glyphs on the example cards, taken from the approved landing
 * prototype.
 *
 * They are DECORATION and are marked aria-hidden: the family label and the
 * sentence carry the meaning, so a card is fully readable without them. Their
 * job is to match the approved composition, where each card pairs a small tinted
 * tile with the text.
 *
 * Path data only — the SVG wrapper lives in the component, so stroke width and
 * colour stay consistent with every other icon on the surface.
 */
export const EXAMPLE_ICON: Record<FunctionalFamily, string> = {
  /* Rising bars — training and inference economics. */
  ai_model_systems: 'M5 16V8M9 18V6M13 14v-4M17 19V5M21 12H3',
  /* Cloud with a vertical flow — capacity, power, movement. */
  cloud_infrastructure: 'M7 18h10a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.15 8.6 4.5 4.5 0 0 0 7 18ZM9 14h6M12 11v6',
  /* A die with pins — silicon and memory. */
  silicon_memory_hardware: 'M6 6h12v12H6zM9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3M9 9h6v6H9z',
  /* A plotted trace — solvers, stability, reproducibility. */
  runtime_hpc_simulation: 'M3 18h18M5 16l4-5 4 3 6-8M18 6h1v4',
  /* Two links joined — partnership and licensing. */
  strategic_product_partnerships:
    'm8.5 12.5 3 3a2.1 2.1 0 0 0 3 0l5-5a2.1 2.1 0 0 0 0-3l-1-1a2.1 2.1 0 0 0-3 0l-1.5 1.5M15.5 11.5l-3-3a2.1 2.1 0 0 0-3 0l-5 5a2.1 2.1 0 0 0 0 3l1 1a2.1 2.1 0 0 0 3 0L10 16',
};
