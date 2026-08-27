'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClientPageWorkspace } from './ClientPageWorkspace';
import { ClientPagePreparing } from './ClientPagePreparing';
import { Button } from '@/components/ui/Button';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';
import type { ClientPage } from '@/types/client.types';

export function ClientPageCurrentLoader() {
  const [page, setPage] = useState<ClientPage | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch('/api/client-page/current', { cache: 'no-store', headers: { Accept: 'application/json' } });
        if (!res.ok) { if (!cancelled) setUnavailable(true); return; }
        const data = (await res.json()) as ClientPage;
        if (!cancelled) setPage(data);
      } catch { if (!cancelled) setUnavailable(true); }
    })();
    return () => { cancelled = true; };
  }, []);

  if (page) return <ClientPageWorkspace initialPage={page} />;
  if (unavailable) return (
    <div className="container-page py-16"><div className="mx-auto max-w-lg text-center"><h1 className="text-web-h2 text-ink-primary">{copy.reviewTitle}</h1><p className="mt-3 reading text-ink-secondary">{copy.accessUnavailable}</p><Link className="mt-6 inline-block" href="/review"><Button>{copy.returnToReview}</Button></Link></div></div>
  );
  return <ClientPagePreparing />;
}
