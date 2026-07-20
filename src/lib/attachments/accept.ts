import type { AttachmentErrorCode, RejectedFile } from '@/types/attachment.types';

/**
 * Client-side acceptance.
 *
 * THE RULE IS "ANY FORMAT, ANY NUMBER" (R25). This module therefore does NOT
 * filter by type — there is no allow-list, no extension check and no MIME
 * gate. The only thing checked here is SIZE, and only so a visitor learns their
 * 900 MB file is too large before waiting for the upload to fail.
 *
 * These limits mirror the server's (Backend v6.0 §4.2) and are a convenience,
 * not the enforcement point. The server is authoritative; if these drift, the
 * server still refuses and the visitor still gets a specific message.
 */
export const MAX_ATTACHMENT_BYTES = 100 * 1024 * 1024;        // 100 MB per file
export const MAX_ATTACHMENT_BYTES_PER_TURN = 500 * 1024 * 1024; // 500 MB per turn

/** Accept everything. Declared once so no input can quietly narrow it. */
export const ACCEPT_ATTRIBUTE = '*/*';

export interface AcceptResult {
  accepted: File[];
  rejected: RejectedFile[];
}

function reject(file: File, code: AttachmentErrorCode, message: string): RejectedFile {
  return { filename: file.name, bytes: file.size, errorCode: code, errorMessage: message };
}

/**
 * Partition a chosen file list into what can be staged and what cannot.
 *
 * A rejected file NEVER blocks the turn or the other files — it is reported
 * beside them and the visitor can still send (Surface 1 v5.0 §3.6).
 */
export function acceptFiles(
  files: readonly File[],
  alreadyStagedBytes: number,
  messages: {
    tooLarge: (name: string) => string;
    turnTooLarge: (name: string) => string;
  },
): AcceptResult {
  const accepted: File[] = [];
  const rejected: RejectedFile[] = [];
  let running = alreadyStagedBytes;

  for (const file of files) {
    if (file.size > MAX_ATTACHMENT_BYTES) {
      rejected.push(reject(file, 'too_large', messages.tooLarge(file.name)));
      continue;
    }
    if (running + file.size > MAX_ATTACHMENT_BYTES_PER_TURN) {
      rejected.push(reject(file, 'turn_too_large', messages.turnTooLarge(file.name)));
      continue;
    }
    running += file.size;
    accepted.push(file);
  }

  return { accepted, rejected };
}

/** Files pasted into the composer, if any. Images and documents both arrive here. */
export function filesFromClipboard(items: DataTransferItemList | null): File[] {
  if (!items) return [];
  const out: File[] = [];
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item.kind !== 'file') continue;
    const file = item.getAsFile();
    if (file) out.push(file);
  }
  return out;
}
