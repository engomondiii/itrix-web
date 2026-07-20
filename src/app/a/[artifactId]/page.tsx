import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo/PageMeta';
import { ArtifactDeepLink } from '@/components/artifacts/ArtifactDeepLink';

/**
 * An artifact, addressed directly.
 *
 * This is an ALTERNATIVE view — for print, for sharing, and for a visitor who
 * wants the brief on its own. It is NEVER the only way to see an artifact: the
 * in-thread rendering is primary by contract, and this page always carries a way
 * back into the conversation that produced it (Architecture v2.6 §2.5 and the
 * risk register entry on deep links).
 *
 * Authorization is entirely the backend's. Django re-checks the session, the
 * journey state and the disclosure ceiling on every read, so a guessed id
 * returns nothing rather than something.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Your itriX brief',
  path: '/a',
  noIndex: true,
});

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ artifactId: string }>;
}) {
  const { artifactId } = await params;
  return <ArtifactDeepLink artifactId={artifactId} />;
}
