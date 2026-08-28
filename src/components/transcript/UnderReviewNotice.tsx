'use client';

import { useTranscriptCopy } from '@/lib/i18n/conversationLocale';


/**
 * A turn placed under review by governance.
 *
 * The visitor sees the APPROVED WORDING and never the blocked text. Provisional
 * streamed text is replaced, not appended to — the frontend cannot display an
 * unapproved final message (Architecture v2.6 §19.8, part 3).
 *
 * The copy is calm and non-alarming, does not apologise excessively, and NEVER
 * explains what was blocked or why. Do not reword without Governance sign-off;
 * the string lives once, in transcriptCopy.
 */
export function UnderReviewNotice() {
  const transcriptCopy = useTranscriptCopy();
  return (
    <div className="turn__governance" role="status">
      {transcriptCopy.underReview}
    </div>
  );
}
