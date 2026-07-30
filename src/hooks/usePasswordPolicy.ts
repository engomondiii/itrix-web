'use client';

import { useMemo } from 'react';
import { assessPassword, passwordsMatch, type PasswordAssessment } from '@/lib/validation/password';

/**
 * The password policy, as a hook.
 *
 * It holds no state — the caller owns the field values. It exists so that the three
 * routes which set a password (sign-up under open registration, set-password,
 * reset-password) and the account-creation page all reach the SAME rules through the
 * same call, rather than each re-deriving "is this long enough" inline (R52).
 *
 * `create-account/page.tsx` previously validated at 10 characters in its own
 * `validate()`. That is the drift this closes.
 */
export interface UsePasswordPolicyResult extends PasswordAssessment {
  matches: boolean;
  /** True when both fields are ready to submit. */
  ready: boolean;
}

export function usePasswordPolicy(password: string, confirm?: string): UsePasswordPolicyResult {
  return useMemo(() => {
    const assessment = assessPassword(password);
    /* When no confirmation field is in play, matching is not a condition. */
    const matches = confirm === undefined ? true : passwordsMatch(password, confirm);
    return { ...assessment, matches, ready: assessment.valid && matches };
  }, [password, confirm]);
}
