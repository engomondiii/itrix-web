'use client';

import { useState } from 'react';
import { useLeadStore } from '@/store/leadStore';
import { useReviewStore } from '@/store/reviewStore';
import { leadApi } from '@/lib/api/leadApi';
import { validateEmailCapture } from '@/lib/validation/emailValidator';
import { trackEmailCapture } from '@/lib/analytics/trackEmailCapture';

export function useEmailCapture(location: string) {
  const leadId = useLeadStore((s) => s.leadId);
  const tier = useLeadStore((s) => s.tier);
  const sessionId = useReviewStore((s) => s.sessionId);
  const captured = useLeadStore((s) => s.emailCaptured);
  const setEmailCaptured = useLeadStore((s) => s.setEmailCaptured);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submit() {
    const result = validateEmailCapture({ email, name, company });
    if (!result.valid) {
      setErrors(result.errors);
      return false;
    }
    setErrors({});
    setSubmitting(true);
    try {
      // Fire-and-trust: the proxy persists to Django; we optimistically confirm.
      await leadApi.captureEmail({ leadId, sessionId, email, name, company, source: location });
      setEmailCaptured(true);
      setSubmitted(true);
      trackEmailCapture({ location, tier, leadId });
      return true;
    } finally {
      setSubmitting(false);
    }
  }

  return {
    email, setEmail,
    name, setName,
    company, setCompany,
    errors, submitting,
    submitted: submitted || captured,
    submit,
  };
}
