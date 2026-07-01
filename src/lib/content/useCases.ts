import { routes } from '@/constants/routes';

/**
 * Use Cases scenario copy (Playbook Part XIII, §70–75). Each is a single calm
 * screen: the situation, how itriX would approach it, where it usually starts, one
 * CTA. Strictly qualitative — no numbers, no guarantees.
 */

export interface UseCase {
  slug: string;
  audience: string;
  headline: string;
  situation: string;
  approach: string;
  startsWith: string;
  ctaLabel: string;
  ctaHref: string;
}

export const USE_CASES: UseCase[] = [
  {
    slug: 'inference-cost',
    audience: 'For cloud, hyperscaler, and AI-product teams',
    headline: 'When every new user makes the bill bigger',
    situation:
      'Your model works, adoption is growing — and the compute bill is growing with it. Adding more hardware buys headroom, but it does not change the underlying cost of each unit of work. The pressure keeps returning.',
    approach:
      'itriX would first ask a different question: is the work itself in the right form before it runs? Some inference cost comes not from the hardware, but from how the computation is represented and moved before execution. ALPHA Compute looks for that structure; if a change looks promising, ALPHA Core tests whether it runs in your stack.',
    startsWith: 'ALPHA Compute, usually first.',
    ctaLabel: 'Map this workload',
    ctaHref: routes.review,
  },
  {
    slug: 'slow-or-drifting-simulations',
    audience: 'For HPC, CAE, and scientific-computing owners',
    headline: 'When the run is too long — or the answer slowly stops being trustworthy',
    situation:
      'A long simulation takes hours or days, or it slowly loses accuracy: energy or mass that should be conserved drifts, and results become hard to trust over long time horizons. Faster hardware helps the clock but not the drift.',
    approach:
      'itriX examines whether the mathematical structure of the computation — not only the hardware — is the constraint. Where conservation matters, FQNM asks whether the dynamics can be represented as structure-preserving transfer, evaluated for conservation-sensitive workloads. A technical review or paid evaluation is the usual way to test this on one workload.',
    startsWith: 'ALPHA Compute, with a technical review.',
    ctaLabel: 'Request a technical review',
    ctaHref: routes.review,
  },
  {
    slug: 'energy-and-cooling',
    audience: 'For infrastructure and data-centre strategists',
    headline: 'When the constraint is power, not silicon',
    situation:
      'You can buy more chips, but you cannot easily buy more power, cooling, or floor space. Energy has become the true ceiling on how much AI capability you can deploy.',
    approach:
      'itriX explores whether part of the energy burden can be reduced by reconstructing computation before infrastructure is scaled — doing the same work in a form that asks less of the hardware. ALPHA Compute is the first step; ALPHA Core becomes relevant where hardware execution is part of the picture. This is the most direct expression of itriX’s mission: sustainable AI through better structure, not only more power.',
    startsWith: 'ALPHA Compute first; ALPHA Core where hardware is involved.',
    ctaLabel: 'Explore sustainable AI infrastructure',
    ctaHref: routes.room('sustainable-ai'),
  },
  {
    slug: 'chip-software-stack',
    audience: 'For semiconductor and accelerator partners',
    headline: 'When the hardware is strong but the workloads arrive in the wrong shape',
    situation:
      'Your silicon is capable, but it inherits whatever form the workload arrives in. If that form is inefficient, even excellent hardware spends effort on avoidable work — and your software stack becomes a differentiator you have not fully used.',
    approach:
      'itriX discusses how reconstructed computation could map to your CPU, GPU, NPU, edge, or custom architecture, and how a stronger, structure-preserving software layer could differentiate the hardware beneath it. This usually begins with an architecture discussion and an ALPHA Core runtime-fit assessment.',
    startsWith: 'ALPHA Core, after an architecture discussion.',
    ctaLabel: 'Request an architecture discussion',
    ctaHref: routes.review,
  },
  {
    slug: 'edge-headroom',
    audience: 'For robotics and edge-AI teams',
    headline: 'When there is no more power, memory, or thermal budget to give',
    situation:
      'On a robot or an edge device, you cannot simply add hardware. Every watt, every megabyte, and every degree of heat is already spoken for — yet the models you want to run keep getting heavier.',
    approach:
      'itriX looks at whether the computation can be restructured to do more within tight budgets, before it reaches the constrained device. ALPHA Compute identifies the opportunity; ALPHA Core tests structure-preserving execution on the target environment.',
    startsWith: 'ALPHA Compute first; ALPHA Core on the device.',
    ctaLabel: 'Map an edge workload',
    ctaHref: routes.review,
  },
  {
    slug: 'reproducibility',
    audience: 'For research and regulated-industry teams',
    headline: 'When the same input quietly gives different answers',
    situation:
      'Run the same workload twice — on a different machine, a different precision, a different day — and the answer shifts just enough to undermine confidence. For research and regulated work, that is a serious problem.',
    approach:
      'itriX examines whether the computation can be represented in a more stable, reproducible form, where essential structure is preserved through transformation and execution. Where conservation or exactness matters, the relevant methods (such as FQNM) are designed around preserving structure rather than approximating it. A technical review is the natural starting point.',
    startsWith: 'ALPHA Compute, with a technical review.',
    ctaLabel: 'Request a technical review',
    ctaHref: routes.review,
  },
];

export const USE_CASE_SLUGS = USE_CASES.map((u) => u.slug);

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
