'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PromptComposer } from '@/components/center/PromptComposer';
import { ExamplePromptGrid } from '@/components/center/ExamplePromptGrid';
import { CENTER_COPY } from '@/lib/content/centerCopy';
import { EXAMPLE_PROMPTS } from '@/lib/content/examplePrompts';
import type { ExamplePrompt } from '@/lib/content/examplePrompts';
import { useReviewStore } from '@/store/reviewStore';
import { useImprovement } from '@/hooks/useImprovement';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { routes } from '@/constants/routes';

/**
 * Label by journey state (Surface 1 v4.0 §3.4). ONE composer at every state —
 * only the prompt above it changes. It is the same visual language throughout
 * and never becomes a chat bubble.
 *
 *    1      What would you like computation to do better?   → creates the review
 *    2–9    Ask itriX                                       → Concierge
 *    10     What can we improve for you?                    → improvement router
 */
export type ComposerMode = 'arrival' | 'ask' | 'improve';

const LABEL: Record<ComposerMode, string> = {
  arrival: CENTER_COPY.mainQuestion,
  ask: 'Ask itriX',
  improve: 'What can we improve for you?',
};

export interface PersistentItrixComposerProps {
  mode?: ComposerMode;
  /**
   * Override the submit behaviour.
   *
   *   arrival  seeds the review store and moves into /review   (Phase 1)
   *   ask      the Concierge, in the current conversation       (Phase 2)
   *   improve  the improvement router — support | outcome |
   *            training | human, decided by the backend         (Phase 3)
   */
  onSubmit?: (value: string) => void | Promise<void>;
  /** Show the five example chips (the arrival screen only). */
  showExamples?: boolean;
  labelledBy?: string;
}

/**
 * The persistent composer.
 *
 * On the approved center this IS the first review input — the sentence the
 * visitor types here is persisted as the first review turn, and the review
 * surface continues from it rather than asking again (Surface 1 v4.0 §2.3).
 * That is a hard contract, not a nicety: a second "describe your bottleneck"
 * input anywhere in the flow is a defect.
 */
export function PersistentItrixComposer({
  mode = 'arrival',
  onSubmit,
  showExamples = false,
  labelledBy,
}: PersistentItrixComposerProps) {
  const router = useRouter();
  const storedPrompt = useReviewStore((s) => s.prompt);
  const setPrompt = useReviewStore((s) => s.setPrompt);

  const improvement = useImprovement();

  const [value, setValue] = useState<string>(mode === 'arrival' ? storedPrompt : '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function selectExample(example: ExamplePrompt) {
    // Populate, never submit. The visitor keeps control of when it begins.
    setValue(example.prompt);
    setError(null);
    trackEvent('center.example_selected', { family: example.family, index: example.index });
  }

  async function handleSubmit() {
    const text = value.trim();
    if (text.length < 8) {
      setError(CENTER_COPY.tooShort);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(text);
        return;
      }
      // ── State 10: route the improvement, never make them find a department ──
      if (mode === 'improve') {
        await improvement.submit(text);
        setValue('');
        return;
      }
      // ── Arrival: the sentence becomes the first review turn ────────────────
      setPrompt(text);
      trackEvent('review.prompt_started', {
        fromCenter: true,
        length: text.length,
        usedExample: EXAMPLE_PROMPTS.some((e) => e.prompt.toLowerCase() === text.toLowerCase()),
      });
      router.push(routes.review);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {mode !== 'arrival' ? (
        <p className="font-display text-web-question text-ink-primary">{LABEL[mode]}</p>
      ) : null}

      {/* The receipt tells the customer where it went and who has it. */}
      {mode === 'improve' && improvement.receipt ? (
        <p role="status" className="mt-2 text-caption text-ink-primary">
          {improvement.receipt.acknowledgement}
          {improvement.receipt.owner ? ` ${improvement.receipt.owner} has it.` : ''}
        </p>
      ) : null}

      <PromptComposer
        value={value}
        onChange={(v) => {
          setValue(v);
          if (error) setError(null);
        }}
        onSubmit={() => void handleSubmit()}
        labelledBy={labelledBy}
        submitting={submitting || improvement.submitting}
        error={error ?? improvement.error}
      />

      {showExamples ? <ExamplePromptGrid value={value} onSelect={selectExample} /> : null}
    </>
  );
}
