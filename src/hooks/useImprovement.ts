'use client';

import { useCallback, useState } from 'react';
import { successApi } from '@/lib/api/successApi';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { ImprovementReceipt } from '@/types/success.types';

/**
 * The persistent improvement composer — "What can we improve for you?"
 *
 * The backend decides where a message goes: support, an outcome change, a
 * training request, or a human. The customer never picks a department, and the
 * receipt tells them plainly where it went and who has it.
 */
export function useImprovement() {
  const [receipt, setReceipt] = useState<ImprovementReceipt | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (message: string) => {
    setSubmitting(true);
    setError(null);
    const res = await successApi.submitImprovement({ message });
    setSubmitting(false);
    if (res.error) {
      setError(res.error);
      return null;
    }
    setReceipt(res.data);
    trackEvent('success.improvement_submitted', { route: res.data?.route ?? 'unknown' });
    return res.data;
  }, []);

  return { submit, submitting, error, receipt, reset: () => setReceipt(null) };
}
