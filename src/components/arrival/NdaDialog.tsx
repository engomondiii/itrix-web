'use client';

import { useEffect, useRef } from 'react';
import { ARRIVAL_NDA_DIALOG } from '@/lib/content/arrivalCopy';

/**
 * The controlled-public drawer: "What can be shared before an NDA?"
 *
 * DO NOT REWORD THE BODY WITHOUT LEGAL SIGN-OFF. It states the pre-NDA boundary
 * and is the visitor's answer to "how much can I safely say?" before they type
 * anything.
 *
 * Uses the native <dialog> element so focus trapping, Escape and the backdrop
 * come from the platform rather than from a hand-rolled trap that will drift.
 * Focus returns to the opener on close, which the browser also handles.
 */
export function NdaDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="arrival-dialog"
      aria-labelledby="arrival-dialog-title"
      onClose={onClose}
      onCancel={onClose}
    >
      <div className="arrival-dialog__inner">
        <button
          type="button"
          className="arrival-dialog__close"
          aria-label={ARRIVAL_NDA_DIALOG.close}
          onClick={onClose}
        >
          ×
        </button>

        <p className="arrival-label">{ARRIVAL_NDA_DIALOG.tier}</p>
        <h2 id="arrival-dialog-title">{ARRIVAL_NDA_DIALOG.title}</h2>
        <p>{ARRIVAL_NDA_DIALOG.body}</p>

        <button type="button" className="arrival-button-primary" onClick={onClose}>
          {ARRIVAL_NDA_DIALOG.dismiss}
        </button>
      </div>
    </dialog>
  );
}
