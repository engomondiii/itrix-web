/** Five-tier disclosure classification (Knowledge Core Input Request List). */
export type DisclosureLevel =
  | 'public'
  | 'controlled_public'
  | 'nda_only'
  | 'internal_only'
  | 'prohibited';

export interface DisclosureDefinition {
  level: DisclosureLevel;
  label: string;
  description: string;
  visitorVisible: boolean; // may ever surface on the public site / concierge
}

export const DISCLOSURE_LEVELS: Record<DisclosureLevel, DisclosureDefinition> = {
  public: {
    level: 'public',
    label: 'Public',
    description: 'Safe for any visitor (e.g. the FQNM arXiv paper, public overviews).',
    visitorVisible: true,
  },
  controlled_public: {
    level: 'controlled_public',
    label: 'Controlled public',
    description: 'Shown with care, no deep mechanism or numbers.',
    visitorVisible: true,
  },
  nda_only: {
    level: 'nda_only',
    label: 'NDA only',
    description: 'Benchmarks and proof detail — gated behind a signed NDA.',
    visitorVisible: false,
  },
  internal_only: {
    level: 'internal_only',
    label: 'Internal only',
    description: 'Team-only material — never retrieved for visitors.',
    visitorVisible: false,
  },
  prohibited: {
    level: 'prohibited',
    label: 'Prohibited',
    description: 'Never disclosed in any channel.',
    visitorVisible: false,
  },
};

/** Claims discipline — phrasings the public surface must never emit (Knowledge Core section 7). */
export const PROHIBITED_CLAIMS: string[] = [
  'solves the AI energy crisis',
  'guarantees lower power',
  'reduces all AI costs',
  'guarantees perfect accuracy',
  'always faster',
  'works for every workload',
  'replaces your hardware',
];

/** Approved hedged framing the public surface should prefer. */
export const APPROVED_CLAIM_FRAMING = {
  conditional: 'may, for eligible workloads,',
  validation: 'subject to proof-of-concept validation',
  baseline: 'measured against an agreed baseline',
  conservative: 'a roughly 3–4× arithmetic reduction with preserved accuracy on eligible workloads',
} as const;
