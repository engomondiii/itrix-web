import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type { JourneyStatePayload } from '@/types/journey.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/journey/[token] — proxy to Django GET /journey/{token}/.
 * Returns the current journey state + authorized surface + reveals. On backend
 * failure it degrades to a safe ARRIVED payload so the client keeps polling
 * without breaking (the backend remains authoritative).
 */
export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.journeyState(token)}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json(safeFallback(), { status: 200 });
    }
    const data = (await res.json()) as JourneyStatePayload;
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(safeFallback(), { status: 200 });
  }
}

function safeFallback(): JourneyStatePayload {
  return {
    state: 'ARRIVED',
    authorizedSurface: null,
    reveals: [],
    valueDelivered: false,
    accountInviteAvailable: false,
  };
}
