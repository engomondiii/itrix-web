'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useReviewStore } from '@/store/reviewStore';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';

const POLL_MS = 2000;
const SLOW_MS = 25000;

type StatusBody = { generationStatus?: 'pending' | 'ready' | 'failed'; ready?: boolean; accessCode?: string | null; retryable?: boolean };

export function ReviewPreparationStatus() {
  const router = useRouter();
  const sessionId = useReviewStore((s) => s.sessionId);
  const setStep = useReviewStore((s) => s.setStep);
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);
  const [status, setStatus] = useState<'pending'|'ready'|'failed'>('pending');
  const [slow, setSlow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());

  const poll = useCallback(async () => {
    if (!sessionId) { setStatus('failed'); return; }
    try {
      const res = await fetch(`/api/review/${encodeURIComponent(sessionId)}/result-status`, { cache: 'no-store' });
      if (!res.ok) return;
      const body = (await res.json()) as StatusBody;
      if (body.generationStatus === 'failed') { setStatus('failed'); return; }
      if (body.ready || body.generationStatus === 'ready') { setStatus('ready'); setStep('diagnosed'); return; }
      setStatus('pending');
    } catch { /* transient; keep polling */ }
    if (Date.now() - mountedAt.current >= SLOW_MS) setSlow(true);
  }, [sessionId, setStep]);

  useEffect(() => {
    if (status !== 'pending') return;
    void poll();
    const timer = setInterval(() => void poll(), POLL_MS);
    return () => clearInterval(timer);
  }, [poll, status]);

  async function retry() {
    if (!sessionId || busy) return;
    setBusy(true); setSlow(false); setAccessError(null);
    try {
      const res = await fetch(`/api/review/${encodeURIComponent(sessionId)}/result-status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'retry' }) });
      if (res.ok) { setStatus('pending'); mountedAt.current = Date.now(); await poll(); }
    } finally { setBusy(false); }
  }

  async function view() {
    if (!sessionId || busy || status !== 'ready') return;
    setBusy(true);
    setAccessError(null);
    try {
      // Mint the one-time exchange code only on the explicit click. Readiness polling
      // never rotates credentials in the background.
      const grant = await fetch(`/api/review/${encodeURIComponent(sessionId)}/result-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ action: 'open' }),
      });
      const body = (await grant.json().catch(() => ({}))) as StatusBody;
      if (!grant.ok || !body.accessCode) {
        setStatus(body.generationStatus === 'failed' ? 'failed' : 'ready');
        setAccessError(copy.accessExpired);
        return;
      }
      const exchanged = await fetch('/api/client-page/access/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ code: body.accessCode }),
      });
      if (!exchanged.ok) { setAccessError(copy.accessExpired); return; }
      router.push('/c');
    } catch {
      setAccessError(copy.accessOpenError);
    } finally { setBusy(false); }
  }

  return (
    <section className="review-preparation" aria-live="polite" aria-busy={status === 'pending'}>
      <SectionLabel>{copy.preparingTitle}</SectionLabel>
      {status === 'pending' ? <Spinner size="lg" /> : null}
      <p className="reading text-ink-primary">{status === 'failed' ? copy.failed : status === 'ready' ? copy.ready : slow ? copy.slow : copy.preparing}</p>
      {accessError ? <p role="alert" className="text-secondary text-danger">{accessError}</p> : null}
      {status === 'ready' ? <Button variant="primary" onClick={view} disabled={busy}>{copy.viewReview}</Button> : null}
      {status === 'failed' ? <Button variant="primary" onClick={retry} disabled={busy}>{busy ? copy.retrying : copy.retry}</Button> : null}
    </section>
  );
}
