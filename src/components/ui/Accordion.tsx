'use client';

import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({ items, defaultOpenId, allowMultiple = false, className }: AccordionProps) {
  const [open, setOpen] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);
  const baseId = useId();

  function toggle(id: string) {
    setOpen((prev) => {
      const isOpen = prev.includes(id);
      if (allowMultiple) return isOpen ? prev.filter((x) => x !== id) : [...prev, id];
      return isOpen ? [] : [id];
    });
  }

  return (
    <div className={cn('divide-y divide-line rounded-md border border-line bg-surface', className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        const btnId = `${baseId}-${item.id}-btn`;
        const panelId = `${baseId}-${item.id}-panel`;
        return (
          <div key={item.id}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-card-title text-ink-900 transition-colors hover:bg-surface-warm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600 focus-visible:ring-inset"
              >
                <span>{item.title}</span>
                <span aria-hidden className={cn('text-ink-400 transition-transform duration-base', isOpen && 'rotate-45')}>+</span>
              </button>
            </h3>
            <div id={panelId} role="region" aria-labelledby={btnId} hidden={!isOpen} className="px-5 pb-5 text-secondary text-ink-700">
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
