import type { LegalInstrument } from '@/lib/content/legalCopy';

/**
 * Version and effective date, beneath an instrument's title.
 *
 * IT SHOWS A VERSION, NOT A DATE ALONE. The assent record stores instrument
 * VERSIONS rather than a boolean, precisely so it can always be answered what a
 * given customer actually agreed to (Architecture v2.7 §19.10) — and a version on
 * screen that a reader can quote back is what makes that record meaningful to them
 * rather than only to us.
 */
export function LegalVersionBadge({ instrument }: { instrument: LegalInstrument }) {
  return (
    <p className="legal-version">
      Version {instrument.version} · effective {instrument.effective}
    </p>
  );
}
