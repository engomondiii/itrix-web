'use client';

import { useCallback, useId, useState } from 'react';
import type { ClipboardEvent, DragEvent } from 'react';
import { PromptTextarea } from './PromptTextarea';
import { SendArrowButton } from './SendArrowButton';
import { ComposerFooter } from './ComposerFooter';
import { AttachControl } from './AttachControl';
import { AttachmentTray } from './AttachmentTray';
import { useComposer } from '@/hooks/useComposer';
import { useAttachments } from '@/hooks/useAttachments';
import { useShellContext } from '@/context/ShellContext';
import { useThreadContext } from '@/context/ThreadContext';
import { siteConfig } from '@/config/site.config';
import { COMPOSER_COPY } from '@/lib/content/composerCopy';
import { ATTACHMENT_COPY } from '@/lib/content/attachmentCopy';
import { filesFromClipboard } from '@/lib/attachments/accept';

/**
 * THE COMPOSER — one component at every state.
 *
 * Only the LABEL changes (Surface 1 v5.0 §3.5):
 *   1      What would you like computation to do better?   → creates the thread
 *   2–9    Ask itriX                                       → the Concierge
 *   10     What can we improve for you?                    → improvement router
 *
 * Invariants at every state, all of them acceptance criteria:
 *   · the send control is an ICON-ONLY ARROW — there is no "Begin review" button
 *   · there is NO character counter and no maxLength
 *   · the confidentiality notice sits beneath it
 *   · Enter submits, Shift+Enter inserts a newline
 *   · SUBMITTING NEVER NAVIGATES (R21) — see useComposer for the contract
 *   · it is never replaced by a form, a wizard or a modal
 *
 * PHASE 2 adds attachments. The whole prompt shell is the drop target, not just
 * the paperclip, and paste works too — a visitor dragging an architecture PDF
 * aims at the box, not at a 32px button.
 *
 * SEND IS BLOCKED ONLY WHILE AN UPLOAD IS STILL IN FLIGHT. It is never blocked
 * because an upload FAILED: a failed file is reported beside the tray and the
 * message goes without it (Surface 1 v5.0 §3.6).
 */
export interface ComposerProps {
  variant?: 'arrival' | 'docked';
  /** Points the textarea at the main question, which acts as its visible label. */
  labelledBy?: string;
}

export function Composer({ variant = 'arrival', labelledBy }: ComposerProps) {
  const uid = useId();
  const textareaId = `${uid}-prompt`;
  const noteId = `${uid}-note`;
  const statusId = `${uid}-status`;

  const { value, submitting, error, setValue, submit, canSubmit } = useComposer();
  const { composerLabel, journeyState, attachmentsEnabled } = useShellContext();
  const { activeThreadId } = useThreadContext();
  const attachments = useAttachments(activeThreadId);
  const [dragging, setDragging] = useState(false);

  const docked = variant === 'docked';
  const attachOn = siteConfig.featureFlags.attachments && attachmentsEnabled !== false;

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      if (!attachOn) return;
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer?.files ?? []);
      if (files.length > 0) attachments.addFiles(files);
    },
    [attachOn, attachments],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLDivElement>) => {
      if (!attachOn) return;
      const files = filesFromClipboard(e.clipboardData?.items ?? null);
      if (files.length > 0) {
        e.preventDefault();
        attachments.addFiles(files);
      }
    },
    [attachOn, attachments],
  );

  async function handleSubmit() {
    await submit(attachOn ? attachments.ids : []);
    /* The tray belongs to the next turn now. Clearing after — not before — means
       a failed submit does not silently discard someone's files. */
    if (attachOn) attachments.clear();
  }

  return (
    <form
      className="composer"
      data-variant={variant}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit();
      }}
    >
      {docked && journeyState && journeyState > 1 ? (
        <p className="composer__label">{composerLabel}</p>
      ) : null}

      <div
        className="composer-shell"
        data-invalid={error ? 'true' : undefined}
        data-dragging={dragging || undefined}
        onDragOver={(e) => {
          if (!attachOn) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onPaste={handlePaste}
      >
        {attachOn ? (
          <AttachControl onFiles={attachments.addFiles} disabled={submitting} />
        ) : (
          /* The leading glyph from the approved composition. Decorative. */
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="composer-shell__icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 4.75h14A2.25 2.25 0 0 1 21.25 7v8A2.25 2.25 0 0 1 19 17.25h-7.25L7 20v-2.75H5A2.25 2.25 0 0 1 2.75 15V7A2.25 2.25 0 0 1 5 4.75Z" />
            <path d="M7 9h10M7 13h7" />
          </svg>
        )}

        <PromptTextarea
          id={textareaId}
          value={value}
          onChange={setValue}
          onSubmit={() => void handleSubmit()}
          describedBy={`${noteId} ${statusId}`}
          labelledBy={labelledBy}
          placeholder={docked ? COMPOSER_COPY.placeholderContinuing : COMPOSER_COPY.placeholder}
          invalid={Boolean(error)}
          minRows={docked ? 2 : 3}
        />

        <SendArrowButton
          disabled={!canSubmit || (attachOn && attachments.uploading)}
          submitting={submitting}
        />

        {dragging ? (
          <p className="composer-shell__drop" aria-hidden="true">
            {ATTACHMENT_COPY.dropHint}
          </p>
        ) : null}
      </div>

      {attachOn ? (
        <AttachmentTray
          items={attachments.items}
          rejected={attachments.rejected}
          showNotice={attachments.noticeShown}
          onRemove={attachments.remove}
          onRetry={attachments.retry}
          onDismissRejected={attachments.dismissRejected}
        />
      ) : null}

      <ComposerFooter
        noteId={noteId}
        statusId={statusId}
        error={error}
        variant={docked ? 'full' : 'short'}
      />
    </form>
  );
}
