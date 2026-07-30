'use client';

import { useThreadContext } from '@/context/ThreadContext';
import { ConversationListItem } from './ConversationListItem';
import { RAIL_COPY } from '@/lib/content/composerCopy';

/**
 * The conversation list — the substance of the rail.
 *
 * v4.0's left rail was relationship MEMORY: what we heard, the reflection, the
 * pitch slides. From v5.0 that content is the transcript itself, which is the
 * actual record rather than a summary of one. The rail's job is orientation: which
 * conversations exist and which one is open.
 *
 * v6.0 renames the label from "Your reviews" to "Your conversations" (Playbook v1.7
 * §16A). The old word was funnel language — a customer at State 10 clicking "New
 * review" was not starting a review — and it went with the button.
 *
 * The empty state is a sentence, not a placeholder card. A visitor with no
 * conversations does not need a decorative panel telling them so.
 */
export function ConversationList() {
  const { threads } = useThreadContext();

  return (
    <div className="rail-group">
      <h2 className="rail-group__label">{RAIL_COPY.conversationsLabel}</h2>

      {threads.length === 0 ? (
        <p className="rail-group__empty">{RAIL_COPY.conversationsEmpty}</p>
      ) : (
        <ul className="rail-threads">
          {threads.map((thread) => (
            <ConversationListItem key={thread.id} thread={thread} />
          ))}
        </ul>
      )}
    </div>
  );
}
