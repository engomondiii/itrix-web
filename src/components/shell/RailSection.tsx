'use client';

import { createElement, useMemo } from 'react';
import { resolveRailSection } from '@/lib/journey/railSections';

export interface RailSectionProps {
  sectionKey: string;
  side: 'left' | 'right';
}

/**
 * Resolves ONE authorized section key to its component.
 *
 * The closed-registry resolver (Surface 1 v4.0 §3.2 rule 1): a key the frontend
 * does not know renders NOTHING. It is never guessed at, never shown as a
 * placeholder, and never throws.
 *
 * That matters because the key list comes from the backend. If the two
 * vocabularies drift, the failure mode must be a missing panel and a development
 * warning — not a broken page, and certainly not a panel that invents content to
 * fill itself.
 *
 * The element is built with createElement inside a memo rather than being
 * rendered as `<Section />` from a local variable. Resolving a component type
 * during render and using it as JSX makes React treat it as a new component on
 * every pass, which remounts the section — and a remounting rail loses its
 * internal state, so an opened NDA drawer would silently close itself.
 */
export function RailSection({ sectionKey, side }: RailSectionProps) {
  const element = useMemo(() => {
    const Section = resolveRailSection(sectionKey);
    return Section ? createElement(Section, { sectionKey }) : null;
  }, [sectionKey]);

  if (!element) return null;

  return (
    <div data-rail-section={sectionKey} data-rail-side={side}>
      {element}
    </div>
  );
}
