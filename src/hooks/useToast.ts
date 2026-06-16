'use client';

import { useUiStore } from '@/store/uiStore';
import type { ToastItem, ToastTone } from '@/store/uiStore';

export interface ToastOptions {
  tone?: ToastTone;
  title: string;
  description?: string;
  duration?: number;
}

/** Thin hook over the UI store's toast queue. Render with <ToastProvider />. */
export function useToast() {
  const addToast = useUiStore((s) => s.addToast);
  const removeToast = useUiStore((s) => s.removeToast);

  function toast(opts: ToastOptions): string {
    return addToast({ tone: opts.tone ?? 'info', title: opts.title, description: opts.description, duration: opts.duration ?? 4500 });
  }

  return {
    toast,
    success: (title: string, description?: string) => toast({ tone: 'success', title, description }),
    error: (title: string, description?: string) => toast({ tone: 'error', title, description }),
    dismiss: removeToast,
  };
}

export type { ToastItem };
