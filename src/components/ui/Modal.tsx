'use client';

import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

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
const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function Modal({ open, onClose, title, children, footer, size = 'md', className }: ModalProps) {
  const copy = useCommonCopy();
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const panel = panelRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;

      const items = focusable();
      if (items.length === 0) {
        e.preventDefault();
        panel.focus();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusFrame = window.requestAnimationFrame(() => {
      const currentPanel = panelRef.current;
      if (!currentPanel || currentPanel.contains(document.activeElement)) return;
      focusable()[0]?.focus();
      if (!currentPanel.contains(document.activeElement)) currentPanel.focus();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      const opener = openerRef.current;
      if (opener?.isConnected) opener.focus();
      openerRef.current = null;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-structure-900/40 backdrop-blur-[1px] animate-fade-in" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn('relative w-full rounded-lg border border-border-medium bg-surface shadow-3 animate-scale-in focus:outline-none', sizeClass[size], className)}
      >
        {title ? (
          <div className="flex items-center justify-between border-b border-border-medium px-5 py-4">
            <h2 id={titleId} className="text-section text-ink-primary">{title}</h2>
            <button type="button" onClick={onClose} aria-label={copy.close} className="rounded-sm p-1 text-ink-secondary transition-colors hover:bg-soft hover:text-ink-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary">
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
