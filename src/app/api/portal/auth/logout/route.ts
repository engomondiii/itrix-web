import { NextResponse } from 'next/server';
import { clearClientSession } from '@/lib/server/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/portal/auth/logout — clears the httpOnly client-JWT cookies. */
export async function POST() {
  await clearClientSession();
  return NextResponse.json({ ok: true });
}
