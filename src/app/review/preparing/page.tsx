'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Spinner } from '@/components/ui/Spinner';
import { useLeadStore } from '@/store/leadStore';
import { useReviewStore } from '@/store/reviewStore';
import { journeyApi } from '@/lib/api/journeyApi';
import { canViewClientPage } from '@/lib/journey/journeyStates';
import { CONVERSATION_LINES } from '@/lib/content/immediateResponses';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';

const POLL_MS = 2500;
const MAX_WAIT_MS = 45000;

/**
 * "Preparing your review" hand-off. After qualification, the backend advances the
 * journey to DIAGNOSED and mints a client-page capability token. This page shows the
 * calm preparing line (§24) and polls journey state until the customized page is
 * ready, then routes to /c/[token]. If the token is already present (fast backend),
 * it forwards immediately. Degrades to a manual link if preparation takes too long.
 */
export default function PreparingPage() {
  const router = useRouter();
  const capabilityToken = useLeadStore((s) => s.capabilityToken);
  const setJourneyState = useLeadStore((s) => s.setJourneyState);
  const setStep = useReviewStore((s) => s.setStep);
  const [ready, setReady] = useState(false);
  const [slow, setSlow] = useState(false);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    setStep('preparing');
  }, [setStep]);

  useEffect(() => {
    if (!capabilityToken) {
      // No token yet (e.g. backend unreachable at qualify). Show the slow state so
      // the visitor can retry the review rather than spin forever.
      const t = setTimeout(() => setSlow(true), 6000);
      return () => clearTimeout(t);
    }

    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function poll() {
      const { data } = await journeyApi.getState(capabilityToken as string);
      if (cancelled) return;
      if (data) {
        setJourneyState(data.state);
        if (data.authorizedSurface === 'client_page' || canViewClientPage(data.state)) {
          setReady(true);
          trackEvent('review.diagnosed', { state: data.state });
          router.replace(routes.clientPage(capabilityToken as string));
        }
      }
      if (Date.now() - startedAt.current > MAX_WAIT_MS) {
        setSlow(true);
        if (timer) clearInterval(timer);
      }
    }

    void poll();
    timer = setInterval(() => void poll(), POLL_MS);
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [capabilityToken, router, setJourneyState]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Card variant="default" className="flex max-w-md flex-col items-center gap-4 text-center">
        <SectionLabel>Preparing your review</SectionLabel>
        {!slow ? <Spinner size="lg" /> : null}
        <p className="reading text-ink-secondary">
          {ready ? CONVERSATION_LINES.ready : CONVERSATION_LINES.preparing}
        </p>

        {capabilityToken && !slow ? (
          <Link href={routes.clientPage(capabilityToken)}>
            <Button variant="secondary" size="sm">
              Open my review
            </Button>
          </Link>
        ) : null}

        {slow ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-secondary text-ink-secondary">
              This is taking longer than usual. You can return to your review and try again.
            </p>
            <Link href={routes.review}>
              <Button variant="primary" size="sm">
                Back to the review
              </Button>
            </Link>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
