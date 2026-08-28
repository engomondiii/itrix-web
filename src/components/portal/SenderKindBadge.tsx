'use client';

import { usePortalCopy } from '@/lib/i18n/portalLocale';
import type { SenderKind } from '@/types/chat.types';

/** The message sender label inside the portal (§63). Never a named assistant. */
export function SenderKindBadge({ kind, teamName }: { kind: SenderKind; teamName?: string | null }) {
  const portalCopy = usePortalCopy();
  const label =
    kind === 'client'
      ? portalCopy.messages.labels.client
      : kind === 'agent'
        ? portalCopy.messages.labels.agent
        : teamName || portalCopy.messages.labels.team;
  const tone = kind === 'client' ? 'text-ink-secondary' : kind === 'agent' ? 'text-ink-primary' : 'text-structure-600';
  return <span className={`text-micro font-semibold uppercase tracking-[0.08em] ${tone}`}>{label}</span>;
}
