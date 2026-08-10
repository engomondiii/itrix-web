'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { AttachControl } from '@/components/composer/AttachControl';
import { AttachmentTray } from '@/components/composer/AttachmentTray';
import { Button } from '@/components/ui/Button';
import { useAttachments } from '@/hooks/useAttachments';
import { siteConfig } from '@/config/site.config';
import { PORTAL_COPY } from '@/lib/content/portalCopy';

/**
 * The portal message input (§63). Enter sends; Shift+Enter newlines.
 *
 * ── ATTACHMENTS (2026-08-10) ──────────────────────────────────────────────────
 * Reuses the approved composer family (AttachControl + AttachmentTray +
 * useAttachments) rather than inventing a portal-only variant, gated by the same
 * flag. `threadId` is the conversation's spine id from the thread payload —
 * attachments stage against it, and the send carries the staged ids. The status
 * socket is off here: the portal thread is not a review channel, and with inline
 * processing the upload response already carries the final status.
 */
export function AgentTeamComposer({
  onSend,
  disabled,
  threadId = null,
}: {
  onSend: (body: string, attachmentIds: string[]) => void;
  disabled?: boolean;
  threadId?: string | null;
}) {
  const [value, setValue] = useState('');
  const attachOn = siteConfig.featureFlags.attachments;
  const attachments = useAttachments(attachOn ? threadId : null, { statusSocket: false });

  function submit() {
    const text = value.trim();
    if ((!text && attachments.ids.length === 0) || disabled || attachments.uploading) return;
    onSend(text, attachments.ids);
    /* The ids are on the turn now; a lingering tray would attach them twice. */
    attachments.clear();
    setValue('');
  }
  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border-medium pt-3">
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
      <div className="flex items-end gap-2">
        {attachOn ? (
          <AttachControl onFiles={attachments.addFiles} disabled={disabled || !threadId} />
        ) : null}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder={PORTAL_COPY.messages.inputPlaceholder}
          disabled={disabled}
          className="min-h-[2.75rem] w-full resize-y rounded-md border border-border-medium bg-surface px-3 py-2 text-body text-ink-primary placeholder:text-ink-secondary focus-visible:border-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-primary focus-visible:ring-offset-1 focus-visible:ring-offset-canvas disabled:opacity-50"
        />
        <Button
          variant="primary"
          size="md"
          onClick={submit}
          disabled={disabled || attachments.uploading || (!value.trim() && attachments.ids.length === 0)}
        >
          {PORTAL_COPY.messages.sendButton}
        </Button>
      </div>
      <p className="text-caption text-ink-secondary">{PORTAL_COPY.messages.inputNote}</p>
    </div>
  );
}
