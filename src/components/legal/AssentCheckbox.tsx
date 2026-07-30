'use client';

import Link from 'next/link';
import { useId } from 'react';
import { ASSENT_COPY } from '@/lib/content/legalCopy';
import type { LegalInstrumentVersion } from '@/lib/api/legalApi';

/**
 * THE ONE PLACE ASSENT IS TAKEN (Playbook v1.7 §17B, R44).
 *
 * ── FIVE PROPERTIES, EACH OF WHICH MATTERS ──────────────────────────────────
 *
 * 1. UNTICKED BY DEFAULT. A pre-ticked box is not assent; it is a record of us having
 *    ticked it. There is no `defaultChecked` here and there must never be one.
 * 2. IT NAMES THE INSTRUMENTS AND THEIR VERSIONS, in the label the visitor reads. The
 *    record stores versions rather than a boolean, and a version nobody was shown is a
 *    version nobody agreed to.
 * 3. THE LINKS OPEN THE ACTUAL DOCUMENTS, in a new tab, so reading them does not
 *    discard the half-filled form beside the box.
 * 4. IT IS NEVER BUNDLED WITH A MARKETING CONSENT. One box, one meaning. A combined
 *    "I agree to the Terms and would like updates" makes the agreement unprovable.
 * 5. IT BLOCKS. The caller cannot complete account creation without it, and the blocked
 *    message says what to do rather than that something went wrong.
 */
export interface AssentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  versions: LegalInstrumentVersion[];
  /** Shown when the caller tried to continue without it. */
  error?: string | null;
}

function versionOf(versions: LegalInstrumentVersion[], slug: string): string {
  return versions.find((v) => v.slug === slug)?.version ?? '';
}

export function AssentCheckbox({ checked, onChange, versions, error = null }: AssentCheckboxProps) {
  const uid = useId();
  const id = `${uid}-assent`;
  const errorId = `${uid}-assent-error`;

  const terms = versionOf(versions, 'terms');
  const privacy = versionOf(versions, 'privacy');

  return (
    <div className="assent">
      <div className="assent__row">
        <input
          id={id}
          type="checkbox"
          className="assent__box"
          checked={checked}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(e) => onChange(e.target.checked)}
        />
        <label htmlFor={id} className="assent__label">
          {ASSENT_COPY.checkboxPrefix}{' '}
          <Link href="/terms" target="_blank" rel="noopener noreferrer" className="assent__link">
            {ASSENT_COPY.termsName}
          </Link>
          {terms ? ` (v${terms})` : ''} {ASSENT_COPY.and}{' '}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="assent__link">
            {ASSENT_COPY.privacyName}
          </Link>
          {privacy ? ` (v${privacy})` : ''}.
        </label>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="assent__error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
