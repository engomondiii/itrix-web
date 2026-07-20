/**
 * Attachments — client-side mirror of apps.attachments (Backend v6.0 §4).
 *
 * The composer accepts files of ANY format and ANY number (R25). There is no
 * product-level count limit; the server keeps safety caps and reports them as
 * specific, recoverable messages.
 *
 * Four hard boundaries the UI must never contradict (Backend v6.0 §4.6):
 *   1. An attachment NEVER raises a disclosure ceiling.
 *   2. An attachment is NEVER ingested into the Knowledge Core.
 *   3. An attachment is scoped to its thread.
 *   4. The visitor can delete any attachment at any time.
 *
 * Nothing in this file grants authority. `riskFlags` is deliberately absent: it
 * is a team-plane field and must never appear in a client-plane payload
 * (Architecture v2.6 §10.5).
 */

/**
 * The lifecycle, as the SERVER reports it.
 *
 *   staged      accepted locally, upload not started
 *   uploading   bytes in flight (client-side only)
 *   scanning    antivirus + archive-bomb check — ALWAYS before extraction
 *   extracting  sandboxed text extraction
 *   ready       usable as context for this thread
 *   opaque      accepted and stored, but not text-extractable. NOT a failure.
 *   quarantined the scan rejected it; it is never previewable or downloadable
 *   failed      something went wrong; the visitor can retry or send without it
 *   deleted     purged at the visitor's request
 */
export type AttachmentStatus =
  | 'staged'
  | 'uploading'
  | 'scanning'
  | 'extracting'
  | 'ready'
  | 'opaque'
  | 'quarantined'
  | 'failed'
  | 'deleted';

/** Why an attachment could not be used. Drives the visitor-facing sentence. */
export type AttachmentErrorCode =
  | 'too_large'
  | 'turn_too_large'
  | 'session_limit'
  | 'quarantined'
  | 'extraction_failed'
  | 'upload_failed'
  | 'unknown';

export interface Attachment {
  id: string;
  threadId: string | null;
  filename: string;
  /** Bytes. Rendered with formatBytes; never shown as a raw number. */
  bytes: number;
  /** What the browser said. The server's own detection wins once it answers. */
  mimeType: string;
  status: AttachmentStatus;
  /** 0–100 while uploading. Null once the server owns the lifecycle. */
  progress: number | null;
  errorCode?: AttachmentErrorCode | null;
  /** A specific, recoverable sentence. Never a raw server error. */
  errorMessage?: string | null;
  /**
   * True while the thread has no NDA. Drives the restricted-handling notice and
   * the shortened retention the backend applies (Backend v6.0 §4.7).
   */
  preNda?: boolean;
  createdAt: string;
}

/** POST /api/attachments — the staged upload. */
export interface AttachmentUploadResult {
  attachment: Attachment;
}

/** A file the visitor chose that we could not even stage. */
export interface RejectedFile {
  filename: string;
  bytes: number;
  errorCode: AttachmentErrorCode;
  errorMessage: string;
}
