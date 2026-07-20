import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { buildMetadata } from '@/components/seo/PageMeta';
import { JourneyProvider } from '@/context/JourneyContext';
import { ClientPageLive } from '@/components/client-page/ClientPageLive';
import { Composer } from '@/components/composer/Composer';
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

/**
 * The customized client page — State 4, the pitch room.
 *
 * It renders the token-bound artifact inside the conversation shell (mounted
 * globally in app/layout.tsx) WITH THE COMPOSER BENEATH IT (Surface 1 v5.0 §4).
 * That last part is the point: a visitor who opens their emailed brief and wants
 * to react to slide three should be able to say so on the spot, rather than
 * hunting for a way back into the conversation.
 *
 * The capability-token semantics are UNCHANGED. This is still the emailed link,
 * and Django still re-checks token, journey and disclosure on every fetch.
 */
export default async function ClientPageRoute({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const page = await fetchClientPage(token);
  if (!page) notFound();

  return (
    <JourneyProvider token={token}>
      <div className="token-page">
        <div id="pitch-room">
          <ClientPageLive token={token} initialPage={page} />
        </div>

        <div className="token-page__composer">
          <Composer variant="docked" />
        </div>
      </div>
    </JourneyProvider>
  );
}
