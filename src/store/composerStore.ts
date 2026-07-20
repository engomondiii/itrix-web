import { create } from 'zustand';
import type { FunctionalFamily } from '@/lib/content/examplePrompts';

/**
 * The composer's own state.
 *
 * It lives in a store rather than in component state for one reason: the example
 * chips on the landing and (from Phase 2) the suggestion chips above the
 * composer both POPULATE it without submitting. Passing that through props would
 * mean the chips and the composer had to be siblings, which they are not.
 *
 * NOTE WHAT IS NOT HERE: there is no `maxLength`, no character count and no
 * `over` flag. The 600-character ceiling is gone (R28). The server keeps a
 * safety cap and reports it as a recoverable message; the UI never pre-empts the
 * visitor's sentence.
 *
 * `familyPrior` is an internal ROUTING PRIOR recorded when a visitor uses an
 * example chip verbatim. It is sent to the backend and never rendered back.
 */
interface ComposerState {
  value: string;
  submitting: boolean;
  error: string | null;
  familyPrior: FunctionalFamily | null;
  /** Set when the composer should take focus — chips use it after populating. */
  focusRequest: number;

  setValue: (value: string) => void;
  /** Populate from a chip. Never submits. */
  populate: (value: string, family?: FunctionalFamily | null) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
  requestFocus: () => void;
  clear: () => void;
}

export const useComposerStore = create<ComposerState>((set) => ({
  value: '',
  submitting: false,
  error: null,
  familyPrior: null,
  focusRequest: 0,

  setValue: (value) => set((s) => ({ value, error: s.error ? null : s.error })),

  populate: (value, family = null) =>
    set((s) => ({
      value,
      familyPrior: family,
      error: null,
      focusRequest: s.focusRequest + 1,
    })),

  setSubmitting: (submitting) => set({ submitting }),
  setError: (error) => set({ error }),
  requestFocus: () => set((s) => ({ focusRequest: s.focusRequest + 1 })),

  clear: () => set({ value: '', error: null, familyPrior: null }),
}));
