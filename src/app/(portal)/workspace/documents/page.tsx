'use client';

import { useEffect } from 'react';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { DataRoom } from '@/components/portal/DataRoom';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useDataRoom } from '@/hooks/useDataRoom';
import { useJourneyContext } from '@/context/JourneyContext';
import { isCustomerSuccessState } from '@/lib/journey/journeyStates';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * Documents, the NDA-gated data room, and — once contracted — the customer's own
 * contract-tier material.
 *
 * PHASE 3: `customer_contract` is the sixth disclosure tier (Architecture v2.5
 * §13.2). It holds a customer's own deployment notes, release notes, runbooks,
 * training material and incident history, and it is scoped PER CUSTOMER — a
 * contract-tier document is never cross-served to another customer.
 *
 * Two things this page deliberately does not do:
 *
 *   · It does not decide the tier. The ceiling comes from the client-JWT and
 *     Django re-checks it on every fetch; the state below only decides whether to
 *     ANNOUNCE that the section exists, so a customer is not left wondering where
 *     their runbooks went.
 *   · It does not merge tiers into one list. Keeping contract-tier material in
 *     its own section is what makes the boundary legible to the person relying
 *     on it.
 */
export default function DocumentsPage() {
  const { data, loading } = useDataRoom();
  const { state, disclosureCeiling } = useJourneyContext();

  const contracted = disclosureCeiling === 'customer_contract' || isCustomerSuccessState(state);

  useEffect(() => {
    if (data && !data.ndaSigned) trackEvent('portal.data_room_locked_view', {});
  }, [data]);

  return (
    <>
      <PortalTopbar title="Documents" />
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data ? (
          <>
            <DataRoom data={data} />

            {contracted ? (
              <section aria-labelledby="contract-docs" className="flex flex-col gap-3">
                <h2 id="contract-docs" className="font-display text-web-h3 text-ink-primary">
                  Your deployment material
                </h2>
                <p className="max-w-reading text-web-body text-ink-secondary">
                  Runbooks, deployment notes, release notes, training material and incident history for your
                  environments. This is yours — it is never shared with another customer.
                </p>
                <p className="text-caption text-ink-secondary">
                  Find it under Learning, alongside your training and release notes.
                </p>
                <a
                  href="/workspace/success/knowledge"
                  className="self-start text-caption text-ink-primary underline underline-offset-2"
                >
                  Open Learning
                </a>
              </section>
            ) : null}
          </>
        ) : (
          <EmptyState>No documents have been shared yet. They’ll appear here as the team shares them.</EmptyState>
        )}
      </div>
    </>
  );
}
