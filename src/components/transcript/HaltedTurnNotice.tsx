import { TRANSCRIPT_COPY } from '@/lib/content/composerCopy';

/**
 * The stream guard stopped a response mid-flight.
 *
 * THE PARTIAL TEXT IS DISCARDED, never left on screen. Text that tripped a
 * prohibited pattern is precisely the text that must not be read, so the buffer
 * is dropped rather than kept for context (Architecture v2.6 §19.8, part 2).
 *
 * The visitor is told plainly that we stopped, and that a specialist is
 * preparing an accurate answer. They are not told what the pattern was.
 */
export function HaltedTurnNotice() {
  return (
    <div className="turn__governance" role="status">
      {TRANSCRIPT_COPY.halted}
    </div>
  );
}
