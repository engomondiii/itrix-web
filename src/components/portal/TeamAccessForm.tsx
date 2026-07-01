'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import type { PortalSettings } from '@/types/portal.types';

/** Team access — invite colleagues into the shared workspace (§68). */
export function TeamAccessForm({
  team,
  saving,
  onInvite,
}: {
  team: PortalSettings['team'];
  saving: boolean;
  onInvite: (email: string) => void;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit() {
    if (!/.+@.+\..+/.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError(null);
    onInvite(email.trim());
    setEmail('');
  }

  return (
    <Card variant="default" className="flex flex-col gap-4">
      <div>
        <SectionLabel>{PORTAL_COPY.settings.teamHeader}</SectionLabel>
        <p className="reading mt-2 text-ink-700">{PORTAL_COPY.settings.teamIntro}</p>
      </div>

      {team.length > 0 ? (
        <ul className="flex flex-col divide-y divide-line-subtle">
          {team.map((member) => (
            <li key={member.email} className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-body text-ink-900">{member.email}</span>
              <span className="rounded-pill bg-surface-warm px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.08em] text-ink-500">
                {member.status}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-end gap-2">
        <label className="flex flex-1 flex-col gap-1.5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={PORTAL_COPY.settings.invitePlaceholder}
            className="h-10 rounded-md border border-line bg-surface px-3 text-body text-ink-900 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600"
          />
        </label>
        <Button variant="secondary" size="md" disabled={saving} onClick={submit}>
          {PORTAL_COPY.settings.sendInvite}
        </Button>
      </div>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </Card>
  );
}
