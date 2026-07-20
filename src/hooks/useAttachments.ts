'use client';

import { useCallback, useEffect, useRef } from 'react';
import { attachmentsApi } from '@/lib/api/attachmentsApi';
import {
  useAttachmentStore, stagedBytes, sendableIds, hasPendingUpload,
} from '@/store/attachmentStore';
import { acceptFiles } from '@/lib/attachments/accept';
import { ATTACHMENT_COPY } from '@/lib/content/attachmentCopy';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { Attachment } from '@/types/attachment.types';

/**
 * Stage, upload, track and purge attachments.
 *
 * ANY FORMAT, ANY NUMBER (R25). Nothing here filters by type; only size is
 * checked client-side, and only so a visitor is not left waiting for an upload
 * that was always going to be refused.
 *
 * Three behaviours that matter more than the plumbing:
 *
 *   · A FAILED FILE NEVER BLOCKS THE TURN. It is reported beside the tray and
 *     the visitor can still send (Surface 1 v5.0 §3.6).
 *   · AN UNREADABLE FILE IS NOT A FAILURE. `opaque` is a success state with an
 *     honest sentence. We never tell someone their document was worthless.
 *   · DELETION IS A PURGE. Removing an uploaded attachment calls the backend,
 *     which deletes the blob, the scan, the extraction and every derived
 *     excerpt (Backend v6.0 §4.6).
 */
export interface UseAttachmentsResult {
  items: Attachment[];
  rejected: ReturnType<typeof useAttachmentStore.getState>['rejected'];
  /** Ids to send with the turn. */
  ids: string[];
  /** True while an upload is in flight — the send waits, but never fails. */
  uploading: boolean;
  noticeShown: boolean;
  addFiles: (files: readonly File[]) => void;
  retry: (id: string) => void;
  remove: (id: string) => void;
  dismissRejected: () => void;
  clear: () => void;
}

/** A local id used only until the server issues a real one. */
function localId(): string {
  const rand =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `att_local_${rand}`;
}

export function useAttachments(threadId: string | null): UseAttachmentsResult {
  const items = useAttachmentStore((s) => s.items);
  const rejected = useAttachmentStore((s) => s.rejected);
  const noticeShown = useAttachmentStore((s) => s.noticeShown);
  const add = useAttachmentStore((s) => s.add);
  const update = useAttachmentStore((s) => s.update);
  const removeLocal = useAttachmentStore((s) => s.remove);
  const addRejected = useAttachmentStore((s) => s.addRejected);
  const clearRejected = useAttachmentStore((s) => s.clearRejected);
  const markNoticeShown = useAttachmentStore((s) => s.markNoticeShown);
  const clearAll = useAttachmentStore((s) => s.clear);

  /** Keeps the original File so a failed upload can be retried without re-picking. */
  const fileCache = useRef(new Map<string, File>());

  /* The backend reports scan and extraction outcomes asynchronously. */
  useSocket({
    url: threadId ? wsUrls.review(threadId) : null,
    enabled: siteConfig.featureFlags.attachments && siteConfig.featureFlags.realtime && Boolean(threadId),
    handlers: {
      'attachment.status': (p) => {
        update(p.attachmentId, {
          status: p.status,
          errorCode: p.errorCode ?? null,
          errorMessage: p.error ?? null,
          progress: null,
        });
      },
    },
  });

  const upload = useCallback(
    async (tempId: string, file: File) => {
      update(tempId, { status: 'uploading', progress: 0 });

      const { data, error } = await attachmentsApi.upload(file, threadId, (percent) =>
        update(tempId, { progress: percent }),
      );

      if (data) {
        /* Swap the local placeholder for the server's record, keeping the same
           row so the visitor does not see it disappear and reappear. */
        update(tempId, { ...data.attachment, id: tempId, progress: null });
        fileCache.current.delete(tempId);
        trackEvent('attachment.uploaded', { bytes: file.size, mime: file.type || 'unknown' });
        return;
      }

      update(tempId, {
        status: 'failed',
        progress: null,
        errorCode: 'upload_failed',
        errorMessage: error ?? ATTACHMENT_COPY.errors.uploadFailed,
      });
    },
    [threadId, update],
  );

  const addFiles = useCallback(
    (files: readonly File[]) => {
      if (files.length === 0) return;

      const current = useAttachmentStore.getState().items;
      const { accepted, rejected: refused } = acceptFiles(files, stagedBytes(current), {
        tooLarge: ATTACHMENT_COPY.errors.tooLarge,
        turnTooLarge: ATTACHMENT_COPY.errors.turnTooLarge,
      });

      if (refused.length > 0) addRejected(refused);
      if (accepted.length === 0) return;

      if (!useAttachmentStore.getState().noticeShown) markNoticeShown();

      for (const file of accepted) {
        const id = localId();
        fileCache.current.set(id, file);
        add({
          id,
          threadId,
          filename: file.name,
          bytes: file.size,
          mimeType: file.type || 'application/octet-stream',
          status: 'staged',
          progress: null,
          createdAt: new Date().toISOString(),
        });
        void upload(id, file);
      }
    },
    [threadId, add, addRejected, markNoticeShown, upload],
  );

  const retry = useCallback(
    (id: string) => {
      const file = fileCache.current.get(id);
      if (!file) return;
      void upload(id, file);
    },
    [upload],
  );

  const remove = useCallback(
    (id: string) => {
      const item = useAttachmentStore.getState().items.find((a) => a.id === id);
      removeLocal(id);
      fileCache.current.delete(id);

      /* Only purge server-side if the server ever had it. A file that never
         finished uploading has nothing to delete. */
      if (item && item.status !== 'staged' && item.status !== 'failed') {
        void attachmentsApi.remove(id);
      }
    },
    [removeLocal],
  );

  useEffect(() => {
    const cache = fileCache.current;
    return () => cache.clear();
  }, [threadId]);

  return {
    items,
    rejected,
    ids: sendableIds(items),
    uploading: hasPendingUpload(items),
    noticeShown,
    addFiles,
    retry,
    remove,
    dismissRejected: clearRejected,
    clear: clearAll,
  };
}
