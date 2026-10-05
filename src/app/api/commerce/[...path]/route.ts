import { NextResponse } from 'next/server';
import { djangoFetch } from '@/lib/server/proxy';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const uuid = '[0-9a-fA-F-]{36}';
const read = new RegExp(`^(availability|orders|licenses|branch|licenses/${uuid}/(environments|decisions))$`);
const write = new RegExp(`^(orders|branch|orders/${uuid}/(accept|checkout|refund)|licenses/${uuid}/(download|activate|seats|decisions))$`);
async function proxy(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const target = path.join('/');
  const isPost = request.method === 'POST';
  if (!(isPost ? write : read).test(target)) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
  if (isPost && request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ detail: 'Invalid origin' }, { status: 403 });
  }
  const result = await djangoFetch<unknown>(`/commerce/${target}/`, {
    method: isPost ? 'POST' : 'GET', authed: target !== 'availability',
    ...(isPost ? { body: await request.json().catch(() => ({})) } : {}),
  });
  return NextResponse.json(result.data ?? { detail: 'Service unavailable' }, { status: result.status || 502 });
}
export const GET = proxy;
export const POST = proxy;
