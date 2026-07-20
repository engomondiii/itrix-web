'use client';

import { AttachmentChip } from './AttachmentChip';
import { AttachmentErrorRow } from './AttachmentErrorRow';
import { ATTACHMENT_COPY } from '@/lib/content/attachmentCopy';
import type { Attachment, RejectedFile } from '@/types/attachment.types';

/**
 * The staged files, beneath the prompt.
 *
 * It is a LIST, and each row exposes its name, its status and a keyboard-
 * reachable remove control (Surface 1 v5.0 §7.4). It is not a row of decorative
 * pills — a visitor needs to know what is attached and be able to take one back.
 *
 * The pre-NDA notice appears on FIRST USE in a thread, not on every file. It is
 * the approved confidentiality wording and carries Legal sign-off.
 */
export interface AttachmentTrayProps {
  items: Attachment[];
  rejected: RejectedFile[];
  showNotice: boolean;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  onDismissRejected: () => void;
}

export function AttachmentTray({
  items, rejected, showNotice, onRemove, onRetry, onDismissRejected,
}: AttachmentTrayProps) {
  if (items.length === 0 && rejected.length === 0) return null;

  return (
    <div className="attachment-tray">
      {items.length > 0 ? (
        <>
          <p className="attachment-tray__label">{ATTACHMENT_COPY.trayLabel}</p>
          <ul className="attachment-tray__list">
            {items.map((a) => (
              <AttachmentChip key={a.id} attachment={a} onRemove={onRemove} onRetry={onRetry} />
            ))}
          </ul>
        </>
      ) : null}

      <AttachmentErrorRow rejected={rejected} onDismiss={onDismissRejected} />

      {showNotice && items.length > 0 ? (
        <p className="attachment-tray__notice">{ATTACHMENT_COPY.preNdaNotice}</p>
      ) : null}
    </div>
  );
}
