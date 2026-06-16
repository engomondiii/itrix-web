'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/cn';
import type { ToastItem } from '@/store/uiStore';

const toneStyle: Record<ToastItem['tone'], { bar: string; bg: string; fg: string }> = {
  info: { bar: 'var(--sapphire-600)', bg: 'var(--sapphire-50)', fg: 'var(--sapphire-700)' },
  success: { bar: 'var(--success-600)', bg: 'var(--success-soft)', fg: 'var(--success-text)' },
  warning: { bar: 'var(--warning-600)', bg: 'var(--warning-soft)', fg: 'var(--warning-text)' },
  error: { bar: 'var(--error-600)', bg: 'var(--error-soft)', fg: 'var(--error-text)' },
};

export interface ToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const { bar, bg, fg } = toneStyle[toast.tone];

  useEffect(() => {
    if (toast.duration <= 0) return;
    const t = window.setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => window.clearTimeout(t);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-auto flex w-80 items-start gap-3 overflow-hidden rounded-md border border-line bg-surface shadow-2 animate-slide-down"
    >
      <span aria-hidden className="self-stretch" style={{ width: 3, backgroundColor: bar }} />
      <div className="flex-1 py-3 pr-2">
        <p className="text-card-title text-ink-900">{toast.title}</p>
        {toast.description ? <p className="mt-0.5 text-caption text-ink-500">{toast.description}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="m-2 rounded-sm px-1.5 text-ink-400 transition-colors hover:bg-surface-sunken"
        style={{ color: fg, background: bg }}
      >
        ×
      </button>
    </div>
  );
}
