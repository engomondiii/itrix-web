'use client';

import { workspaceApi } from '@/lib/api/workspaceApi';
import { usePortalResource } from './usePortalResource';
import type { PoCEvidencePayload } from '@/types/workspace.types';

/**
 * State 8 — PoC evidence.
 *
 * The payload is rendered as produced. Nothing in this hook, or anything reading
 * it, may reclassify an outcome: a negative result stays negative.
 */
export function usePoCEvidence() {
  return usePortalResource<PoCEvidencePayload>(() => workspaceApi.pocEvidence());
}
