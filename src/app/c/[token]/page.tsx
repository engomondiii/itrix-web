import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { buildMetadata } from '@/components/seo/PageMeta';
import { JourneyProvider } from '@/context/JourneyContext';
import { RelationshipShell } from '@/components/shell/RelationshipShell';
import { StableCenterWorkspace } from '@/components/shell/StableCenterWorkspace';
import { ClientPageLive } from '@/components/client-page/ClientPageLive';
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
 * PHASE 2: the pitch room now renders INSIDE the relationship shell rather than
 * as a standalone page. The visitor keeps the same centre, and the rails that
 * appear beside it are the ones the backend authorized for their state — their
 * saved context on the left, the next step and the disclosure boundary on the
 * right. Signing in later does not change interface; it changes state.
 *
 * JourneyProvider wraps the shell so both read the same subscription. Rails and
 * state can never disagree, because there is only one of each.
 */
export default async function ClientPageRoute({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const page = await fetchClientPage(token);
  if (!page) notFound();

  return (
    <JourneyProvider token={token}>
      <RelationshipShell>
        <StableCenterWorkspace variant="work">
          <div id="pitch-room">
            <ClientPageLive token={token} initialPage={page} />
          </div>
        </StableCenterWorkspace>
      </RelationshipShell>
    </JourneyProvider>
  );
}
