'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useShellContext } from '@/context/ShellContext';
import { useKeepWorkStore } from '@/store/keepWorkStore';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';

/** Compact, optional persistence control. It never becomes a commercial CTA. */
export function KeepThisWorkCard({ threadId, hasSettledAnswer }: { threadId: string | null; hasSettledAnswer: boolean; }) {
  const identityState = useShellContext().identityState;
  const dismissed = useKeepWorkStore((s) => (threadId ? Boolean(s.dismissed[threadId]) : false));
  const dismiss = useKeepWorkStore((s) => s.dismiss);
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);
  const [expanded, setExpanded] = useState(false);
  if (!threadId || !hasSettledAnswer || identityState !== 'anonymous' || dismissed) return null;

  return (
    <aside className="keep-work keep-work--compact" aria-labelledby={`keep-work-${threadId}`}>
      <div className="keep-work__compact-row">
        <button type="button" className="keep-work__summary" aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
          <span id={`keep-work-${threadId}`} className="keep-work__title">{copy.keepTitle}</span>
          <span aria-hidden="true">{expanded ? '−' : '+'}</span>
        </button>
        {!expanded ? <button type="button" className="keep-work__dismiss" onClick={() => dismiss(threadId)}>{copy.notNow}</button> : null}
      </div>
      {expanded ? <div className="keep-work__details">
        <p className="keep-work__body">{copy.keepBody}</p>
        <div className="keep-work__actions">
          <Link href={routes.portalSignUp} className="keep-work__action" onClick={() => trackEvent('auth.signup_door_chosen', { door: 'keep_work' })}>{copy.keepAction}</Link>
          <button type="button" className="keep-work__dismiss" onClick={() => dismiss(threadId)}>{copy.notNow}</button>
        </div>
      </div> : null}
    </aside>
  );
}
