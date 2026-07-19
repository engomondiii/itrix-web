'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { RailGrowth } from './RailGrowth';
import { RailSection } from './RailSection';
import { RailSheet } from './RailSheet';
import { AmbientLeftRail, AmbientRightRail } from './AmbientRails';
import { railWidthForState } from '@/lib/journey/railSections';
import { useRailsContext } from '@/context/RailsContext';
import { useJourneyContext } from '@/context/JourneyContext';
import { useShellStore } from '@/store/shellStore';
import { siteConfig } from '@/config/site.config';
import '@/components/shell/rails';

export interface RelationshipShellProps {
  children: ReactNode;
  /**
   * Override the journey number. Public routes have no journey token, so they
   * pass 1 and get the ambient State 1 treatment. Token-gated trees inside a
   * JourneyProvider leave this undefined and the shell reads the real state.
   */
  journeyNumber?: number;
}

/**
 * The adaptive relationship shell (Surface 1 v4.0 §3, Architecture v2.5 §11.6).
 *
 *   One evolving relationship home, not a sequence of unrelated pages.
 *   The centre is invariant; the rails grow as the visitor becomes known
 *   and the work becomes real.
 *
 * PHASE 2 makes the rails real. Their CONTENT is the authorized section list the
 * backend returned — this component decides geometry and nothing else. Three
 * consequences, all of them acceptance criteria:
 *
 *   · Removing a section from the backend payload removes it from the UI, because
 *     nothing here holds a hard-coded list.
 *   · A rail with no renderable sections does not mount, so there is never an
 *     empty decorative dashboard.
 *   · A visitor cannot widen their own rails: the number comes from the journey
 *     subscription, which comes from the backend.
 *
 * With NEXT_PUBLIC_ENABLE_RELATIONSHIP_SHELL off, useRails returns empty lists
 * and the shell falls back to the ambient Phase 1 rails — every route behaves
 * exactly as before.
 */
export function RelationshipShell({ children, journeyNumber }: RelationshipShellProps) {
  const pathname = usePathname();
  const journey = useJourneyContext();
  const { left, right } = useRailsContext();
  const leftCollapsed = useShellStore((s) => s.leftCollapsed);
  const rightCollapsed = useShellStore((s) => s.rightCollapsed);

  const shellEnabled = siteConfig.featureFlags.relationshipShell;
  const n = journeyNumber ?? journey.journeyNumber ?? 1;
  const width = railWidthForState(n);
  const ambient = width === 'ambient' || !shellEnabled;

  // A rail mounts only when it has something to draw.
  const hasLeft = ambient || left.length > 0;
  const hasRight = ambient || right.length > 0;

  const leftContent = ambient
    ? <AmbientLeftRail />
    : left.map((key) => <RailSection key={key} sectionKey={key} side="left" />);

  const rightContent = ambient
    ? <AmbientRightRail />
    : right.map((key) => <RailSection key={key} sectionKey={key} side="right" />);

  return (
    <div className="relationship-shell" data-journey-state={n} data-rail-width={width}>
      {/* Structural motif — layered grid and route lines. Decorative. */}
      <div aria-hidden="true" className="relationship-shell__motif" />

      {hasLeft ? (
        <RailGrowth journeyNumber={ambient ? 1 : n} side="left" collapsed={leftCollapsed}>
          {leftContent}
        </RailGrowth>
      ) : (
        <div aria-hidden="true" />
      )}

      {/* The invariant centre. `key` is deliberately NOT the pathname: the centre
          morphs rather than remounting, so scroll and focus survive a state
          change (StateMorph owns that; see §11.9). */}
      <main id="content" className="relationship-shell__center" data-pathname={pathname}>
        {children}
        <RailSheet
          left={<>{leftContent}</>}
          right={<>{rightContent}</>}
          hasLeft={!ambient && left.length > 0}
          hasRight={!ambient && right.length > 0}
        />
      </main>

      {hasRight ? (
        <RailGrowth journeyNumber={ambient ? 1 : n} side="right" collapsed={rightCollapsed}>
          {rightContent}
        </RailGrowth>
      ) : (
        <div aria-hidden="true" />
      )}
    </div>
  );
}
