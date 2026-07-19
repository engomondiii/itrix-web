'use client';

import { workspaceApi } from '@/lib/api/workspaceApi';
import { usePortalResource } from './usePortalResource';
import type { IntegrationPayload } from '@/types/workspace.types';

/** State 9 — integration readiness, commercial documents and the decision log. */
export function useIntegration() {
  return usePortalResource<IntegrationPayload>(() => workspaceApi.integration());
}
