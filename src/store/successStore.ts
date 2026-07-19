import { create } from 'zustand';

/**
 * Transient customer-success UI state.
 *
 * Deliberately NOT persisted. A satisfaction pulse, a half-typed support request
 * and a dismissed change digest are all things a customer should be able to walk
 * away from; restoring them on the next visit would be the interface remembering
 * something the person chose to drop.
 *
 * Nothing here gates content. It records what the customer has done in this
 * session, so the UI does not ask twice.
 */
interface SuccessState {
  /** Pulse submitted this session — so we don't re-prompt. */
  pulseSubmitted: boolean;
  /** ISO timestamp the customer last acknowledged the change digest. */
  changesSeenAt: string | null;
  /** Draft support subject/body, kept while navigating within the zone. */
  supportDraft: { subject: string; body: string };

  markPulseSubmitted: () => void;
  markChangesSeen: (at: string) => void;
  setSupportDraft: (draft: Partial<{ subject: string; body: string }>) => void;
  clearSupportDraft: () => void;
}

export const useSuccessStore = create<SuccessState>()((set) => ({
  pulseSubmitted: false,
  changesSeenAt: null,
  supportDraft: { subject: '', body: '' },

  markPulseSubmitted: () => set({ pulseSubmitted: true }),
  markChangesSeen: (changesSeenAt) => set({ changesSeenAt }),
  setSupportDraft: (draft) => set((s) => ({ supportDraft: { ...s.supportDraft, ...draft } })),
  clearSupportDraft: () => set({ supportDraft: { subject: '', body: '' } }),
}));
