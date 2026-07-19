'use client';

import { successApi } from '@/lib/api/successApi';
import { siteConfig } from '@/config/site.config';
import { useSuccessStore } from '@/store/successStore';
import { usePortalResource } from './usePortalResource';
import type { ChangeEntry } from '@/types/success.types';

/**
 * "What changed since you were last here."
 *
 * The `since` marker is a local session record, not a server-side read receipt.
 * A customer who dismisses the digest on one device has not told us they read it
 * on another, and treating that as read would quietly hide work from them.
 */
export function useChangesSince() {
  const since = useSuccessStore((s) => s.changesSeenAt);
  const markSeen = useSuccessStore((s) => s.markChangesSeen);

  const r = usePortalResource<{ changes: ChangeEntry[] }>(
    () => successApi.changes(since ?? undefined),
    { enabled: siteConfig.featureFlags.customerSuccess, key: since ?? '' },
  );

  return {
    ...r,
    changes: r.data?.changes ?? [],
    acknowledge: () => markSeen(new Date().toISOString()),
  };
}
