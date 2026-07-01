import { PORTAL_COPY } from '@/lib/content/portalCopy';
import type { SenderKind } from '@/types/chat.types';

/** The message sender label inside the portal (§63). Never a named assistant. */
export function SenderKindBadge({ kind, teamName }: { kind: SenderKind; teamName?: string | null }) {
  const label =
    kind === 'client'
      ? PORTAL_COPY.messages.labels.client
      : kind === 'agent'
        ? PORTAL_COPY.messages.labels.agent
        : teamName || PORTAL_COPY.messages.labels.team;
  const tone = kind === 'client' ? 'text-ink-500' : kind === 'agent' ? 'text-sapphire-700' : 'text-gold-600';
  return <span className={`text-micro font-semibold uppercase tracking-[0.08em] ${tone}`}>{label}</span>;
}
