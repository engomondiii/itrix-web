import type { QualificationAnswers } from '@/types/qualification.types';
import type { ProductRoute } from '@/types/product.types';

function single(v: string | string[] | undefined): string | null {
  return Array.isArray(v) ? v[0] ?? null : v ?? null;
}
function multi(v: string | string[] | undefined): string[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

/**
 * Discovery-stage product relevance only. A questionnaire answer or keyword may create
 * a bounded hypothesis, but it never opens a governed ASTOP/ALPHA opportunity. The
 * backend remains authoritative for qualification and progression.
 */
export function productHypotheses(answers: QualificationAnswers): ProductRoute[] {
  const structure = single(answers.Q3);
  const env = single(answers.Q1);
  const pressures = multi(answers.Q2);
  const out: ProductRoute[] = [];

  if (structure === 'state_observation') out.push('astop');

  const representationSignal =
    structure === 'state_observation' || structure === 'linear_algebra';
  const executionSignal =
    structure === 'conservation' ||
    env === 'hardware' ||
    env === 'native' ||
    pressures.includes('hardware_utilization') ||
    pressures.includes('memory_data_movement');

  if (representationSignal) out.push('alpha_compute');
  if (executionSignal) out.push('alpha_core');
  return [...new Set(out)];
}

export function routeProduct(answers: QualificationAnswers): ProductRoute {
  // Evaluate the same bounded signal logic used by internal diagnostics, but never turn
  // early visitor interest into a binding product route.
  productHypotheses(answers);
  return 'undetermined';
}
