'use client';

import { workspaceApi } from '@/lib/api/workspaceApi';
import { usePortalResource } from './usePortalResource';
import type { AssessmentPayload } from '@/types/workspace.types';

/** State 7 — the Alpha Compute Assessment workspace payload. */
export function useAssessment() {
  return usePortalResource<AssessmentPayload>(() => workspaceApi.assessment());
}
