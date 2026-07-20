'use client';

import { TRANSCRIPT_COPY } from '@/lib/content/composerCopy';
import { TurnActions } from './TurnActions';
import type { Turn } from '@/types/thread.types';

/**
 * The visitor's turn.
 *
 * A TURN IS A BLOCK ON THE PAGE, NOT A BUBBLE (Architecture v2.6 §21.9). The
 * visitor's turn and itriX's turn use the same type scale; only the label and
 * the surface treatment differ. No avatars, no tails, no emoji, no chat-app
 * chrome — this is a precise assessment environment, not a consumer chat product.
 *
 * When a turn could not reach itriX, `contextNote` says so plainly beneath the
 * visitor's own words. Their sentence is never lost and never silently dropped.
 */
export function UserTurn({ turn }: { turn: Turn }) {
  const unavailable = turn.status === 'unavailable';

  return (
    <article className="turn turn--visitor" data-status={turn.status} aria-label={TRANSCRIPT_COPY.visitorTurn}>
      <p className="turn__label">{TRANSCRIPT_COPY.visitorTurn}</p>
      <div className="turn__body">
        {turn.body.split('\n').map((line, i) => (
          <p key={i}>{line || '\u00A0'}</p>
        ))}
      </div>

      {unavailable && turn.contextNote ? (
        <p className="turn__note" role="status">
          {turn.contextNote}
        </p>
      ) : null}

      <TurnActions turn={turn} />
    </article>
  );
}
