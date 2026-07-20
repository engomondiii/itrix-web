import { formatBytes } from '@/lib/attachments/formatBytes';
import { MAX_ATTACHMENT_BYTES } from '@/lib/attachments/accept';
import { CONFIDENTIALITY_NOTICE } from '@/lib/content/ctaCopy';

/**
 * Attachment copy — single source (Playbook v1.6 §13.4).
 *
 * ONE RULE ABOVE ALL THE OTHERS:
 *
 *   NEVER CALL AN ACCEPTED FILE A FAILURE.
 *
 * A file that uploads but cannot be text-extracted is not an error. The backend
 * stores it and represents it to the agent by metadata; the visitor is told that
 * plainly and the conversation carries on. They gave us something — we do not
 * tell them it was worthless.
 */
export const ATTACHMENT_COPY = {
  trayLabel: 'Attached',
  attachLabel: 'Attach files',
  removeLabel: 'Remove attachment',
  retryLabel: 'Try again',
  dropHint: 'Drop files to attach',

  status: {
    staged: 'Ready to send',
    uploading: 'Uploading…',
    scanning: 'Checking this file…',
    extracting: 'Reading this file…',
    ready: 'Ready',
    /* Accepted, stored, and honestly described. NOT an error state. */
    opaque:
      'Attached. We could not read the contents of this format, so we will work from what you tell us about it.',
    quarantined:
      'We could not process this file safely, so we have not used it. You can send the message without it.',
    failed: 'This file did not upload. You can try again, or send the message without it.',
    deleted: 'Removed.',
  },

  errors: {
    tooLarge: (name: string) =>
      `${name} is larger than we can accept (${formatBytes(MAX_ATTACHMENT_BYTES)} per file). You can send the message without it, or attach a smaller version.`,
    turnTooLarge: (name: string) =>
      `${name} would take this message over the size we can accept in one go. Try sending it in a second message.`,
    sessionLimit:
      'That is more files than we can take in one session. Nothing already attached has been lost.',
    uploadFailed: 'We could not reach itriX to upload this file. You can try again.',
  },

  /**
   * Shown the first time the attach control is used in a thread, and again in
   * the pre-NDA confirmation. The wording is the approved confidentiality
   * notice — DO NOT REWORD WITHOUT LEGAL SIGN-OFF (§19.4).
   */
  preNdaNotice: CONFIDENTIALITY_NOTICE,

  attachHelper:
    'You can attach documents, spreadsheets, slides, code, images or logs. Any format is fine.',

  deletedAfterSending: 'Removed. We have deleted this file and anything we read from it.',
} as const;
