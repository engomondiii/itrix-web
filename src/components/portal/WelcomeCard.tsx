import { PORTAL_COPY } from '@/lib/content/portalCopy';

/** Warm welcome at the top of the workspace home (§62). */
export function WelcomeCard({ firstName }: { firstName: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-web-h2 text-structure-900">{PORTAL_COPY.home.welcome(firstName)}</h2>
      <p className="reading text-ink-secondary">{PORTAL_COPY.home.welcomeBody}</p>
    </div>
  );
}
