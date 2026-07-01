'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { PoCTracker } from '@/components/portal/PoCTracker';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { usePoCTracking } from '@/hooks/usePoCTracking';
import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** PoC milestone tracking (§67). */
export default function PoCPage() {
  const { data, loading } = usePoCTracking();

  return (
    <>
      <PortalTopbar title="Proof of concept" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data && data.exists ? (
          <PoCTracker poc={data} />
        ) : (
          <EmptyState>{PORTAL_COPY.poc.emptyState}</EmptyState>
        )}
      </div>
    </>
  );
}
