import { CENTER_COPY } from '@/lib/content/centerCopy';
import { CONFIDENTIALITY_NOTICE } from '@/lib/content/ctaCopy';

export interface ConfidentialityNoteProps {
  id?: string;
  /**
   * `short` — the one-line note beneath the composer on the approved center.
   * `full`  — the EXACT approved wording, required wherever a visitor can
   *           describe a problem in depth (review surface, file controls,
   *           client page near proof, portal message box).
   * `hint`  — legacy alias for `short`, kept so the call sites this component
   *           inherited from homepage/ConfidentialityNote keep working.
   */
  variant?: 'short' | 'full' | 'hint';
  className?: string;
}

/**
 * The confidentiality notice.
 *
 * This is a SAFETY CONTROL, not marketing copy (Playbook §09 / v1.5 §19.4).
 * Both strings are approved wording:
 *
 *   short — "A non-confidential summary is enough to begin."
 *   full  — "Please do not submit confidential technical information before an
 *            NDA. The initial assessment is based on non-confidential workload
 *            descriptions only."
 *
 * DO NOT reword either without Legal + Benjamin sign-off. They live in exactly
 * one place each so a reword is impossible to do by accident.
 */
export function ConfidentialityNote({ id, variant = 'full', className = '' }: ConfidentialityNoteProps) {
  const short = variant === 'short' || variant === 'hint';
  const text = short ? CENTER_COPY.safetyNote : CONFIDENTIALITY_NOTICE;

  return (
    <p id={id} className={`flex items-start gap-2 text-caption text-ink-secondary ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="mt-[2px] h-4 w-4 shrink-0 text-ink-muted"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3 5.5 6v5.5c0 4.2 2.7 7.6 6.5 9.5 3.8-1.9 6.5-5.3 6.5-9.5V6L12 3Z" />
        <path d="m9.3 12.1 1.8 1.8 3.8-4" />
      </svg>
      <span>{text}</span>
    </p>
  );
}
