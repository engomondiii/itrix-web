'use client';

import { useThreadContext } from '@/context/ThreadContext';
import { ConversationListItem } from './ConversationListItem';
import { SIDEBAR_COPY } from '@/lib/content/composerCopy';

/**
 * The conversation list — what replaced the left relationship rail.
 *
 * v4.0's left rail was relationship MEMORY: what we heard, the reflection, the
 * pitch slides. In v5.0 that content is the transcript itself, which is the
 * actual record rather than a summary of one. The sidebar's job is orientation:
 * which conversations exist and which one is open.
 *
 * The empty state is a sentence, not a placeholder card. A visitor at State 1
 * has no reviews yet and does not need a decorative panel telling them so.
 */
export function ConversationList() {
  const { threads } = useThreadContext();

  return (
    <div className="sidebar-section">
      <h2 className="sidebar-section__label">{SIDEBAR_COPY.conversationsLabel}</h2>

      {threads.length === 0 ? (
        <p className="sidebar-section__empty">{SIDEBAR_COPY.conversationsEmpty}</p>
      ) : (
        <ul className="sidebar-threads">
          {threads.map((thread) => (
            <ConversationListItem key={thread.id} thread={thread} />
          ))}
        </ul>
      )}
    </div>
  );
}
