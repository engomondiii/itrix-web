import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { getClientAccessToken } from '@/lib/server/session';
import { clearReviewAccess, getReviewAccessToken, getVisitorBinding } from '@/lib/server/reviewAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export async function GET() {
  const review = await getReviewAccessToken();
  const visitor = await getVisitorBinding();
  if (!review) return NextResponse.json({ error: { detail: 'Review access is unavailable.' } }, { status: 404 });
  const clientToken = await getClientAccessToken();
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.clientPageCurrent}`, {
      headers: {
        Accept: 'application/json',
        'X-Itrix-Client-Page-Session': review,
        ...(visitor ? { 'X-Itrix-Session': visitor } : {}),
        ...(clientToken ? { Authorization: `Bearer ${clientToken}` } : {}),
      },
      cache: 'no-store',
    });
    if (!res.ok) {
      const out = NextResponse.json({ error: { detail: 'Review access is unavailable.' } }, { status: 404 });
      clearReviewAccess(out);
      return out;
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: { detail: 'Review service unavailable.' } }, { status: 503 });
  }
}
