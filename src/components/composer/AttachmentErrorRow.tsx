'use client';

import { formatBytes } from '@/lib/attachments/formatBytes';
import type { RejectedFile } from '@/types/attachment.types';

/**
 * Files that could not even be staged.
 *
 * They are shown BESIDE the tray, never in place of it, and they NEVER block the
 * turn. A visitor whose 900 MB capture was refused can still send the message
 * with the three files that were accepted.
 *
 * Each row says what happened and what to do about it. It is announced politely
 * so a screen-reader user learns the file was left out without being interrupted
 * mid-sentence.
 */
export interface AttachmentErrorRowProps {
  rejected: RejectedFile[];
  onDismiss: () => void;
}

export function AttachmentErrorRow({ rejected, onDismiss }: AttachmentErrorRowProps) {
  if (rejected.length === 0) return null;

  return (
    <div className="attachment-errors" role="status" aria-live="polite">
      <ul>
        {rejected.map((r) => (
          <li key={`${r.filename}-${r.bytes}`}>
            <strong>{r.filename}</strong> <span>({formatBytes(r.bytes)})</span> — {r.errorMessage}
          </li>
        ))}
      </ul>
      <button type="button" className="attachment-errors__dismiss" onClick={onDismiss}>
        Dismiss
      </button>
    </div>
  );
}
