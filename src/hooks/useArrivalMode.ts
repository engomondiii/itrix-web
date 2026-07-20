'use client';

import { useThreadStore } from '@/store/threadStore';
import { useTranscriptStore } from '@/store/transcriptStore';

/**
 * Has the visitor spoken yet?
 *
 * This single predicate decides which of the two surfaces renders:
 *
 *   true   the approved arrival screen — header, rails, big centre, footer
 *   false  the conversation shell — sidebar, transcript, docked composer
 *
 * It is deliberately derived from the TRANSCRIPT rather than from the journey
 * state. Journey state comes from the backend and can lag a turn behind; the
 * visitor's own first sentence is the honest threshold, and it is the one they
 * will remember crossing.
 *
 * HYDRATION NOTE, and it is why `activeThreadId` is not persisted: on a fresh
 * load the store starts empty, so the server and the first client render agree
 * on arrival. The persisted thread LIST rehydrates afterwards and does not feed
 * this predicate, so there is no mismatch to warn about.
 */
export function useArrivalMode(): boolean {
  const activeThreadId = useThreadStore((s) => s.activeThreadId);
  const turnsByThread = useTranscriptStore((s) => s.turnsByThread);

  if (!activeThreadId) return true;
  return (turnsByThread[activeThreadId] ?? []).length === 0;
}
