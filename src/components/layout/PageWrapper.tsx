import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { BackgroundGrid } from '@/components/visual/BackgroundGrid';

export interface PageWrapperProps {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  lead?: string;
  grid?: boolean;
  className?: string;
}

/** Standard marketing page shell: optional grid hero header + container body. */
export function PageWrapper({ children, eyebrow, title, lead, grid, className }: PageWrapperProps) {
  return (
    <div className={cn('relative', className)}>
      {(eyebrow || title || lead) && (
        <header className="relative overflow-hidden border-b border-line bg-canvas">
          {grid ? <BackgroundGrid /> : null}
          <div className="container-page section">
            {eyebrow ? <SectionLabel>{eyebrow}</SectionLabel> : null}
            {title ? <h1 className="mt-4 max-w-3xl text-web-h1 text-indigo-950">{title}</h1> : null}
            {lead ? <p className="reading mt-4 text-web-lead text-ink-700">{lead}</p> : null}
          </div>
        </header>
      )}
      <div className="container-page section">{children}</div>
    </div>
  );
}
