'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import type { PortalSettings } from '@/types/portal.types';

/** Profile editor (§68). */
export function ProfileForm({
  profile,
  saving,
  onSave,
}: {
  profile: PortalSettings['profile'];
  saving: boolean;
  onSave: (p: Partial<PortalSettings['profile']>) => void;
}) {
  const [fullName, setFullName] = useState(profile.fullName ?? '');
  const [organization, setOrganization] = useState(profile.organization ?? '');
  const [role, setRole] = useState(profile.role ?? '');

  const f = PORTAL_COPY.settings.profileFields;
  return (
    <Card variant="default" className="flex flex-col gap-4">
      <SectionLabel>{PORTAL_COPY.settings.profileHeader}</SectionLabel>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="text-secondary font-medium text-ink-900">{f.fullName}</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-10 rounded-md border border-line bg-surface px-3 text-body text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-secondary font-medium text-ink-900">{f.email}</span>
          <input value={profile.email} disabled className="h-10 rounded-md border border-line bg-surface-sunken px-3 text-body text-ink-500" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-secondary font-medium text-ink-900">{f.organization}</span>
          <input value={organization} onChange={(e) => setOrganization(e.target.value)} className="h-10 rounded-md border border-line bg-surface px-3 text-body text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600" />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-secondary font-medium text-ink-900">{f.role}</span>
          <input value={role} onChange={(e) => setRole(e.target.value)} className="h-10 rounded-md border border-line bg-surface px-3 text-body text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-600" />
        </label>
      </div>
      <div>
        <Button variant="primary" size="md" disabled={saving} onClick={() => onSave({ fullName, organization, role })}>
          {saving ? 'Saving…' : PORTAL_COPY.settings.saveProfile}
        </Button>
      </div>
    </Card>
  );
}
