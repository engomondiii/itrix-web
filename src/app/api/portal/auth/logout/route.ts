import { NextResponse } from 'next/server';
import { clearClientSession } from '@/lib/server/session';
import { djangoFetch } from '@/lib/server/proxy';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type LogoutPayload = {
  detail?: string;
  revoked?: boolean;
  requestId?: string;
};

/**
 * POST /api/portal/auth/logout — revoke server credentials, then clear local cookies.
 *
 * Cookie clearing is unconditional so a backend outage never traps somebody in an
 * authenticated-looking UI. The response still distinguishes durable revocation from
 * local-only cleanup; an operational failure is never reported as "session revoked".
 */
export async function POST() {
  const result = await djangoFetch<LogoutPayload>('/client/auth/logout/', { method: 'POST' });
  await clearClientSession();

  if (result.ok) {
    return NextResponse.json({
      ok: true,
      localSessionCleared: true,
      revoked: true,
      requestId: result.requestId,
    });
  }

  if (result.status === 401) {
    // The supplied browser credential is already unusable. This is an idempotent logged-
    // out state, but do not pretend a new revocation write was confirmed by this call.
    return NextResponse.json({
      ok: true,
      localSessionCleared: true,
      revoked: false,
      alreadyInvalid: true,
      requestId: result.requestId,
    });
  }

  return NextResponse.json(
    {
      ok: true,
      localSessionCleared: true,
      revoked: false,
      code: 'SESSION_REVOCATION_UNCONFIRMED',
      requestId: result.requestId,
    },
    { status: 503 },
  );
}
