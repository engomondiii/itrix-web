'use client';

import { useEffect } from 'react';
import { ConversationColumn } from './ConversationColumn';
import { Composer } from '@/components/composer/Composer';
import { SituationFraming } from '@/components/center/SituationFraming';
import { MainQuestion } from '@/components/center/MainQuestion';
import { SupportingLine } from '@/components/center/SupportingLine';
import { ExamplePromptGrid } from '@/components/center/ExamplePromptGrid';
import { PathwayHint } from '@/components/center/PathwayHint';
import { useThreadStore } from '@/store/threadStore';

/**
 * Activate a thread addressed by URL, then hand over to the normal surface.
 *
 * It calls `setActive` DIRECTLY rather than `select`, because `select` also
 * rewrites the URL — and here the URL is already correct. Rewriting it would be
 * a pointless history entry on every load.
 *
 * The empty state is the approved centre again, for one honest reason: a visitor
 * can arrive at a thread id that no longer exists, or that their session cannot
 * open. Showing them the front door is better than showing them an error page
 * for a conversation the backend has decided they may not see.
 */
export function ThreadRestore({ threadId }: { threadId: string }) {
  const setActive = useThreadStore((s) => s.setActive);

  useEffect(() => {
    setActive(threadId);
  }, [threadId, setActive]);

  return (
    <ConversationColumn
      emptyState={
        <section className="arrival" aria-labelledby="main-question">
          <div aria-hidden="true" className="arrival__geometry arrival__geometry--left" />
          <div aria-hidden="true" className="arrival__geometry arrival__geometry--right" />
          <div className="arrival__inner">
            <SituationFraming />
            <MainQuestion id="main-question" />
            <SupportingLine />
            <Composer variant="arrival" labelledBy="main-question" />
            <ExamplePromptGrid />
            <PathwayHint />
          </div>
        </section>
      }
    />
  );
}
