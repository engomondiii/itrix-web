import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { buildMetadata } from '@/components/seo/PageMeta';
import { JourneyProvider } from '@/context/JourneyContext';
import { ClientPageShell } from '@/components/client-page/ClientPageShell';
import type { ClientPage } from '@/types/client.types';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

/** The customized client page is never indexed. */
export const metadata: Metadata = buildMetadata({
  title: 'Your itriX review',
  path: '/c',
  noIndex: true,
});

/** Server-side fetch of the token-gated page via our own proxy (absolute URL). */
async function fetchClientPage(token: string): Promise<ClientPage | null> {
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const base = host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
    const res = await fetch(`${base}/api/client-page/${encodeURIComponent(token)}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as ClientPage;
  } catch {
    return null;
  }
}

export default async function ClientPageRoute({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const page = await fetchClientPage(token);
  if (!page) notFound();

  return (
    <JourneyProvider token={token}>
      <ClientPageShell page={page} />
    </JourneyProvider>
  );
}
