'use client';

import { attachmentsApi } from '@/lib/api/attachmentsApi';
import { formatBytes } from '@/lib/attachments/formatBytes';
import type { TurnAttachment } from '@/types/thread.types';

export function TurnAttachmentList({ attachments }: { attachments: TurnAttachment[] }) {
  if (attachments.length === 0) return null;

  return (
    <ul className="turn-attachments" aria-label="Attached documents">
      {attachments.map((attachment) => (
        <li key={attachment.id}>
          <a
            className="turn-attachment"
            href={attachmentsApi.downloadUrl(attachment.id)}
            title={`Download ${attachment.filename}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="turn-attachment__icon" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3h7l4 4v14H7z" />
              <path d="M14 3v4h4" />
            </svg>
            <span className="turn-attachment__text">
              <span className="turn-attachment__name">{attachment.filename}</span>
              <span className="turn-attachment__meta">{formatBytes(attachment.bytes)}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
