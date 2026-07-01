'use client';

import { useEffect } from 'react';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { DataRoom } from '@/components/portal/DataRoom';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { useDataRoom } from '@/hooks/useDataRoom';
import { trackEvent } from '@/lib/analytics/trackEvent';

/** Documents + the NDA-gated data room (§65). */
export default function DocumentsPage() {
  const { data, loading } = useDataRoom();

  useEffect(() => {
    if (data && !data.ndaSigned) trackEvent('portal.data_room_locked_view', {});
  }, [data]);

  return (
    <>
      <PortalTopbar title="Documents" />
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data ? (
          <DataRoom data={data} />
        ) : (
          <EmptyState>No documents have been shared yet. They’ll appear here as the team shares them.</EmptyState>
        )}
      </div>
    </>
  );
}
