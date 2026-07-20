import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo/PageMeta';
import { ThreadRestore } from '@/components/shell/ThreadRestore';

/**
 * The authenticated thread.
 *
 * THE PORTAL THREAD IS THE PUBLIC THREAD AT A LATER STATE (Surface 1 v5.0 §7.2).
 * It renders the same components, so signing in does not change the interface —
 * the conversation the visitor started anonymously becomes their workspace, with
 * every prior turn, artifact and attachment intact.
 *
 * What it does NOT share is auth. The (portal) route group keeps its own context
 * and middleware; a capability token cannot open this route and a client-JWT is
 * never needed for the public one. Sharing the shell across both zones is a
 * presentation decision only.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Your conversation',
  path: '/workspace/review',
  noIndex: true,
});

export default async function PortalThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  return <ThreadRestore threadId={threadId} />;
}
