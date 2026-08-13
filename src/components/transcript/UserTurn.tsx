'use client';

import { useEffect, useRef, useState } from 'react';
import { TRANSCRIPT_COPY } from '@/lib/content/composerCopy';
import { TurnActions } from './TurnActions';
import { TurnAttachmentList } from './TurnAttachmentList';
import { useComposer } from '@/hooks/useComposer';
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
  const { resubmitEdited } = useComposer();

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(turn.body);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  /* A turn still in flight cannot be rewritten — there is nothing settled to
     replace, and the reply it is waiting for would arrive against the old text. */
  const editable = turn.status !== 'pending';

  useEffect(() => {
    if (!editing) return;
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(el.value.length, el.value.length);
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [editing]);

  function cancel() {
    setDraft(turn.body);
    setEditing(false);
  }

  function save() {
    const next = draft.trim();
    setEditing(false);
    if (!next || next === turn.body) {
      setDraft(turn.body);
      return;
    }
    void resubmitEdited(turn.id, next);
  }

  if (editing) {
    return (
      <article className="turn turn--visitor turn--editing" aria-label={TRANSCRIPT_COPY.visitorTurn}>
        <p className="turn__label">{TRANSCRIPT_COPY.visitorTurn}</p>

        <textarea
          ref={ref}
          className="turn__edit-input"
          value={draft}
          aria-label="Edit your message"
          onChange={(e) => {
            setDraft(e.target.value);
            e.currentTarget.style.height = 'auto';
            e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              save();
            }
          }}
        />

        <div className="turn__edit-actions">
          <button type="button" className="turn__edit-cancel" onClick={cancel}>
            Cancel
          </button>
          <button
            type="button"
            className="turn__edit-save"
            disabled={!draft.trim()}
            onClick={save}
          >
            Send
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="turn turn--visitor" data-status={turn.status} aria-label={TRANSCRIPT_COPY.visitorTurn}>
      <p className="turn__label">{TRANSCRIPT_COPY.visitorTurn}</p>
      <div className="turn__body">
        {turn.body.split('\n').map((line, i) => (
          <p key={i}>{line || '\u00A0'}</p>
        ))}
      </div>

      <TurnAttachmentList attachments={turn.attachments ?? []} />

      {unavailable && turn.contextNote ? (
        <p className="turn__note" role="status">
          {turn.contextNote}
        </p>
      ) : null}

      <TurnActions
        turn={turn}
        /* The draft is seeded HERE rather than kept in step by an effect. The turn
           can change underneath this component — a reconcile, or an edit further up
           the transcript — and syncing that in an effect is a cascading render for a
           value nobody is looking at until the editor opens. */
        onEdit={
          editable
            ? () => {
                setDraft(turn.body);
                setEditing(true);
              }
            : undefined
        }
      />
    </article>
  );
}
