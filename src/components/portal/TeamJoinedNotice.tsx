import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** Inline notice when a human team member joins the conversation (§63). */
export function TeamJoinedNotice({ name }: { name: string }) {
  return (
    <div className="my-1 text-center">
      <span className="text-caption text-ink-secondary">{PORTAL_COPY.messages.states.teamJoined(name)}</span>
    </div>
  );
}
