'use client';

import Link from 'next/link';
import { useShellContext } from '@/context/ShellContext';
import { useKeepWorkStore } from '@/store/keepWorkStore';
import { KEEP_WORK_COPY } from '@/lib/content/authCopy';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * KEEPING AN ANONYMOUS CONVERSATION (Playbook v1.9 §18H, R65).
 *
 * ── WHY THIS IS ALLOWED BEFORE VALUE IS DELIVERED ───────────────────────────
 * It is an offer about the visitor's OWN WORK, not a commitment ask. It asks for nothing
 * and offers nothing commercial, which is exactly what puts it outside the value-first
 * gate — and exactly what it must not stop being.
 *
 * Three constraints, each load-bearing:
 *
 *   NOT IN THE CONTENT PANE   §2.7 and the §11.6A relocation list keep the pane a reading
 *                             surface. A card with an action in it belongs in the
 *                             conversation.
 *   NO COMMERCIAL CONTENT     no next step, no offer, no pathway hint, no assessment, no
 *                             PoC, no licence. The moment a sentence about our services
 *                             appears here it becomes a commitment ask and belongs at
 *                             State 5.
 *   ONCE PER THREAD           dismissible, and never again after dismissal. A second
 *                             appearance turns an offer into pressure.
 *
 * ── AND IT ONLY EXISTS FOR SOMEBODY WITH NO ACCOUNT ─────────────────────────
 * `identityState` is DERIVED by the backend and carried on the shell contract; the surface
 * does not decide it. An account holder never sees this, which is the same rule that
 * suppresses the State 5 workspace ask for them (R67).
 */
export function KeepThisWorkCard({
  threadId,
  hasSettledAnswer,
}: {
  threadId: string | null;
  hasSettledAnswer: boolean;
}) {
  const identityState = useShellContext().identityState;
  const dismissed = useKeepWorkStore((s) => (threadId ? Boolean(s.dismissed[threadId]) : false));
  const dismiss = useKeepWorkStore((s) => s.dismiss);

  if (!threadId || !hasSettledAnswer) return null;
  if (identityState !== 'anonymous') return null;
  if (dismissed) return null;

  return (
    <aside className="keep-work" aria-labelledby={`keep-work-${threadId}`}>
      <p id={`keep-work-${threadId}`} className="keep-work__title">
        {KEEP_WORK_COPY.title}
      </p>
      <p className="keep-work__body">{KEEP_WORK_COPY.body}</p>
      <div className="keep-work__actions">
        <Link
          href={routes.portalSignUp}
          className="keep-work__action"
          onClick={() => trackEvent('auth.signup_door_chosen', { door: 'keep_work' })}
        >
          {KEEP_WORK_COPY.action}
        </Link>
        <button type="button" className="keep-work__dismiss" onClick={() => dismiss(threadId)}>
          {KEEP_WORK_COPY.dismiss}
        </button>
      </div>
    </aside>
  );
}
