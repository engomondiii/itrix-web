'use client';

import { usePortalAuthContext } from '@/context/PortalAuthContext';

/** Thin hook over the portal auth context (client identity + sign in/out). */
export function usePortalAuth() {
  return usePortalAuthContext();
}
