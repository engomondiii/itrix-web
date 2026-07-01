'use client';

import { useEffect, useState } from 'react';
import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { BriefingView } from '@/components/portal/BriefingView';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { portalApi } from '@/lib/api/portalApi';
import type { PortalBriefing } from '@/types/portal.types';

/** The living Problemology review inside the portal (§64). */
export default function BriefingPage() {
  const [briefing, setBriefing] = useState<PortalBriefing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void (async () => {
      const res = await portalApi.briefing();
      if (active) {
        if (res.data) setBriefing(res.data);
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <PortalTopbar title="Briefing" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : briefing ? (
          <BriefingView briefing={briefing} />
        ) : (
          <EmptyState>
            Your briefing is being prepared. When it’s ready, it will appear here and you’ll see a note in
            Messages.
          </EmptyState>
        )}
      </div>
    </>
  );
}
