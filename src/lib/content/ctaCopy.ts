import { routes } from '@/constants/routes';

export interface Cta {
  label: string;
  href: string;
  sublabel?: string;
}

/** Centralized CTA copy so calls-to-action stay consistent and on-message. */
export const CTA = {
  beginReview: { label: 'Begin a compute bottleneck review', href: routes.review, sublabel: 'No quote — a structural read on your workload' },
  exploreTechnology: { label: 'Explore the technology', href: routes.technology },
  seeCompute: { label: 'See ALPHA Compute', href: routes.alphaCompute },
  seeCore: { label: 'See ALPHA Core', href: routes.alphaCore },
  licensing: { label: 'Licensing pathways', href: routes.licensing },
  readPaper: { label: 'Read the FQNM paper', href: routes.fqnmPaper },
  enterRooms: { label: 'Find your room', href: routes.rooms },
  contactTeam: { label: 'Talk to the team', href: routes.review },
} as const satisfies Record<string, Cta>;

/** A single shared closing line used across page CTAs. */
export const CLOSING_LINE = 'Representation before execution. Start with the workload.';
