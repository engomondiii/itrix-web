import { create } from 'zustand';
import type { Attachment, RejectedFile } from '@/types/attachment.types';

/**
 * Staged and uploaded attachments for the current composer.
 *
 * IN MEMORY ONLY, deliberately. An attachment is the visitor's own document; a
 * reference to it does not belong in localStorage, and the backend already holds
 * it under a documented retention window with a shorter pre-NDA default
 * (Backend v6.0 §4.7).
 *
 * `rejected` is separate from `items` because a rejected file was never staged —
 * it has no id and no server-side existence. It is shown beside the tray so the
 * visitor knows what was left out, and it NEVER blocks the turn.
 */
interface AttachmentState {
  items: Attachment[];
  rejected: RejectedFile[];
  /** Set once per thread, so the pre-NDA notice is shown but not nagged. */
  noticeShown: boolean;

  add: (attachment: Attachment) => void;
  update: (id: string, patch: Partial<Attachment>) => void;
  remove: (id: string) => void;
  addRejected: (files: RejectedFile[]) => void;
  clearRejected: () => void;
  markNoticeShown: () => void;
  /** Called after a successful send: the tray belongs to the next turn now. */
  clear: () => void;
}

export const useAttachmentStore = create<AttachmentState>((set) => ({
  items: [],
  rejected: [],
  noticeShown: false,

  add: (attachment) => set((s) => ({ items: [...s.items, attachment] })),

  update: (id, patch) =>
    set((s) => ({ items: s.items.map((a) => (a.id === id ? { ...a, ...patch } : a)) })),

  remove: (id) => set((s) => ({ items: s.items.filter((a) => a.id !== id) })),

  addRejected: (files) => set((s) => ({ rejected: [...s.rejected, ...files] })),
  clearRejected: () => set({ rejected: [] }),
  markNoticeShown: () => set({ noticeShown: true }),

  clear: () => set({ items: [], rejected: [] }),
}));

/** Total staged bytes — used to check the per-turn ceiling before uploading. */
export function stagedBytes(items: readonly Attachment[]): number {
  return items.reduce((sum, a) => sum + a.bytes, 0);
}

/**
 * Ids to send with the turn.
 *
 * Only attachments the server has accepted. A file still uploading is excluded
 * rather than waited for — the send button blocks on that separately, and a
 * FAILED file is excluded entirely so it can never hold a message hostage.
 */
export function sendableIds(items: readonly Attachment[]): string[] {
  return items
    .filter((a) => a.status === 'ready' || a.status === 'opaque' || a.status === 'scanning' || a.status === 'extracting')
    .map((a) => a.id);
}

/** True while something is still in flight and the send should wait. */
export function hasPendingUpload(items: readonly Attachment[]): boolean {
  return items.some((a) => a.status === 'staged' || a.status === 'uploading');
}
