'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { WelcomeCard } from '@/components/portal/WelcomeCard';
import { StatusLine } from '@/components/portal/StatusLine';
import { NextStepCard } from '@/components/portal/NextStepCard';
import { EmptyState } from '@/components/portal/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { usePortalOverview } from '@/hooks/usePortalOverview';
import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** Portal home (§62): welcome, one status line, and next-step cards. */
export default function OverviewPage() {
  const { data, loading } = usePortalOverview();
  const firstName = data?.client.fullName?.split(' ')[0] ?? 'there';

  return (
    <>
      <PortalTopbar title="Home" />
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-8">
        {loading ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : data ? (
          <>
            <WelcomeCard firstName={firstName} />
            <StatusLine stage={data.stage} />

            {data.nextSteps.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {data.nextSteps.map((key) => (
                  <NextStepCard key={key} stepKey={key} />
                ))}
              </div>
            ) : (
              <EmptyState>{PORTAL_COPY.home.empty}</EmptyState>
            )}
          </>
        ) : (
          <EmptyState>{PORTAL_COPY.home.empty}</EmptyState>
        )}
      </div>
    </>
  );
}
