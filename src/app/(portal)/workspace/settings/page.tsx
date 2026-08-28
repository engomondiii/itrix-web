'use client';

import { PortalTopbar } from '@/components/portal/PortalTopbar';
import { ProfileForm } from '@/components/portal/ProfileForm';
import { TeamAccessForm } from '@/components/portal/TeamAccessForm';
import { NotificationPrefsForm } from '@/components/portal/NotificationPrefsForm';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { usePortalSettings } from '@/hooks/usePortalSettings';
import { usePortalAuth } from '@/hooks/usePortalAuth';
import { usePortalCopy } from '@/lib/i18n/portalLocale';

/** Settings (§68): profile · team access · notifications · sign out. */
export default function SettingsPage() {
  const portalCopy = usePortalCopy();
  const { data, loading, saving, saveProfile, saveNotifications, inviteTeammate } = usePortalSettings();
  const { signOut } = usePortalAuth();

  return (
    <>
      <PortalTopbar title="Settings" />
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
        {loading || !data ? (
          <div className="flex justify-center py-16"><Spinner size="lg" /></div>
        ) : (
          <>
            <ProfileForm profile={data.profile} saving={saving} onSave={(p) => void saveProfile(p)} />
            <TeamAccessForm team={data.team} saving={saving} onInvite={inviteTeammate} />
            <NotificationPrefsForm prefs={data.notifications} saving={saving} onSave={(p) => void saveNotifications(p)} />

            <div className="border-t border-border-soft pt-5">
              <Button variant="secondary" size="md" onClick={() => void signOut()}>
                {portalCopy.settings.signOut}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
