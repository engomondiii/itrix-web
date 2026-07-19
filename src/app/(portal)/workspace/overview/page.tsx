'use client';

import Link from 'next/link';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { WelcomeCard } from '@/components/portal/WelcomeCard';
import { StatusLine } from '@/components/portal/StatusLine';
import { NextStepCard } from '@/components/portal/NextStepCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { StageAwareHeading } from '@/components/shell/StageAwareHeading';
import { StateMorph } from '@/components/shell/StateMorph';
import { usePortalOverview } from '@/hooks/usePortalOverview';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import { useJourneyContext } from '@/context/JourneyContext';
import { isWorkspaceState, isSuccessOverlayActive } from '@/lib/journey/journeyStates';

/**
 * Portal home — state-aware (Surface 1 v4.0 §5 Phase 2).
 *
 * The same route means different things at different states:
 *
 *   State 6  NDA & confidential review — what is available now, what an NDA
 *            unlocks, document status, the briefing agenda.
 *   State 7+ the assessment summary, and — because the customer-success overlay
 *            activates at the FIRST PAYMENT, not at license-out — the standing
 *            promise that they always know what is happening and who owns the
 *            next action (Architecture v2.5 §7.1).
 *
 * The heading morphs rather than the route changing, so a customer whose state
 * advances while they are reading does not get thrown to a new page.
 */
export default function OverviewPage() {
  const { data, loading } = usePortalOverview();
  const { state, stateKey } = useJourneyContext();
  const firstName = data?.client.fullName?.split(' ')[0] ?? 'there';

  const workspace = isWorkspaceState(state);
  const successActive = isSuccessOverlayActive(state);

  return (
    <>
      <PortalTopbar title="Home" />
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data ? (
          <StateMorph stateKey={stateKey}>
            <div className="flex flex-col gap-8">
              <WelcomeCard firstName={firstName} />

              {workspace ? (
                <StageAwareHeading
                  as="h2"
                  eyebrow="Your assessment"
                  support="What we took in, the baseline we agreed, and what we would recommend proving next."
                >
                  Where your work stands
                </StageAwareHeading>
              ) : (
                <StageAwareHeading
                  as="h2"
                  eyebrow="Confidential review"
                  support="We can go a long way on non-confidential descriptions. An NDA lets us look at your actual workload structure, share validation boundaries, and prepare a scoped assessment."
                >
                  What we can discuss now, and what an NDA unlocks
                </StageAwareHeading>
              )}

              <StatusLine stage={data.stage} />

              {/*
                PHASE 3: the interim promise card is gone. From the first payment
                a customer now has the real customer-success zone — named owners,
                support, outcomes, learning and a private feedback channel — so a
                paragraph restating the promise here would be a placeholder
                sitting in front of the thing it was standing in for.
              */}
              {successActive ? (
                <section
                  aria-labelledby="success-entry"
                  className="rounded-lg border border-border-medium bg-soft p-4"
                >
                  <h2 id="success-entry" className="text-card-title text-ink-primary">
                    Your workspace
                  </h2>
                  <p className="mt-1.5 max-w-reading text-caption text-ink-secondary">
                    Outcomes, deployment health, support, learning, and the people who own your relationship.
                  </p>
                  <Link
                    href="/workspace/success"
                    className="mt-2 inline-block text-caption text-ink-primary underline underline-offset-2"
                  >
                    Open your workspace
                  </Link>
                </section>
              ) : null}

              {data.nextSteps.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.nextSteps.map((key) => (
                    <NextStepCard key={key} stepKey={key} />
                  ))}
                </div>
              ) : (
                <EmptyState>{PORTAL_COPY.home.empty}</EmptyState>
              )}
            </div>
          </StateMorph>
        ) : (
          <EmptyState>{PORTAL_COPY.home.empty}</EmptyState>
        )}
      </div>
    </>
  );
}
