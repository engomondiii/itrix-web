'use client';

import { formatBytes } from '@/lib/attachments/formatBytes';
import { iconForType } from '@/lib/attachments/iconForType';
import { ATTACHMENT_COPY } from '@/lib/content/attachmentCopy';
import type { Attachment } from '@/types/attachment.types';

/**
 * One staged or uploaded file.
 *
 * STATUS IS TEXT PLUS ICON, NEVER COLOUR ALONE (Surface 1 v5.0 §7.4). The
 * sentence is the meaning; the icon and the tint are reinforcement.
 *
 * `opaque` is styled as a NORMAL state, not an error, because it is one: the
 * file was accepted and stored, we simply could not read inside it.
 *
 * The remove control is always keyboard-reachable and always present — a
 * visitor must be able to take back a document they just attached, including
 * one that is mid-scan.
 */
const GLYPH: Record<string, string> = {
  document: 'M7 3h7l4 4v14H7z M14 3v4h4',
  sheet: 'M4 5h16v14H4z M4 10h16M10 5v14',
  slides: 'M4 5h16v11H4z M12 16v4M9 20h6',
  image: 'M4 5h16v14H4z M8 11l3 3 3-4 4 5H6z',
  code: 'M9 8l-4 4 4 4M15 8l4 4-4 4',
  archive: 'M5 4h14v16H5z M12 4v5M10 9h4',
  file: 'M7 3h7l4 4v14H7z',
};

export interface AttachmentChipProps {
  attachment: Attachment;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
}

export function AttachmentChip({ attachment, onRemove, onRetry }: AttachmentChipProps) {
  const { id, filename, bytes, mimeType, status, progress, errorMessage } = attachment;
  const icon = iconForType(filename, mimeType);
  const isError = status === 'failed' || status === 'quarantined';
  const statusText = errorMessage ?? ATTACHMENT_COPY.status[status];

  return (
    <li className="attachment-chip" data-status={status} data-error={isError || undefined}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="attachment-chip__icon"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={GLYPH[icon] ?? GLYPH.file} />
      </svg>

      <span className="attachment-chip__text">
        <span className="attachment-chip__name" title={filename}>
          {filename}
        </span>
        <span className="attachment-chip__meta">
          {formatBytes(bytes)}
          {' · '}
          <span className="attachment-chip__status">{statusText}</span>
        </span>
      </span>

      {status === 'uploading' && progress !== null ? (
        <span
          className="attachment-chip__progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Uploading ${filename}`}
        >
          <span className="attachment-chip__bar" style={{ width: `${progress}%` }} />
        </span>
      ) : null}

      {status === 'failed' ? (
        <button
          type="button"
          className="attachment-chip__action"
          onClick={() => onRetry(id)}
        >
          {ATTACHMENT_COPY.retryLabel}
        </button>
      ) : null}

      <button
        type="button"
        className="attachment-chip__remove"
        aria-label={`${ATTACHMENT_COPY.removeLabel}: ${filename}`}
        onClick={() => onRemove(id)}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </li>
  );
}
