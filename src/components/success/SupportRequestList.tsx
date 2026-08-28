'use client';

import { SlaBadge } from './SlaBadge';
import { useSuccessCopy } from '@/lib/i18n/successLocale';
import type { SupportRequest } from '@/types/success.types';
import { useLocaleStore } from '@/store/localeStore';

/**
 * Open support requests: what they are, who owns each one, when a response is due.
 *
 * Nothing commercial appears in or beside this list. A customer reading their
 * open issues is the single worst moment to mention another agreement, and the
 * absence here is deliberate rather than incidental.
 */
export function SupportRequestList({ requests }: { requests: readonly SupportRequest[] }) {
  const ko = useLocaleStore((state) => state.locale) === 'ko';
  const successCopy = useSuccessCopy();
  if (requests.length === 0) {
    return <p className="text-web-body text-ink-secondary">{successCopy.support.empty}</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {requests.map((r) => (
        <li key={r.id} className="rounded-lg border border-border-soft bg-surface p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-card-title text-ink-primary">{r.subject}</h3>
            <SlaBadge status={r.status} slaDueAt={r.slaDueAt} />
          </div>

          {r.body ? <p className="mt-1.5 max-w-reading text-caption text-ink-secondary">{r.body}</p> : null}

          <p className="mt-2 text-caption text-ink-secondary">
            {r.owner ? (ko ? `${r.owner} 담당` : `${r.owner} owns it`) : (ko ? '담당자 지정 중' : 'Being assigned')}
            {ko ? ' · 접수 ' : ' · opened '}
            {new Date(r.openedAt).toLocaleDateString(ko ? 'ko-KR' : undefined)}
            {' · '}
            {successCopy.support.urgency[r.urgency]}
          </p>

          {r.status === 'resolved' && !r.resolutionFeedback ? (
            <p className="mt-2 text-caption text-ink-primary">{successCopy.support.resolutionPrompt}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
