'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useCommonCopy } from '@/lib/i18n/commonLocale';
import { useRailCopy } from '@/lib/i18n/conversationLocale';
import { useLocaleStore } from '@/store/localeStore';

export interface DeleteThreadDialogProps {
  open: boolean;
  currentTitle: string;
  onClose: () => void;
  onDelete: () => Promise<boolean>;
}

/** Server-authoritative delete confirmation for a public conversation row. */
export function DeleteThreadDialog({
  open,
  currentTitle,
  onClose,
  onDelete,
}: DeleteThreadDialogProps) {
  const copy = useCommonCopy();
  const railCopy = useRailCopy();
  const locale = useLocaleStore((state) => state.locale);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const prompt = locale === 'ko'
    ? `“${currentTitle}” 대화를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
    : `Delete “${currentTitle}”? This cannot be undone.`;
  const failure = locale === 'ko'
    ? '지금은 해당 대화를 삭제할 수 없습니다. 잠시 후 다시 시도해 주세요.'
    : 'We could not delete that conversation just now. Please try again.';

  async function commit() {
    if (deleting) return;
    setDeleting(true);
    setError(null);
    const deleted = await onDelete();
    if (deleted) {
      onClose();
      return;
    }
    setDeleting(false);
    setError(failure);
  }

  return (
    <Modal open={open} onClose={onClose} title={railCopy.delete} size="md">
      <div className="rename-dialog">
        <p>{prompt}</p>
        {error ? <p role="alert">{error}</p> : null}
        <div className="rename-dialog__actions">
          <button
            type="button"
            className="rename-dialog__cancel"
            disabled={deleting}
            onClick={onClose}
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            className="rename-dialog__save"
            disabled={deleting}
            onClick={() => { void commit(); }}
          >
            {railCopy.delete}
          </button>
        </div>
      </div>
    </Modal>
  );
}
