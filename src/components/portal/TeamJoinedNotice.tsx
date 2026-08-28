'use client';

import { usePortalCopy } from '@/lib/i18n/portalLocale';

/** Inline notice when a human team member joins the conversation (§63). */
export function TeamJoinedNotice({ name }: { name: string }) {
  const portalCopy = usePortalCopy();
  return (
    <div className="my-1 text-center">
      <span className="text-caption text-ink-secondary">{portalCopy.messages.states.teamJoined(name)}</span>
    </div>
  );
}
