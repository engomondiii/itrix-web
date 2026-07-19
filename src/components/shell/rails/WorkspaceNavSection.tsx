'use client';

import Link from 'next/link';
import type { RailSectionRenderProps } from '@/lib/journey/railSections';
import { RailPanel } from './_primitives';
import { SUCCESS_NAV } from '@/config/portal.config';

/**
 * Customer workspace navigation (States 7–10).
 *
 * The left rail at a workspace state is navigation as well as memory — a
 * customer working through outcomes, deployments and support needs to move
 * between them without returning to a hub. The section keys the backend
 * authorizes decide WHETHER this appears; it decides nothing itself.
 */
export function WorkspaceNavSection({ sectionKey }: RailSectionRenderProps) {
  // The backend authorizes individual areas; we show the whole map only when it
  // authorizes the overview, and otherwise highlight the single area it named.
  const single = sectionKey && sectionKey !== 'overview'
    ? SUCCESS_NAV.find((n) => n.key === sectionKey)
    : null;

  const items = single ? [single] : SUCCESS_NAV;

  return (
    <RailPanel title="Your workspace">
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.key}>
            <Link href={item.href} className="text-caption text-ink-secondary hover:text-ink-primary">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </RailPanel>
  );
}
