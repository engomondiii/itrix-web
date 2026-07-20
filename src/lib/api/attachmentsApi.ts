/**
 * Typed client for the attachment proxies (/api/attachments*).
 *
 * Never throws — returns { data } or { error }, matching the house pattern.
 *
 * Upload uses FormData with XHR rather than fetch, for one reason: fetch has no
 * upload-progress event, and a visitor attaching a 60 MB architecture document
 * needs to see that it is moving. Everything else uses fetch.
 */

import type { Attachment, AttachmentUploadResult } from '@/types/attachment.types';
import type { ApiResult } from '@/lib/api/threadsApi';

export const attachmentsApi = {
  /**
   * Stage one file.
   *
   * `threadId` may be null: a visitor can attach BEFORE their first turn creates
   * the thread. The backend binds the attachment to the thread when the turn is
   * submitted with its id.
   */
  upload(
    file: File,
    threadId: string | null,
    onProgress?: (percent: number) => void,
    signal?: AbortSignal,
  ): Promise<ApiResult<AttachmentUploadResult>> {
    return new Promise((resolve) => {
      const form = new FormData();
      form.append('file', file);
      if (threadId) form.append('thread_id', threadId);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/attachments');
      xhr.responseType = 'json';

      xhr.upload.onprogress = (e) => {
        if (!e.lengthComputable || !onProgress) return;
        onProgress(Math.min(99, Math.round((e.loaded / e.total) * 100)));
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const body = xhr.response as AttachmentUploadResult | null;
          resolve(
            body
              ? { data: body, error: null }
              : { data: null, error: 'attachment: empty response' },
          );
          return;
        }
        const detail = (xhr.response as { detail?: string } | null)?.detail;
        resolve({ data: null, error: detail ?? `attachment ${xhr.status}` });
      };

      xhr.onerror = () => resolve({ data: null, error: 'attachment unreachable' });
      xhr.onabort = () => resolve({ data: null, error: 'aborted' });

      signal?.addEventListener('abort', () => xhr.abort(), { once: true });
      xhr.send(form);
    });
  },

  async get(id: string): Promise<ApiResult<Attachment>> {
    try {
      const res = await fetch(`/api/attachments/${encodeURIComponent(id)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: null, error: `attachment ${res.status}` };
      return { data: (await res.json()) as Attachment, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'attachment unreachable' };
    }
  },

  /**
   * Visitor-initiated purge.
   *
   * The backend deletes the blob, the scan, the extraction and every derived
   * excerpt (Backend v6.0 §4.6, rule 4). This is not a soft delete.
   */
  async remove(id: string): Promise<ApiResult<{ deleted: true }>> {
    try {
      const res = await fetch(`/api/attachments/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: null, error: `attachment ${res.status}` };
      return { data: { deleted: true }, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'attachment unreachable' };
    }
  },

  /** The audited download URL. Never a direct blob path. */
  downloadUrl(id: string): string {
    return `/api/attachments/${encodeURIComponent(id)}/download`;
  },
};
