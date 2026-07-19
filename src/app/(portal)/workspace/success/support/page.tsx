'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { Spinner } from '@/components/ui/Spinner';
import { SupportRequestList } from '@/components/success/SupportRequestList';
import { SupportComposer } from '@/components/success/SupportComposer';
import { useSupport } from '@/hooks/useSupport';
import { SUCCESS_COPY } from '@/lib/content/successCopy';

/**
 * Support.
 *
 * The composer sits ABOVE the list. A customer arriving here usually has a
 * problem to report, not a queue to browse — making them scroll past their own
 * history to ask for help gets that backwards.
 *
 * Nothing commercial appears on this page.
 */
export default function SupportPage() {
  const { requests, loading } = useSupport();
  return (
    <>
      <PortalTopbar title="Support" />
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-8">
        <header>
          <h1 className="font-display text-web-h2 text-ink-primary">{SUCCESS_COPY.support.title}</h1>
          <p className="mt-3 max-w-reading text-web-body text-ink-secondary">{SUCCESS_COPY.support.intro}</p>
        </header>

        <SupportComposer />

        <section aria-labelledby="open-requests" className="flex flex-col gap-3">
          <h2 id="open-requests" className="font-display text-web-h3 text-ink-primary">Your requests</h2>
          {loading ? (
            <div className="flex justify-center py-8"><Spinner size="lg" /></div>
          ) : (
            <SupportRequestList requests={requests} />
          )}
        </section>
      </div>
    </>
  );
}
