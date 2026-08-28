'use client';

import { useAuthCopy } from '@/lib/i18n/authLocale';
import type { PasswordAssessment } from '@/lib/validation/password';

/**
 * The rules, and a meter that measures rather than blocks.
 *
 * ── THE RULES ARE SHOWN BEFORE ANYONE FAILS ─────────────────────────────────
 * Always visible, not surfaced as a correction afterwards. And they DESCRIBE rather
 * than scold: "At least 12 characters" and not "Your password is too weak." The
 * difference is whether the screen is helping or judging.
 *
 * The line also says "Paste from a password manager if you use one", which is a
 * deliberate invitation. We never block paste, and saying so encourages the single most
 * effective thing a person can do for their own security.
 *
 * ── THE METER REPORTS AND NEVER CLAIMS A DURATION ───────────────────────────
 * No "would take 3 years to crack". That number depends on assumptions nobody on the
 * screen can see, and inventing one would be a fabricated claim of exactly the kind
 * §19.5 prohibits everywhere else on this surface. It reports a word — Fair, Good,
 * Strong — and the 12-character floor is the only thing that actually gates.
 *
 * The word is the meaning; the bar is decoration. Nothing here is conveyed by colour
 * alone (§7.4).
 */
export function PasswordRules({
  assessment,
  showMeter = true,
}: {
  assessment: PasswordAssessment;
  showMeter?: boolean;
}) {
  const authCopy = useAuthCopy();
  const label = authCopy.strength[assessment.strength];

  return (
    <div className="password-rules">
      <p className="password-rules__text">{authCopy.reset.rules}</p>

      {showMeter ? (
        <div className="password-rules__meter" data-strength={assessment.strength}>
          <div
            className="password-rules__bar"
            style={{ width: `${assessment.score}%` }}
            aria-hidden="true"
          />
          {/* The word carries the meaning. Announced politely so it does not interrupt
              typing on every keystroke. */}
          <p role="status" aria-live="polite" className="password-rules__label">
            <span className="sr-only">{authCopy.strength.label}: </span>
            {label}
          </p>
        </div>
      ) : null}
    </div>
  );
}
