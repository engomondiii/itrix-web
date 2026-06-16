'use client';

import { useUiStore } from '@/store/uiStore';
import { Toast } from './Toast';

/**
 * Mounts the toast viewport and renders the UI store's queue. Place once,
 * high in the tree (it lives in the root layout). Push toasts with useToast().
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toasts = useUiStore((s) => s.toasts);
  const removeToast = useUiStore((s) => s.removeToast);

  return (
    <>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[60] flex flex-col gap-2" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </div>
    </>
  );
}
