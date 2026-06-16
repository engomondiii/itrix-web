import { PRESSURE_SIGNALS } from '@/config/review.config';
import type { PressureArea, PressureSignal } from '@/types/review.types';

export { PRESSURE_SIGNALS };

export const PRESSURE_BY_AREA: Record<PressureArea, PressureSignal> = PRESSURE_SIGNALS.reduce(
  (acc, p) => {
    acc[p.area] = p;
    return acc;
  },
  {} as Record<PressureArea, PressureSignal>,
);

export function getPressure(area: PressureArea): PressureSignal {
  return PRESSURE_BY_AREA[area];
}

export function pressureLabel(area: PressureArea): string {
  return PRESSURE_BY_AREA[area]?.label ?? area;
}
