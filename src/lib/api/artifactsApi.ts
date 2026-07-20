/**
 * Typed client for artifacts (/api/artifacts/[id]).
 *
 * EVERY FETCH IS RE-AUTHORIZED SERVER-SIDE. Django re-checks token, journey
 * state and disclosure ceiling on every artifact read; URL obscurity is never
 * authorization (Architecture v2.6 §11.9). Nothing here can widen what comes
 * back.
 *
 * Artifacts normally arrive through the thread payload — this client exists for
 * the deep-link view at /a/[artifactId], which is an ALTERNATIVE way to see an
 * artifact, never the only one.
 */

import type { Artifact } from '@/types/artifact.types';
import type { ApiResult } from '@/lib/api/threadsApi';

export const artifactsApi = {
  async get(artifactId: string): Promise<ApiResult<Artifact>> {
    try {
      const res = await fetch(`/api/artifacts/${encodeURIComponent(artifactId)}`, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return { data: null, error: `artifact ${res.status}` };
      return { data: (await res.json()) as Artifact, error: null };
    } catch (e) {
      return { data: null, error: e instanceof Error ? e.message : 'artifact unreachable' };
    }
  },
};
