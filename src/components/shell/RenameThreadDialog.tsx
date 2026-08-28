'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

/**
 * RENAMING A CONVERSATION, IN A DIALOG.
 *
 * ── WHY THE INLINE INPUT HAD TO GO ──────────────────────────────────────────
 * The rail is a fixed, narrow column, and the input that used to replace the list
 * row inherited that width. A generated title is drawn from the visitor's own
 * opening sentence, so it is routinely 60–80 characters — far more than the field
 * could show. Editing meant scrolling a single-line input horizontally inside a
 * ~230px column, with no way to see the whole name you were changing.
 *
 * A dialog gets the full name on screen at a readable width. It also gives the
 * action a title and an explicit Cancel, so an accidental click is obvious and
 * recoverable rather than a blur away from a silent commit.
 *
 * ── WHAT IS DELIBERATELY PRESERVED ──────────────────────────────────────────
 * Enter saves, Escape cancels (the Modal already binds Escape), and an empty or
 * unchanged name is a no-op rather than an error — the same behaviour the inline
 * editor had. The name is selected on open so the common case, replacing it
 * wholesale, is still one keystroke away.
 *
 * A textarea rather than an input: a long title wraps instead of scrolling out of
 * sight, which is the entire point of moving this out of the rail. Enter is bound
 * to save, so the multi-line affordance never produces a multi-line title.
 */

const MAX_LENGTH = 200;

export interface RenameThreadDialogProps {
  open: boolean;
  currentTitle: string;
  onClose: () => void;
  onSave: (title: string) => void;
}

export function RenameThreadDialog({
  open,
  currentTitle,
  onClose,
  onSave,
}: RenameThreadDialogProps) {
  const copy = useCommonCopy();
  const [draft, setDraft] = useState(currentTitle);
  const ref = useRef<HTMLTextAreaElement | null>(null);

  /* The draft is seeded from props by `useState` above and never re-synced by an
     effect. THE CALLER MOUNTS THIS COMPONENT ONLY WHILE THE DIALOG IS OPEN, so each
     open is a fresh mount with a fresh initial value — the same guarantee a sync
     effect would give, without the cascading render it costs. It also means a
     cancelled edit cannot leak into the next one, and a backend re-label mid-edit
     cannot overwrite what the visitor is typing. */

  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [open]);

  function commit() {
    const next = draft.trim().replace(/\s+/g, ' ').slice(0, MAX_LENGTH);
    /* Empty or unchanged is a no-op, not an error. */
    if (next && next !== currentTitle) onSave(next);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={copy.renameConversation} size="md">
      <div className="rename-dialog">
        <label htmlFor="rename-thread-input" className="rename-dialog__label">
          {copy.conversationName}
        </label>

        <textarea
          id="rename-thread-input"
          ref={ref}
          className="rename-dialog__input"
          value={draft}
          rows={3}
          maxLength={MAX_LENGTH}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              commit();
            }
          }}
        />

        <p className="rename-dialog__hint">
          {copy.renameHint(draft.trim().length, MAX_LENGTH)}
        </p>

        <div className="rename-dialog__actions">
          <button type="button" className="rename-dialog__cancel" onClick={onClose}>
            {copy.cancel}
          </button>
          <button
            type="button"
            className="rename-dialog__save"
            disabled={!draft.trim()}
            onClick={commit}
          >
            {copy.save}
          </button>
        </div>
      </div>
    </Modal>
  );
}
