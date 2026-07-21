/**
 * itriX brand constants (Brand Manual v1.5 EN expression).
 *
 * THE WORDMARK IS `itriX` — lowercase i-t-r-i, capital X. That is what the
 * primary logo draws (public/brand/itrix-logo-primary.png), what the `letters`
 * table below spells out, and how every current spec writes it. It was
 * previously recorded here as "iTriX", which contradicted the letters table
 * three lines down and propagated into the OG card and the page copy.
 *
 * `legalEntity` is deliberately different and is NOT a casing mistake: the
 * registered company is "iTrix Co., Ltd (주식회사 아이트릭스)". Use the wordmark
 * for the brand, the legal entity only where the legal entity is meant.
 */
export const brand = {
  name: 'itriX',
  wordmark: 'itriX',
  legalEntity: 'iTrix Co., Ltd',
  positioning: 'Computational AI Infrastructure for Sustainable AI',
  thesis: 'Do not scale inefficient computation. Make computation worth scaling first.',
  tagline: 'Representation before execution.',
  letters: [
    { char: 'i', meaning: 'Intelligence' },
    { char: 't', meaning: 'Transformation' },
    { char: 'r', meaning: 'Reinvention · Rigor · Relevance' },
    { char: 'i', meaning: 'Integrity' },
    { char: 'X', meaning: 'The reconstruction space — ALPHA Compute × ALPHA Core' },
  ],
  contactEmail: 'team@itrix.ai',
  assessmentTeam: 'itriX Assessment Team',
} as const;
