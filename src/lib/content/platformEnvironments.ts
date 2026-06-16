import { PLATFORM_ENVIRONMENTS } from '@/config/review.config';
import type { PlatformEnvironment } from '@/types/qualification.types';

export { PLATFORM_ENVIRONMENTS };

export type EnvironmentFamily = PlatformEnvironment['family'];

export const ENVIRONMENT_FAMILY_LABEL: Record<EnvironmentFamily, string> = {
  numerical: 'Numerical computing',
  simulation: 'Simulation',
  ai_ml: 'AI / ML',
  systems: 'Systems / native',
  hardware: 'Hardware / runtime',
  other: 'Other',
};

const BY_VALUE: Record<string, PlatformEnvironment> = PLATFORM_ENVIRONMENTS.reduce(
  (acc, e) => {
    acc[e.value] = e;
    return acc;
  },
  {} as Record<string, PlatformEnvironment>,
);

export function getEnvironment(value: string | null): PlatformEnvironment | null {
  return value ? BY_VALUE[value] ?? null : null;
}
