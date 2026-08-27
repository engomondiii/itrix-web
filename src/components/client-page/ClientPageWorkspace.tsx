'use client';

import { useState } from 'react';
import { ClientPageLive } from './ClientPageLive';
import { ClientPageConversation } from './ClientPageConversation';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';
import type { ClientPage } from '@/types/client.types';

export function ClientPageWorkspace({ initialPage }: { initialPage: ClientPage }) {
  const [collapsed, setCollapsed] = useState(false);
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);
  return (
    <div className={`token-page${collapsed ? ' token-page--review-collapsed' : ''}`}>
      <section className="token-page__review" aria-label={copy.reviewTitle}>
        <div className="token-page__review-toolbar">
          <div><span className="token-page__review-kicker">{copy.reviewTitle}</span><span className="token-page__review-state">{collapsed ? copy.reviewMinimized : copy.reviewOpen}</span></div>
          <button type="button" className="token-page__review-toggle" aria-expanded={!collapsed} aria-controls="my-review" onClick={() => setCollapsed((v)=>!v)}>{collapsed ? copy.showReview : copy.minimizeReview}</button>
        </div>
        <div id="my-review" hidden={collapsed}><ClientPageLive initialPage={initialPage} /></div>
      </section>
      <ClientPageConversation />
    </div>
  );
}
