import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
export async function POST() { return NextResponse.json({ error: { detail: 'Legacy review access is retired.' } }, { status: 410 }); }
