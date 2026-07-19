import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** Shown when the living briefing was updated after a conversation (§64). */
export function UpdateNotice() {
  return (
    <div className="rounded-md border-l-[3px] border-ink-primary bg-soft px-4 py-3">
      <p className="text-secondary text-ink-primary">{PORTAL_COPY.briefing.updateNotice}</p>
    </div>
  );
}
