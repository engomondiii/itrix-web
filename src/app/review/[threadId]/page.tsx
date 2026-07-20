import type { Metadata } from 'next';
import { buildMetadata } from '@/components/seo/PageMeta';
import { ThreadRestore } from '@/components/shell/ThreadRestore';

/**
 * A conversation, addressed directly.
 *
 * This route exists so a thread is ADDRESSABLE and REFRESH-SAFE — not because
 * submitting navigates here. The composer updates the URL with
 * history.replaceState; nothing routes (R21). Landing here from a bookmark or a
 * reload restores the same surface with the same transcript.
 *
 * The heavy lifting is in ThreadRestore, which activates the thread and lets the
 * shell render it. Keeping this file a thin server component means the metadata
 * stays static and the funnel route stays noindex.
 */
export const metadata: Metadata = buildMetadata({
  title: 'Compute Bottleneck Review',
  path: '/review',
  noIndex: true,
});

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;
  return <ThreadRestore threadId={threadId} />;
}
