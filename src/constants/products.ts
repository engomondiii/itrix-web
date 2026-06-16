import type { ProductInfo, Technology, LicensePathway } from '@/types/product.types';

/** ALPHA product layers — boundary must stay identical across every surface (KC v2.0 §5). */
export const PRODUCTS: Record<'alpha_compute' | 'alpha_core', ProductInfo> = {
  alpha_compute: {
    route: 'alpha_compute',
    name: 'ALPHA Compute',
    layer: 'Representation layer',
    thesis: 'Diagnoses how a workload is represented and proposes a transformation hypothesis before any execution.',
    buyer: 'CTO, strategy, and licensing leads',
  },
  alpha_core: {
    route: 'alpha_core',
    name: 'ALPHA Core',
    layer: 'Runtime / execution layer',
    thesis: 'Validates whether a transformed representation can run, through PoC validation and backend execution.',
    buyer: 'Engineering, infrastructure, and deployment leads',
  },
};

/** Public-safe technology framing (AXIOM is NOT defined publicly as index-ordered multiplication). */
export const TECHNOLOGIES: Record<string, Technology> = {
  axiom: {
    id: 'axiom',
    name: 'AXIOM',
    expansion: 'Algebraic-state representation',
    gap: 'Algebraic State–Observation Gap',
    oneLiner:
      'Represents computation as algebraic state — state transition, projected observation, and hidden-state preservation — so a zero observation is never mistaken for a zero state.',
    patentRef: 'P260-07KR',
  },
  cre: {
    id: 'cre',
    name: 'CRE',
    expansion: 'Conjugation–Real Embedding',
    gap: 'Boundary–Energy Gap',
    oneLiner:
      'A structure-preserving real representation for selected complex and tensor operator workloads, retaining spectra, norms, and conditioning.',
    patentRef: 'P253-84KR',
  },
  fqnm: {
    id: 'fqnm',
    name: 'FQNM',
    expansion: 'Fast Quantised Numerical Method',
    gap: 'Continuum–Count Gap',
    oneLiner:
      'Executes conservation-law dynamics as exact integer transfer, reconstructing continuum behaviour afterward.',
    patentRef: 'P253-18KR',
  },
  boundary_aware: {
    id: 'boundary_aware',
    name: 'Boundary-Aware Execution',
    expansion: 'Boundary-aware execution',
    gap: 'Execution / Backend Gap',
    oneLiner:
      'Aligns transformed representations with hardware and runtime boundaries so the advantage survives real deployment.',
  },
};

export const LICENSE_PATHWAYS: Record<LicensePathway, { label: string; summary: string }> = {
  non_exclusive: { label: 'Non-exclusive', summary: 'Default commercial pathway, open to multiple licensees.' },
  exclusive: { label: 'Exclusive', summary: 'Field, regional, or full exclusivity — priced separately and approved case by case.' },
  strategic: { label: 'Strategic', summary: 'Deep partnership and co-development with strategic rights.' },
};

export const PRODUCT_ROUTE_LABEL: Record<string, string> = {
  alpha_compute: 'ALPHA Compute',
  alpha_core: 'ALPHA Core',
  both: 'ALPHA Compute + Core',
  general: 'General enquiry',
};
