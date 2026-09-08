'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useCommonCopy } from '@/lib/i18n/commonLocale';

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
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(copy.deleteConversationFailed);
  }

  return (
    <Modal open={open} onClose={onClose} title={copy.deleteConversation} size="md">
      <div className="rename-dialog">
        <p>{copy.deleteConversationBody(currentTitle)}</p>
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
            {deleting ? copy.deleting : copy.delete}
          </button>
        </div>
      </div>
    </Modal>
  );
}
