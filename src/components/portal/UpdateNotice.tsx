import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** Shown when the living briefing was updated after a conversation (§64). */
export function UpdateNotice() {
  return (
    <div className="rounded-md border-l-[3px] border-sapphire-600 bg-sapphire-50 px-4 py-3">
      <p className="text-secondary text-sapphire-700">{PORTAL_COPY.briefing.updateNotice}</p>
    </div>
  );
}
