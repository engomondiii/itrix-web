import { create } from 'zustand';

/**
 * Whether the "keep this conversation" card has been dismissed, per thread.
 *
 * ── WHY THIS IS A STORE AND NOT COMPONENT STATE ─────────────────────────────
 * NOT IN THE v8.0 §05 FILE LIST — added for the same reason `pendingStore` was added in
 * Phase 2, and recorded in the package README rather than smuggled in.
 *
 * The card lives in the transcript and the dismissal has to survive a thread switch and a
 * remount: `Transcript` unmounts and remounts when the visitor moves between conversations,
 * and component state would bring the card back. Playbook v1.9 §18H is explicit that a
 * second appearance turns an offer into pressure, and the card's whole justification is
 * that it is not pressure.
 *
 * Deliberately NOT persisted to storage. It is a session-scoped courtesy, and writing a
 * per-thread record of what an anonymous visitor declined would be building the
 * cross-visit profile the platform promises not to keep.
 */
interface KeepWorkState {
  dismissed: Record<string, true>;
  dismiss: (threadId: string) => void;
  isDismissed: (threadId: string | null) => boolean;
}

export const useKeepWorkStore = create<KeepWorkState>((set, get) => ({
  dismissed: {},
  dismiss: (threadId) =>
    set((s) => (s.dismissed[threadId] ? s : { dismissed: { ...s.dismissed, [threadId]: true } })),
  isDismissed: (threadId) => (threadId ? Boolean(get().dismissed[threadId]) : false),
}));
