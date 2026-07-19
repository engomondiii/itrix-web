import { AGENT_DISPLAY_LABEL } from '@/constants/agents';
import type { SenderKind } from '@/types/chat.types';

/** Renders the small sender label on a message. The assessment intelligence is
 *  labelled "itriX assessment" — never a named person or avatar (Playbook §63). */
export function SenderLabel({ kind, teamName }: { kind: SenderKind; teamName?: string | null }) {
  const label = kind === 'client' ? 'You' : kind === 'agent' ? AGENT_DISPLAY_LABEL : teamName || 'itriX team';
  const tone =
    kind === 'client' ? 'text-ink-secondary' : kind === 'agent' ? 'text-ink-primary' : 'text-structure-600';
  return (
    <span className={`text-micro font-semibold uppercase tracking-[0.08em] ${tone}`}>{label}</span>
  );
}
