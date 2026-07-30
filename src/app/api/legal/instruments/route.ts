import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

/**
 * GET /api/legal/instruments — the versions the backend believes are current
 * (Backend v7.0 §7.1).
 *
 * ── WHY THIS EXISTS AT ALL ──────────────────────────────────────────────────
 * The frontend already ships the instruments and their versions in
 * lib/content/legalCopy.ts, so it does not need the backend to render them. What it
 * needs is a way to notice DISAGREEMENT: if the backend has moved to Terms v1.1 and this
 * build is still showing v1.0, every assent recorded from here is attached to a version
 * the visitor did not read.
 *
 * So this is a reconciliation endpoint, used for a development warning. It never decides
 * what is displayed, and an empty answer is not an error — before Backend v7.0 Phase 3
 * ships, there is nothing to reconcile against.
 */
export async function GET(req: Request) {
  const cookie = req.headers.get('cookie');
  try {
    const res = await fetch(`${API_BASE}/legal/instruments/`, {
      method: 'GET',
      headers: { Accept: 'application/json', ...(cookie ? { cookie } : {}) },
      cache: 'no-store',
    });
    if (!res.ok) return NextResponse.json({ instruments: [] }, { status: 200 });
    const payload = (await res.json()) as Record<string, unknown>;
    const raw = Array.isArray(payload.instruments) ? payload.instruments : [];
    return NextResponse.json(
      {
        instruments: raw
          .map((i) => {
            const r = (i ?? {}) as Record<string, unknown>;
            return {
              slug: typeof r.slug === 'string' ? r.slug : '',
              version: typeof r.version === 'string' ? r.version : '',
              effective:
                typeof r.effective === 'string'
                  ? r.effective
                  : typeof r.effective_date === 'string'
                    ? r.effective_date
                    : '',
            };
          })
          .filter((i) => i.slug),
      },
      { status: 200 },
    );
  } catch {
    /* Absent rather than failing. Nothing on the surface depends on this answering. */
    return NextResponse.json({ instruments: [] }, { status: 200 });
  }
}
