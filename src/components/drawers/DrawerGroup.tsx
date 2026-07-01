'use client';

import { InfoDrawer } from './InfoDrawer';
import { INFO_DRAWERS } from '@/lib/content/infoDrawers';
import type { InfoDrawer as InfoDrawerData } from '@/lib/content/infoDrawers';

/**
 * Groups the seven standard info drawers, closed by default (Playbook §00G).
 * Pass `ids` to render a subset (e.g. only the two most relevant on a page).
 */
export function DrawerGroup({ ids }: { ids?: string[] }) {
  const drawers: InfoDrawerData[] = ids
    ? ids.map((id) => INFO_DRAWERS.find((d) => d.id === id)).filter((d): d is InfoDrawerData => Boolean(d))
    : INFO_DRAWERS;

  return (
    <div className="border-t border-line-subtle">
      {drawers.map((d) => (
        <InfoDrawer key={d.id} drawer={d} />
      ))}
    </div>
  );
}
