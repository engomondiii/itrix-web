'use client';

import { useReviewStore } from '@/store/reviewStore';
import { PRESSURE_SIGNALS } from '@/lib/content/pressureSignals';
import type { PressureArea } from '@/types/review.types';

export function usePressureSignal() {
  const selected = useReviewStore((s) => s.selectedPressures);
  const toggle = useReviewStore((s) => s.togglePressure);
  const setAll = useReviewStore((s) => s.setPressures);

  return {
    signals: PRESSURE_SIGNALS,
    selected,
    isSelected: (area: PressureArea) => selected.includes(area),
    toggle,
    setAll,
    count: selected.length,
  };
}
