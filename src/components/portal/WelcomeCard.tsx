'use client';

import { usePortalCopy } from '@/lib/i18n/portalLocale';

/** Warm welcome at the top of the workspace home (§62). */
export function WelcomeCard({ firstName }: { firstName: string }) {
  const portalCopy = usePortalCopy();
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-web-h2 text-structure-900">{portalCopy.home.welcome(firstName)}</h2>
      <p className="reading text-ink-secondary">{portalCopy.home.welcomeBody}</p>
    </div>
  );
}
