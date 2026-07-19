'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { PORTAL_COPY } from '@/lib/content/portalCopy';
import type { PortalNotificationPrefs } from '@/types/portal.types';

/** Notification preferences (§68). */
export function NotificationPrefsForm({
  prefs,
  saving,
  onSave,
}: {
  prefs: PortalNotificationPrefs;
  saving: boolean;
  onSave: (p: PortalNotificationPrefs) => void;
}) {
  const [state, setState] = useState<PortalNotificationPrefs>(prefs);
  const labels = PORTAL_COPY.settings.notificationLabels;
  const keys = Object.keys(labels) as (keyof PortalNotificationPrefs)[];

  return (
    <Card variant="default" className="flex flex-col gap-4">
      <div>
        <SectionLabel>{PORTAL_COPY.settings.notificationsHeader}</SectionLabel>
        <p className="reading mt-2 text-ink-secondary">{PORTAL_COPY.settings.notificationsIntro}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {keys.map((key) => (
          <li key={key}>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={state[key]}
                onChange={(e) => setState((s) => ({ ...s, [key]: e.target.checked }))}
                className="h-4 w-4 rounded-sm border-border-strong text-ink-primary focus-visible:ring-2 focus-visible:ring-ink-primary"
              />
              <span className="text-body text-ink-primary">{labels[key]}</span>
            </label>
          </li>
        ))}
      </ul>
      <div>
        <Button variant="primary" size="md" disabled={saving} onClick={() => onSave(state)}>
          {saving ? 'Saving…' : PORTAL_COPY.settings.savePreferences}
        </Button>
      </div>
    </Card>
  );
}
