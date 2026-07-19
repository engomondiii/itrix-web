'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClass = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' } as const;

export function Modal({ open, onClose, title, children, footer, size = 'md', className }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-structure-900/40 backdrop-blur-[1px] animate-fade-in" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className={cn('relative w-full rounded-lg border border-border-medium bg-surface shadow-3 animate-scale-in focus:outline-none', sizeClass[size], className)}
      >
        {title ? (
          <div className="flex items-center justify-between border-b border-border-medium px-5 py-4">
            <h2 className="text-section text-ink-primary">{title}</h2>
            <button type="button" onClick={onClose} aria-label="Close" className="rounded-sm p-1 text-ink-secondary transition-colors hover:bg-soft hover:text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary">
              <span aria-hidden className="text-lg leading-none">×</span>
            </button>
          </div>
        ) : null}
        <div className="px-5 py-5 text-secondary text-ink-secondary">{children}</div>
        {footer ? <div className="flex justify-end gap-3 border-t border-border-medium px-5 py-4">{footer}</div> : null}
      </div>
    </div>
  );
}
