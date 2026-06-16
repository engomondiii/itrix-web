import type { QualificationAnswers } from '@/types/qualification.types';
import type { LicensePathway } from '@/types/product.types';

function single(v: string | string[] | undefined): string | null {
  return Array.isArray(v) ? v[0] ?? null : v ?? null;
}

/** Maps the licensing-interest answer (Q9) + organization (Q6) to a pathway, or null. */
export function routeLicense(answers: QualificationAnswers): LicensePathway | null {
  const interest = single(answers.Q9);
  const org = single(answers.Q6);
  if (interest === 'exclusive') {
    // Hardware/cloud orgs with exclusivity interest lean strategic.
    return org === 'hardware_chip' || org === 'cloud_infra' ? 'strategic' : 'exclusive';
  }
  if (interest === 'non_exclusive') return 'non_exclusive';
  return null; // product_only / unsure / unanswered
}
