import type { QualificationAnswers } from '@/types/qualification.types';
import type { ProductRoute } from '@/types/product.types';

function single(v: string | string[] | undefined): string | null {
  return Array.isArray(v) ? v[0] ?? null : v ?? null;
}
function multi(v: string | string[] | undefined): string[] {
  return Array.isArray(v) ? v : v ? [v] : [];
}

/**
 * Maps qualification answers to a product route. Representation-shaped problems
 * lean ALPHA Compute; execution/runtime-shaped problems lean ALPHA Core; broad or
 * hardware-embedded cases map to both. Mirrors the backend router's intent.
 */
export function routeProduct(answers: QualificationAnswers): ProductRoute {
  const structure = single(answers.Q3);
  const env = single(answers.Q1);
  const pressures = multi(answers.Q2);

  const representationSignal =
    structure === 'state_observation' || structure === 'linear_algebra';
  const executionSignal =
    structure === 'conservation' ||
    env === 'hardware' ||
    env === 'native' ||
    pressures.includes('hardware_utilization') ||
    pressures.includes('memory_data_movement');

  if (structure === 'mixed') return 'both';
  if (representationSignal && executionSignal) return 'both';
  if (representationSignal) return 'alpha_compute';
  if (executionSignal) return 'alpha_core';
  if (!structure || structure === 'unsure') return 'general';
  return 'alpha_compute';
}
