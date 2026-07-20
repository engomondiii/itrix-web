'use client';

import { useEffect } from 'react';
import { ConversationColumn } from '@/components/shell/ConversationColumn';
import { Composer } from '@/components/composer/Composer';
import { SituationFraming } from '@/components/center/SituationFraming';
import { MainQuestion } from '@/components/center/MainQuestion';
import { SupportingLine } from '@/components/center/SupportingLine';
import { PathwayHint } from '@/components/center/PathwayHint';
import { useThreadStore } from '@/store/threadStore';

/**
 * The customer's workspace — THE THREAD.
 *
 * PHASE 3 completes what Phase 1 deferred. /workspace/overview is gone: a
 * customer's home is the conversation they have been having all along, not a
 * dashboard beside it (Surface 1 v5.0 §1.2, §17.2). Signing in does not change
 * the interface; the same thread becomes the workspace.
 *
 * It opens the most recent thread. A customer with no thread yet — rare, but it
 * happens when an account is created out of band — gets the same composer they
 * would have had as a visitor, so there is always somewhere to start.
 *
 * The empty state deliberately omits the example prompts: someone who is already
 * a customer does not need five ways to describe a bottleneck they have already
 * described.
 */
export default function WorkspaceIndex() {
  const threads = useThreadStore((s) => s.threads);
  const activeThreadId = useThreadStore((s) => s.activeThreadId);
  const setActive = useThreadStore((s) => s.setActive);

  useEffect(() => {
    if (activeThreadId) return;
    const latest = threads[0];
    if (latest) setActive(latest.id);
  }, [activeThreadId, threads, setActive]);

  return (
    <ConversationColumn
      emptyState={
        <section className="arrival" aria-labelledby="main-question">
          <div className="arrival__inner">
            <SituationFraming />
            <MainQuestion id="main-question" />
            <SupportingLine />
            <Composer variant="arrival" labelledBy="main-question" />
            <PathwayHint />
          </div>
        </section>
      }
    />
  );
}
