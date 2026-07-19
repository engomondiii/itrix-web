'use client';

import { useCallback, useState } from 'react';
import { successApi } from '@/lib/api/successApi';
import { siteConfig } from '@/config/site.config';
import { usePortalResource } from './usePortalResource';
import { trackEvent } from '@/lib/analytics/trackEvent';
import type { SupportRequest, SupportUrgency } from '@/types/success.types';

/**
 * Support requests: read the queue, open a new one.
 *
 * A support request is never answered with a commercial reply — that rule lives
 * in the backend claim checker, but it matters here too: nothing in this hook
 * surfaces an offer, a next agreement, or an expansion prompt alongside a
 * request. Help is the whole response.
 */
export function useSupport() {
  const enabled = siteConfig.featureFlags.customerSuccess;
  const r = usePortalResource<{ requests: SupportRequest[]; slaHours: number | null }>(
    () => successApi.support(),
    { enabled },
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const open = useCallback(
    async (subject: string, body: string, urgency: SupportUrgency) => {
      setSubmitting(true);
      setSubmitError(null);
      const res = await successApi.openSupportRequest(subject, body, urgency);
      setSubmitting(false);
      if (res.error) {
        setSubmitError(res.error);
        return null;
      }
      trackEvent('success.support_opened', { urgency });
      r.refresh();
      return res.data;
    },
    [r],
  );

  return {
    ...r,
    requests: r.data?.requests ?? [],
    slaHours: r.data?.slaHours ?? null,
    open,
    submitting,
    submitError,
  };
}
