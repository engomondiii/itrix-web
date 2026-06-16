import { NextResponse } from 'next/server';
import { apiRoutes } from '@/constants/routes';
import type { RoomId } from '@/types/room.types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const API_BASE = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

interface RoomEntryBody {
  sessionId?: string | null;
  clientId?: string | null;
  roomId?: RoomId;
  visitorType?: string | null;
}

/** Ensures a visitor session exists and records a room entry against it. */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as RoomEntryBody;
  let sessionId: string | null = body.sessionId ?? null;
  try {
    if (!sessionId) {
      const created = await fetch(`${API_BASE}${apiRoutes.visitorSession}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ client_id: body.clientId ?? null, visitor_type: body.visitorType ?? null }),
      });
      if (created.ok) {
        const data = (await created.json()) as { id?: string; session_id?: string };
        sessionId = data.id ?? data.session_id ?? null;
      }
    }
    if (sessionId && body.roomId) {
      await fetch(`${API_BASE}${apiRoutes.visitorRoomEntry(sessionId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ room: body.roomId, visitor_type: body.visitorType ?? null }),
      });
    }
  } catch {
    /* best-effort */
  }
  return NextResponse.json({ sessionId });
}
