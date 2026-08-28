'use client';

import { useAuthCopy } from '@/lib/i18n/authLocale';

/**
 * A stated wait (R55).
 *
 * ── WHY A NUMBER AND NOT "PLEASE TRY AGAIN LATER" ───────────────────────────
 * A form that silently stops working teaches people to retry harder, which is both
 * frustrating and exactly the traffic the rate limit is there to stop. Naming the wait
 * converts a mysterious failure into a fact someone can act on.
 *
 * It rounds UP to the next minute rather than down. Telling someone to wait one minute
 * when the real answer is ninety seconds produces a second failure and a second dose of
 * confusion.
 */
export function RateLimitNotice({ retryAfterSeconds }: { retryAfterSeconds: number | null }) {
  const authCopy = useAuthCopy();
  if (!retryAfterSeconds || retryAfterSeconds <= 0) return null;
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60));
  return (
    <p role="status" className="auth-rate-limit">
      {authCopy.shared.rateLimited(minutes)}
    </p>
  );
}
