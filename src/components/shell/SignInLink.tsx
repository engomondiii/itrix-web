'use client';

import Link from 'next/link';
import { routes } from '@/constants/routes';
import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * Sign in — the only control in the top right of the arrival screen.
 *
 * v6.0 REPLACES "NDA access" everywhere it appeared (Playbook v1.7 §00 change 3).
 * The old label described a gate; this one describes what the visitor actually
 * wants to do. The padlock glyph goes with it: it read as a barrier on the one
 * screen where nothing should feel like one.
 *
 * It is a SECONDARY control. The primary action on this screen is the composer,
 * and nothing here is allowed to compete with it.
 *
 * ── v7.0 PHASE 4 ADDS A SECOND LINK ─────────────────────────────────────────
 * `Sign up`, beside it and quieter. R32 is amended to permit exactly these two plus the
 * four legal instruments, and nothing else.
 *
 * TWO LINKS, NOT A MENU. A dropdown on the front door would be chrome on the one screen
 * that is supposed to have none — and it would hide the second option behind an
 * interaction, which is the problem this change exists to fix.
 *
 * In the RAIL variant only `Sign in` renders. Someone with a thread in progress who is
 * not signed in is either mid-review or holds an invitation, and both of those reach
 * sign-up from the sign-in page. A second link in a 240px rail earns less than the space.
 */
export function SignInLink({ variant = 'arrival' }: { variant?: 'arrival' | 'rail' }) {
  if (variant === 'rail') {
    return (
      <Link href={routes.portalSignIn} className="sign-in-link" data-variant={variant}>
        {CENTER_COPY.signIn}
      </Link>
    );
  }

  return (
    <span className="sign-in-group">
      <Link href={routes.portalSignIn} className="sign-in-link" data-variant={variant}>
        {CENTER_COPY.signIn}
      </Link>
      <Link href={routes.portalSignUp} className="sign-up-link">
        {CENTER_COPY.signUp}
      </Link>
    </span>
  );
}
