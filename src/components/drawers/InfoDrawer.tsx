'use client';

import { useInfoDrawer } from '@/hooks/useInfoDrawer';
import type { InfoDrawer as InfoDrawerData } from '@/lib/content/infoDrawers';
import { cn } from '@/lib/cn';

/**
 * One closed-by-default disclosure drawer ("pulled, not pushed"). Opening logs a
 * drawer.opened event exactly once (via useInfoDrawer). Uses a native disclosure
 * pattern with an accessible button + region.
 */
export function InfoDrawer({ drawer, defaultOpen = false }: { drawer: InfoDrawerData; defaultOpen?: boolean }) {
  const { open, toggle } = useInfoDrawer(drawer.id, drawer.title, defaultOpen);
  const regionId = `drawer-${drawer.id}`;

  return (
    <div className="border-b border-border-soft">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={regionId}
        className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-ink-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary"
      >
        <span className="text-body font-medium text-ink-primary">{drawer.title}</span>
        <span
          aria-hidden
          className={cn('text-lg leading-none text-ink-secondary transition-transform duration-base', open && 'rotate-45')}
        >
          +
        </span>
      </button>
      <div
        id={regionId}
        role="region"
        hidden={!open}
        className={cn('overflow-hidden pb-4', open ? 'block' : 'hidden')}
      >
        <p className="reading text-ink-secondary">{drawer.body}</p>
      </div>
    </div>
  );
}
