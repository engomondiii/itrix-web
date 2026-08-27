import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import { getClientAccessToken } from '@/lib/server/session';
import { clearReviewAccess, getReviewAccessToken, getVisitorBinding } from '@/lib/server/reviewAccess';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export async function POST(req: Request) {
  const review = await getReviewAccessToken();
  const visitor = await getVisitorBinding();
  if (!review) return NextResponse.json({ error: { detail: 'Review access is unavailable.' } }, { status: 404 });
  const body = await req.json().catch(() => ({}));
  const clientToken = await getClientAccessToken();
  try {
    const res = await fetch(`${API_BASE}${apiRoutes.clientPageCurrentChat}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Itrix-Client-Page-Session': review,
        ...(visitor ? { 'X-Itrix-Session': visitor } : {}),
        ...(clientToken ? { Authorization: `Bearer ${clientToken}` } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({}));
    const out = NextResponse.json(data, { status: res.ok ? 200 : res.status === 400 ? 400 : 404 });
    if (!res.ok && res.status !== 400) clearReviewAccess(out);
    return out;
  } catch {
    return NextResponse.json({ error: { detail: 'Review service unavailable.' } }, { status: 503 });
  }
}
