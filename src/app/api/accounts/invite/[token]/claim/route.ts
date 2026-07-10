import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import { setClientSession } from '@/lib/server/session';
import type { InviteClaimResult } from '@/types/client.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ClaimBody {
  email?: string;
  password?: string;
  full_name?: string;
  organization?: string;
  role?: string;
}

/**
 * POST /api/accounts/invite/[token]/claim — reveal ③.
 * Consumes the single-use account-invite capability token: Django creates the
 * Client from the Lead, mints a client-JWT, and returns it. We store the JWT in an
 * httpOnly cookie server-side (never exposed to JS) and return the client profile.
 * The invite token is authoritative on the backend; a bad/expired/used token 4xxs.
 */
export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as ClaimBody;

  // Unauthenticated call (no client-JWT yet) — the invite token IS the credential.
  const res = await djangoFetch<{
    client: InviteClaimResult['client'];
    access?: string;
    refresh?: string;
    requiresPasswordSet?: boolean;
  }>(apiRoutes.accountInviteClaim(token), {
    method: 'POST',
    authed: false,
    body: {
      email: body.email ?? null,
      password: body.password ?? null,
      full_name: body.full_name ?? '',
      organization: body.organization ?? '',
      role: body.role ?? '',
    },
  });

  if (res.status === 404 || res.status === 403 || res.status === 410) {
    return NextResponse.json({ error: { detail: 'invite_invalid' } }, { status: 404 });
  }
  if (!res.ok || !res.data) {
    return NextResponse.json({ error: { detail: `invite_claim ${res.status}` } }, { status: 502 });
  }

  // Store the minted client-JWT in httpOnly cookies (if issued at claim time).
  if (res.data.access) {
    await setClientSession({ accessToken: res.data.access, refreshToken: res.data.refresh ?? null });
  }

  const result: InviteClaimResult = {
    client: res.data.client,
    requiresPasswordSet: Boolean(res.data.requiresPasswordSet),
  };
  return NextResponse.json(result);
}
