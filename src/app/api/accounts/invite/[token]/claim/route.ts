import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { djangoFetch } from '@/lib/server/proxy';
import { setClientSession, setPasswordSetCapability } from '@/lib/server/session';
import type { InviteClaimResult } from '@/types/client.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface ClaimBody {
  email?: string;
  password?: string;
  full_name?: string;
  organization?: string;
  role?: string;
  assent?: { slug: string; version: string; effective: string }[];
}

type ClaimBackend = {
  client?: InviteClaimResult['client'];
  access?: string;
  refresh?: string;
  requiresPasswordSet?: boolean;
  setPasswordToken?: string;
  code?: string;
};

export async function POST(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const body = (await req.json().catch(() => ({}))) as ClaimBody;

  const res = await djangoFetch<ClaimBackend>(apiRoutes.accountInviteClaim(token), {
    method: 'POST',
    authed: false,
    body: {
      email: body.email ?? null,
      password: body.password ?? null,
      full_name: body.full_name ?? '',
      organization: body.organization ?? '',
      role: body.role ?? '',
      assent: Array.isArray(body.assent) ? body.assent : [],
    },
  });

  if (res.status === 409 && res.data?.code === 'LEGAL_TERMS_CHANGED') {
    return NextResponse.json({ code: 'LEGAL_TERMS_CHANGED' }, { status: 409 });
  }
  if (res.status === 404 || res.status === 403 || res.status === 410) {
    return NextResponse.json({ error: { detail: 'invite_invalid' } }, { status: 404 });
  }
  if (!res.ok || !res.data?.client) {
    return NextResponse.json({ error: { detail: 'invite_claim_unavailable' } }, { status: 502 });
  }

  if (res.data.access) {
    await setClientSession({ accessToken: res.data.access, refreshToken: res.data.refresh ?? null });
  }
  if (res.data.requiresPasswordSet && res.data.setPasswordToken) {
    await setPasswordSetCapability(res.data.setPasswordToken);
  }

  const result: InviteClaimResult = {
    client: res.data.client,
    requiresPasswordSet: Boolean(res.data.requiresPasswordSet),
  };
  return NextResponse.json(result);
}
