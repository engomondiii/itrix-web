/** ALPHA products and the underlying technologies (public-safe framing, Atelier/KC v2.0). */

export type ProductRoute = 'alpha_compute' | 'alpha_core' | 'both' | 'general';

export type LicensePathway = 'non_exclusive' | 'exclusive' | 'strategic';

export type TechnologyId = 'axiom' | 'cre' | 'fqnm' | 'boundary_aware';

export interface Technology {
  id: TechnologyId;
  name: string; // e.g. "AXIOM"
  expansion: string; // public-safe expansion
  gap: string; // the gap it addresses
  oneLiner: string; // public description (no NDA mechanism)
  patentRef?: string;
}

export interface ProductInfo {
  route: Exclude<ProductRoute, 'both' | 'general'>;
  name: string;
  layer: string; // representation vs runtime
  thesis: string;
  buyer: string;
}
