'use client';

import { usePortalCopy } from '@/lib/i18n/portalLocale';

/** Shown when the living briefing was updated after a conversation (§64). */
export function UpdateNotice() {
  const portalCopy = usePortalCopy();
  return (
    <div className="rounded-md border-l-[3px] border-ink-primary bg-soft px-4 py-3">
      <p className="text-secondary text-ink-primary">{portalCopy.briefing.updateNotice}</p>
    </div>
  );
}
