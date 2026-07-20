'use client';

import { useRef } from 'react';
import { ACCEPT_ATTRIBUTE } from '@/lib/attachments/accept';
import { ATTACHMENT_COPY } from '@/lib/content/attachmentCopy';

/**
 * The attach control.
 *
 *   accept="*​/*"   ANY FORMAT
 *   multiple       ANY NUMBER
 *
 * There is no allow-list and no extension filter, because the change request is
 * explicit: the composer accepts documents of any format and as many as the
 * visitor has (R25). An unsupported binary is still accepted, stored, and
 * described honestly — it is never reported as a failure.
 *
 * It is icon-only and therefore REQUIRES an accessible name (§7.4). The name
 * lives once, in ATTACHMENT_COPY, so it cannot drift from the tray's labels.
 *
 * Drag-and-drop and paste are handled by the Composer, which owns the drop
 * target — the whole prompt shell should accept a dropped file, not just this
 * 32px button.
 */
export interface AttachControlProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}

export function AttachControl({ onFiles, disabled = false }: AttachControlProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPT_ATTRIBUTE}
        multiple
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) onFiles(files);
          /* Reset so choosing the same file twice still fires a change event. */
          e.target.value = '';
        }}
      />

      <button
        type="button"
        className="composer-attach"
        aria-label={ATTACHMENT_COPY.attachLabel}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="composer-attach__icon"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18.5 11.5 12 18a4.24 4.24 0 0 1-6-6l7.5-7.5a3 3 0 0 1 4.24 4.24L10 16.5a1.77 1.77 0 0 1-2.5-2.5l6.5-6.5" />
        </svg>
      </button>
    </>
  );
}
