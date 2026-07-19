'use client';

import { useId, useState } from 'react';
import { SUCCESS_COPY } from '@/lib/content/successCopy';
import { useFeedbackPulse } from '@/hooks/useFeedbackPulse';
import type { FeedbackPulseSubmission } from '@/types/success.types';

/**
 * The private satisfaction pulse.
 *
 * Three rules this component exists to keep:
 *
 *   1. PRIVATE. The prompt says so, and it is true: the pulse goes to the
 *      customer-success owner and nowhere else.
 *   2. It rates US, not them. The scale asks "how is this going for you", and
 *      the result is never rendered back to the customer as a score about them
 *      (Playbook v1.5 §12I).
 *   3. Asked once. After submission the form is replaced by a thank-you, not
 *      reset — re-prompting a customer who has already told us is how a feedback
 *      channel becomes noise they learn to dismiss.
 */
const SCORES = [1, 2, 3, 4, 5] as const;

export function SatisfactionPulse() {
  const uid = useId();
  const { submit, submitting, error, receipt, alreadySubmitted } = useFeedbackPulse();
  const [score, setScore] = useState<FeedbackPulseSubmission['score'] | null>(null);
  const [freeText, setFreeText] = useState('');
  const [followUp, setFollowUp] = useState(false);

  if (receipt || alreadySubmitted) {
    return (
      <p role="status" className="text-web-body text-ink-primary">
        {receipt?.followUpRequested ? SUCCESS_COPY.feedback.thanksWithFollowUp : SUCCESS_COPY.feedback.thanks}
      </p>
    );
  }

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (score) void submit({ score, freeText: freeText.trim() || undefined, followUpRequested: followUp });
      }}
    >
      <p className="text-caption text-ink-secondary">{SUCCESS_COPY.feedback.prompt}</p>

      <fieldset>
        <legend className="mb-2 text-caption font-semibold text-ink-primary">
          {SUCCESS_COPY.feedback.scaleLabel}
        </legend>
        <div className="flex flex-wrap gap-2">
          {SCORES.map((s) => (
            <label
              key={s}
              className={`flex min-h-[48px] cursor-pointer items-center rounded-md border px-3 text-caption ${
                score === s ? 'border-border-strong bg-soft text-ink-primary' : 'border-border-soft text-ink-secondary'
              }`}
            >
              <input
                type="radio"
                name={`${uid}-score`}
                value={s}
                checked={score === s}
                onChange={() => setScore(s)}
                className="sr-only"
              />
              {SUCCESS_COPY.feedback.scale[s - 1]}
            </label>
          ))}
        </div>
      </fieldset>

      <label htmlFor={`${uid}-text`} className="sr-only">Anything you would want us to change</label>
      <textarea
        id={`${uid}-text`}
        rows={3}
        value={freeText}
        placeholder={SUCCESS_COPY.feedback.freeTextPlaceholder}
        onChange={(e) => setFreeText(e.target.value)}
        className="rounded-md border border-border-soft bg-soft px-3 py-2 text-web-body text-ink-primary"
      />

      <label className="flex items-center gap-2 text-caption text-ink-secondary">
        <input type="checkbox" checked={followUp} onChange={(e) => setFollowUp(e.target.checked)} />
        {SUCCESS_COPY.feedback.followUp}
      </label>

      <button type="submit" className="button-primary self-start" disabled={!score || submitting}>
        {submitting ? 'Sending…' : SUCCESS_COPY.feedback.submit}
      </button>
      {error ? <p className="text-caption text-error">{error}</p> : null}
    </form>
  );
}
