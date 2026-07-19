'use client';

import type { ReactNode } from 'react';
import { RAIL_WIDTH_CLASS, railWidthForState, type RailWidth } from '@/lib/journey/railSections';

export interface RailGrowthProps {
  journeyNumber: number | null | undefined;
  side: 'left' | 'right';
  children: ReactNode;
  /** Local collapse preference. Hides visually; never changes authorization. */
  collapsed?: boolean;
}

/**
 * The width and animation policy for a rail.
 *
 * One place decides how wide a rail is at a given state, so the left and right
 * rails can never disagree and no page can override the geometry:
 *
 *   1      ambient      ~24px edge, structure only
 *   2–3    compact      ~184px
 *   4–6    functional   ~240px
 *   7–10   workspace    ~264px      (centre stays ≥640px — enforced in shell.css)
 *
 * Expansion is ~240ms on opacity and width only, and is suppressed under
 * prefers-reduced-motion (Brand Manual §9.2). Collapsing is a LOCAL preference:
 * it hides the rail visually and leaves its content reachable — it never removes
 * a section from the authorized list.
 */
export function RailGrowth({ journeyNumber, side, children, collapsed = false }: RailGrowthProps) {
  const width: RailWidth = railWidthForState(journeyNumber);
  const widthClass = collapsed ? 'w-6' : RAIL_WIDTH_CLASS[width];

  return (
    <aside
      data-rail-side={side}
      data-rail-width={width}
      data-rail-collapsed={collapsed || undefined}
      className={`relationship-rail relationship-rail--${side} ${widthClass}`}
      aria-label={side === 'left' ? 'Your relationship context' : 'Assurance and next step'}
    >
      <div className={collapsed ? 'sr-only' : 'flex flex-col gap-3'}>{children}</div>
    </aside>
  );
}
