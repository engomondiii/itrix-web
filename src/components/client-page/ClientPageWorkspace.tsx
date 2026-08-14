'use client';

import { useState } from 'react';
import { ClientPageLive } from './ClientPageLive';
import { ClientPageConversation } from './ClientPageConversation';
import type { ClientPage } from '@/types/client.types';

/**
 * The personalised review and the ORIGINAL conversation share one route without
 * competing for screen height. Collapsing the review changes layout only: the
 * conversation component is never conditionally mounted, so its active thread,
 * transcript, pending state and socket subscription stay intact.
 */
export function ClientPageWorkspace({ token, initialPage }: { token: string; initialPage: ClientPage }) {
  const [reviewCollapsed, setReviewCollapsed] = useState(false);

  return (
    <div className={`token-page${reviewCollapsed ? ' token-page--review-collapsed' : ''}`}>
      <section className="token-page__review" aria-label="Your personalised review">
        <div className="token-page__review-toolbar">
          <div>
            <span className="token-page__review-kicker">Personalised review</span>
            <span className="token-page__review-state">
              {reviewCollapsed ? 'Review minimised — conversation stays active' : 'Review open'}
            </span>
          </div>
          <button
            type="button"
            className="token-page__review-toggle"
            aria-expanded={!reviewCollapsed}
            aria-controls="pitch-room"
            onClick={() => setReviewCollapsed((value) => !value)}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              {reviewCollapsed ? <path d="M5 12.5 10 7.5l5 5" /> : <path d="m5 7.5 5 5 5-5" />}
            </svg>
            {reviewCollapsed ? 'Show review' : 'Minimise review'}
          </button>
        </div>

        <div id="pitch-room" hidden={reviewCollapsed}>
          <ClientPageLive token={token} initialPage={initialPage} />
        </div>
      </section>

      {/* Always mounted. This is the same active review thread from the global
          ThreadProvider; minimising the review cannot create, rename or reset it. */}
      <ClientPageConversation />
    </div>
  );
}
