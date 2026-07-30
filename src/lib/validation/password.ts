/**
 * THE PASSWORD POLICY — one place, and this is it.
 *
 * Architecture v2.8 §26.4 · Surface 1 v7.0 §16.6 · R52, R53
 *
 * ── WHY LENGTH AND NOTHING ELSE ─────────────────────────────────────────────
 *
 * Twelve characters minimum, and NO composition requirements. That is not laxness;
 * it is the only rule that reliably increases entropy. A mandatory symbol, digit and
 * capital produces `Password1!` — a string that satisfies every box on the form and
 * appears near the top of every cracking dictionary. The rule feels rigorous and
 * makes accounts easier to attack, which is the worst combination a security control
 * can have.
 *
 * No forced rotation, because rotation produces `Password1!` then `Password2!`. No
 * security questions, because the answers are public and unchangeable. No blocked
 * paste, because blocking paste breaks password managers — the single most effective
 * thing a person can do for their own security.
 *
 * ── THE MEASURE IS NOT A GATE ───────────────────────────────────────────────
 * `score()` reports; only `MIN_LENGTH` blocks. And it deliberately returns no
 * time-to-crack figure: that number depends on assumptions nobody on the screen can
 * see, and inventing one would be a fabricated claim of exactly the kind §19.5
 * prohibits everywhere else on this surface.
 *
 * ── THE NUMBER LIVES IN FOUR PLACES, AND THE BACKEND'S BINDS ────────────────
 * Terms §3A, Security §3A, this file, and `PASSWORD_MIN_LENGTH` in Django settings.
 * The backend's value is authoritative: the surface can only refuse early, it cannot
 * permit something the backend rejects. If they ever disagree, this file is the one
 * that is wrong.
 */

export const PASSWORD_MIN_LENGTH = 12;

/**
 * A ceiling exists so a megabyte of text cannot be posted at the hashing function,
 * which is a denial-of-service rather than a strength question. It is deliberately
 * high enough that no honest passphrase reaches it, and it is NOT shown as a hint —
 * a maximum low enough to be worth mentioning is a maximum that is too low.
 */
export const PASSWORD_MAX_LENGTH = 128;

export type PasswordStrength = 'short' | 'fair' | 'good' | 'strong';

export interface PasswordAssessment {
  /** The only gate. */
  valid: boolean;
  /** Reported, never enforced. */
  strength: PasswordStrength;
  /** 0–100, for the meter's width. Not a probability and not a duration. */
  score: number;
  tooShort: boolean;
  tooLong: boolean;
}

/**
 * Assess a candidate password.
 *
 * The score is a crude blend of length and character variety, weighted heavily toward
 * length because that is what actually matters. It exists to give a person feedback
 * that gets better as they type, not to model an attacker.
 */
export function assessPassword(value: string): PasswordAssessment {
  const length = value.length;
  const tooShort = length < PASSWORD_MIN_LENGTH;
  const tooLong = length > PASSWORD_MAX_LENGTH;

  /* Length carries 75 of the 100 points, saturating at 24 characters — twice the
     minimum, which is where a passphrase comfortably sits. */
  const lengthPoints = Math.min(75, Math.round((length / 24) * 75));

  /* Variety carries the remaining 25, and only as a nudge. A 20-character all-lower
     passphrase should still read as strong, because it is. */
  const classes = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(value)).length;
  const varietyPoints = classes * 6;

  const score = Math.max(0, Math.min(100, lengthPoints + varietyPoints));

  const strength: PasswordStrength = tooShort
    ? 'short'
    : score >= 85
      ? 'strong'
      : score >= 62
        ? 'good'
        : 'fair';

  return { valid: !tooShort && !tooLong, strength, score, tooShort, tooLong };
}

/** True when the two entries match and are non-empty. */
export function passwordsMatch(a: string, b: string): boolean {
  return a.length > 0 && a === b;
}
