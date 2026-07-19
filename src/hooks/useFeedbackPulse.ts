'use client';

import { useCallback, useState } from 'react';
import { successApi } from '@/lib/api/successApi';
import { useSuccessStore } from '@/store/successStore';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { FeedbackPulseSubmission, FeedbackReceipt } from '@/types/success.types';

/**
 * The private satisfaction pulse.
 *
 * PRIVATE means private: the score goes to the customer-success owner and
 * nowhere else. It is never rendered back to the customer as a judgement about
 * them, never shown outside the success team, and never used in copy addressed
 * to them (Playbook v1.5 §12I).
 *
 * The analytics event carries NO score — only that a pulse happened and whether
 * follow-up was asked for, which is what the success team needs to act.
 */
export function useFeedbackPulse() {
  const submitted = useSuccessStore((s) => s.pulseSubmitted);
  const markSubmitted = useSuccessStore((s) => s.markPulseSubmitted);
  const [receipt, setReceipt] = useState<FeedbackReceipt | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (submission: FeedbackPulseSubmission) => {
      setSubmitting(true);
      setError(null);
      const res = await successApi.submitPulse(submission);
      setSubmitting(false);
      if (res.error) {
        setError(res.error);
        return null;
      }
      markSubmitted();
      setReceipt(res.data);
      trackEvent('success.pulse_submitted', { followUpRequested: Boolean(submission.followUpRequested) });
      return res.data;
    },
    [markSubmitted],
  );

  return { submit, submitting, error, receipt, alreadySubmitted: submitted };
}
