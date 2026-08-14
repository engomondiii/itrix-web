'use client';

import { ConversationColumn } from '@/components/shell/ConversationColumn';
import { Composer } from '@/components/composer/Composer';
import { MainQuestion } from '@/components/center/MainQuestion';
import { PathwayHint } from '@/components/center/PathwayHint';

/**
 * The customer's workspace — THE THREAD.
 *
 * /workspace/overview is gone: a customer's home is the conversation they have been
 * having all along, not a dashboard beside it (Surface 1 v6.0 §1.2, §17.2). Signing
 * in does not change the interface; the same thread becomes the workspace.
 *
 * It opens the most recent thread. A customer with no thread yet — rare, but it
 * happens when an account is created out of band — gets the same composer they would
 * have had as a visitor, so there is always somewhere to start.
 *
 * ── WHY THIS EMPTY STATE IS NOT `ArrivalCenter` ─────────────────────────────
 * It deliberately omits the example prompts. Someone who is already a customer does
 * not need five ways to describe a bottleneck they have already described, and the
 * rotating carousel would be actively wrong here — it exists to help a first-time
 * visitor find a phrasing.
 *
 * v6.0: `SituationFraming` is removed with the rest of the product. The question is
 * the h1 here as everywhere else.
 */
export default function WorkspaceIndex() {
  return (
    <ConversationColumn
      emptyState={
        <section className="arrival-center" aria-labelledby="main-question">
          <MainQuestion id="main-question" />
          <Composer variant="arrival" labelledBy="main-question" />
          <PathwayHint />
        </section>
      }
    />
  );
}
