'use client';

import { useEffect } from 'react';
import { ConversationColumn } from './ConversationColumn';
import { ArrivalCenter } from '@/components/arrival/ArrivalCenter';
import { useThreadStore } from '@/store/threadStore';

/**
 * Activate a thread addressed by URL, then hand over to the normal surface.
 *
 * It calls `setActive` DIRECTLY rather than `select`, because `select` also
 * rewrites the URL — and here the URL is already correct. Rewriting it would be a
 * pointless history entry on every load.
 *
 * The empty state is the approved centre, for one honest reason: a visitor can
 * arrive at a thread id that no longer exists, or that their session cannot open.
 * Showing them the front door is better than showing them an error page for a
 * conversation the backend has decided they may not see.
 *
 * v6.0: it renders `ArrivalCenter` rather than re-assembling the centre from its
 * parts. The old inline copy is how the framing line survived in three files at
 * once; one component, one composition.
 */
export function ThreadRestore({ threadId }: { threadId: string }) {
  const setActive = useThreadStore((s) => s.setActive);

  useEffect(() => {
    setActive(threadId);
  }, [threadId, setActive]);

  return <ConversationColumn emptyState={<ArrivalCenter />} />;
}
