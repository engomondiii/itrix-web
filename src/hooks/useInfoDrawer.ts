'use client';

import { useCallback, useState } from 'react';
import { trackDrawerOpened } from '@/lib/analytics/trackDrawerOpened';

/**
 * Open/close state for a single info drawer. Closed by default; opening logs a
 * drawer.opened event exactly once per open transition ("pulled, not pushed").
 */
export function useInfoDrawer(drawerId: string, title: string, initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (next) trackDrawerOpened(drawerId, title);
      return next;
    });
  }, [drawerId, title]);

  const openDrawer = useCallback(() => {
    setOpen((prev) => {
      if (!prev) trackDrawerOpened(drawerId, title);
      return true;
    });
  }, [drawerId, title]);

  const closeDrawer = useCallback(() => setOpen(false), []);

  return { open, toggle, openDrawer, closeDrawer };
}
