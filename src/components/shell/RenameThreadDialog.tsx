'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useCommonCopy } from '@/lib/i18n/commonLocale';
import { useLocaleStore } from '@/store/localeStore';

/**
 * RENAMING A CONVERSATION, IN A DIALOG.
 *
 * The backend is authoritative. A successful Save closes the dialog and updates the
 * local mirror; a failed Save leaves the old title intact and keeps the dialog open
 * with a localized safe error. No server detail is rendered.
 */

const MAX_LENGTH = 200;

export interface RenameThreadDialogProps {
  open: boolean;
  currentTitle: string;
  onClose: () => void;
  onSave: (title: string) => Promise<boolean>;
}

export function RenameThreadDialog({
  open,
  currentTitle,
  onClose,
  onSave,
}: RenameThreadDialogProps) {
  const copy = useCommonCopy();
  const locale = useLocaleStore((state) => state.locale);
  const [draft, setDraft] = useState(currentTitle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const failure = locale === 'ko'
    ? '지금은 해당 대화 이름을 변경할 수 없습니다. 잠시 후 다시 시도해 주세요.'
    : 'We could not rename that conversation just now. Please try again.';

  useEffect(() => {
    if (!open) return;
    const el = ref.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [open]);

  async function commit() {
    if (saving) return;
    const next = draft.trim().replace(/\s+/g, ' ').slice(0, MAX_LENGTH);
    if (!next || next === currentTitle) {
      onClose();
      return;
    }

    setSaving(true);
    setError(null);
    const saved = await onSave(next);
    if (saved) {
      onClose();
      return;
    }
    setSaving(false);
    setError(failure);
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
          disabled={saving}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              void commit();
            }
          }}
        />

        <p className="rename-dialog__hint">
          {copy.renameHint(draft.trim().length, MAX_LENGTH)}
        </p>
        {error ? <p role="alert">{error}</p> : null}

        <div className="rename-dialog__actions">
          <button
            type="button"
            className="rename-dialog__cancel"
            disabled={saving}
            onClick={onClose}
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            className="rename-dialog__save"
            disabled={saving || !draft.trim()}
            onClick={() => { void commit(); }}
          >
            {copy.save}
          </button>
        </div>
      </div>
    </Modal>
  );
}
