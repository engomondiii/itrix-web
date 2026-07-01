/**
 * Pitch-room slide templates + the nine pitch variants (Playbook §00C, Part X).
 *
 * The customized client page IS the Pitch Agent's pitch room. When the backend
 * (Diagnosis + Pitch agents) returns a ClientPage with assembled `slides`, we render
 * those. This module provides:
 *   (a) the canonical 5–7 slide skeleton (labels + disclosure ceilings), and
 *   (b) a deterministic local fallback that fills the skeleton from the page payload,
 *       so the pitch room always renders even before the agent layer is enabled.
 *
 * Copy stays qualitative and claim-safe. Square-bracket tokens are filled from the
 * ClientPage; the words around them are the editable, on-brand template.
 */

import type { ClientPage, PitchSlide, PitchDisclosure } from '@/types/client.types';
import { routeLabel, licenseLabel } from '@/lib/formatting/formatRoute';

/** The nine pitch variants selected by (invisible) visitor classification. */
export const PITCH_VARIANTS = [
  'strategic_executive',
  'technical_buyer',
  'semiconductor_hardware',
  'cloud_ai_infra',
  'cae_hpc_simulation',
  'investor_strategic',
  'government_public',
  'curious_public',
  'risk_competitor',
] as const;

export type PitchVariant = (typeof PITCH_VARIANTS)[number];

/** Canonical slide skeleton (5–7 slides, Part X §55 read as pitch-room slides). */
export const PITCH_SLIDE_SKELETON: { key: string; title: string; disclosure: PitchDisclosure }[] = [
  { key: 'what-we-heard', title: 'What we heard from you', disclosure: 'public' },
  { key: 'why-it-matters', title: 'Why this bottleneck matters', disclosure: 'public' },
  { key: 'hidden-layer', title: 'The hidden layer of the problem', disclosure: 'public' },
  { key: 'where-itrix-fits', title: 'Where itriX may fit', disclosure: 'public' },
  { key: 'recommended-pathway', title: 'Recommended ALPHA pathway', disclosure: 'controlled_public' },
  { key: 'now-vs-nda', title: 'What can be discussed now vs after NDA', disclosure: 'controlled_public' },
  { key: 'next-step', title: 'Suggested next step', disclosure: 'public' },
];

/**
 * Build a deterministic 5–7 slide deck from a ClientPage payload.
 * Used only when the backend did not already return assembled slides.
 */
export function buildLocalPitchDeck(page: ClientPage): PitchSlide[] {
  const route = routeLabel(page.productRoute);
  const license = page.licensePathway ? licenseLabel(page.licensePathway) : 'a suitable';

  const bodies: Record<string, string> = {
    'what-we-heard': page.problemMirror,
    'why-it-matters':
      'Left unaddressed, this kind of bottleneck compounds — in cost, time, energy, or stability. The stakes are read in your terms, not ours.',
    'hidden-layer':
      'The constraint may be representation, not only hardware — often the workload crosses unnecessary computational boundaries (memory, layout, algebraic, precision, device).',
    'where-itrix-fits': `Based on what you shared, ${route} appears most relevant, framed to your case. ${page.alphaFitSummary}`,
    'recommended-pathway': page.recommendedNextStep,
    'now-vs-nda':
      'We can discuss your problem in general terms and what an evaluation could measure now. Confidential technical detail, benchmarks, and mechanism are handled after an NDA.',
    'next-step': `A sensible next step follows a ${license} pathway. ${page.recommendedNextStep}`,
  };

  return PITCH_SLIDE_SKELETON.map((s) => ({
    key: s.key,
    title: s.title,
    body: bodies[s.key] ?? '',
    disclosure: s.disclosure,
  }));
}

/** Resolve the deck to render: prefer backend-assembled slides, else the local build. */
export function resolvePitchDeck(page: ClientPage): PitchSlide[] {
  return page.slides && page.slides.length > 0 ? page.slides : buildLocalPitchDeck(page);
}
