'use client';

import { useCallback, useEffect, useState } from 'react';
import { portalApi } from '@/lib/api/portalApi';
import type { PortalSettings, PortalNotificationPrefs } from '@/types/portal.types';

/** Loads + mutates profile, team access, and notification preferences. */
export function usePortalSettings() {
  const [data, setData] = useState<PortalSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await portalApi.settings();
    if (res.data) setData(res.data);
    else if (res.error) setError(res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const saveProfile = useCallback(async (profile: Partial<PortalSettings['profile']>) => {
    setSaving(true);
    const res = await portalApi.saveProfile(profile);
    if (res.data) setData(res.data);
    else setError(res.error ?? 'Could not save your profile.');
    setSaving(false);
    return Boolean(res.data);
  }, []);

  const saveNotifications = useCallback(async (notifications: PortalNotificationPrefs) => {
    setSaving(true);
    const res = await portalApi.saveNotifications(notifications);
    if (res.data) setData(res.data);
    else setError(res.error ?? 'Could not save your preferences.');
    setSaving(false);
    return Boolean(res.data);
  }, []);

  const inviteTeammate = useCallback(async (email: string) => {
    setSaving(true);
    const res = await portalApi.inviteTeammate(email);
    if (res.data) setData(res.data);
    else setError(res.error ?? 'Could not send the invite.');
    setSaving(false);
    return Boolean(res.data);
  }, []);

  return { data, loading, saving, error, refresh: load, saveProfile, saveNotifications, inviteTeammate };
}
