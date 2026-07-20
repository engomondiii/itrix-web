'use client';

import { useCallback, useState } from 'react';
import { useSocket } from '@/lib/realtime/useSocket';
import { wsUrls } from '@/lib/realtime/wsUrls';
import { siteConfig } from '@/config/site.config';
import { useComposerStore } from '@/store/composerStore';
import { useShellContext } from '@/context/ShellContext';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * The generated follow-up questions.
 *
 * The DIVISION OF AUTHORITY is the whole point (Architecture v2.6 §3.1):
 *
 *   · A deterministic coverage tracker and stop rule on the backend decide
 *     WHETHER to ask and when to stop. Layer 1 stays LLM-free.
 *   · The language model decides only the WORDING, bound to Claim-Card level 1 —
 *     it may ask, never assert, and never reveals an inference.
 *
 * This hook renders the result. It does not generate, rank or invent a question,
 * and it does not decide when the loop ends: `questionLoopOpen` comes from the
 * shell contract, so a visitor cannot keep the loop open by staying on the page.
 *
 * Chips are cleared the moment the visitor submits — a stale suggestion sitting
 * under a new answer implies we did not hear the last one.
 */
export interface Suggestion {
  id: string;
  text: string;
}

export interface UseSuggestionsResult {
  chips: Suggestion[];
  /** True only when the backend says the loop is open AND chips exist. */
  visible: boolean;
  /** POPULATES the composer and focuses it. Never submits. */
  choose: (suggestion: Suggestion) => void;
  clear: () => void;
}

/**
 * Chips are KEYED BY THREAD. Switching conversations therefore needs no clearing
 * effect — a stale suggestion from another thread simply is not returned.
 */
interface ChipState {
  threadId: string | null;
  chips: Suggestion[];
}

export function useSuggestions(threadId: string | null): UseSuggestionsResult {
  const [state, setState] = useState<ChipState>({ threadId: null, chips: [] });
  const populate = useComposerStore((s) => s.populate);
  const { questionLoopOpen } = useShellContext();

  const enabled =
    siteConfig.featureFlags.adaptiveQuestions &&
    siteConfig.featureFlags.realtime &&
    Boolean(threadId);

  useSocket({
    url: threadId ? wsUrls.review(threadId) : null,
    enabled,
    handlers: {
      'question.suggested': (p) => {
        setState({
          threadId: p.threadId,
          chips: (p.chips ?? []).map((text, i) => ({
            id: `${p.threadId}-${i}-${text.slice(0, 12)}`,
            text,
          })),
        });
      },
    },
  });

  const clear = useCallback(() => setState({ threadId, chips: [] }), [threadId]);

  const choose = useCallback(
    (suggestion: Suggestion) => {
      populate(suggestion.text, null);
      /* A chosen chip is spent. Leaving the others up under a filled composer
         implies we are still waiting for one of them. */
      setState({ threadId, chips: [] });
      trackEvent('suggestion.selected', { length: suggestion.text.length });
    },
    [populate, threadId],
  );

  /* A new thread is a new conversation: nothing carries over. */
  const chips = state.threadId === threadId ? state.chips : [];

  return {
    chips,
    visible: Boolean(questionLoopOpen) && chips.length > 0,
    choose,
    clear,
  };
}
