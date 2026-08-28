'use client';

import { useCenterCopy } from '@/lib/i18n/conversationLocale';

import Link from 'next/link';
import { routes } from '@/constants/routes';

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
 * `Sign up`, beside it. R32 is amended to permit exactly these two plus the four legal
 * instruments, and nothing else.
 *
 * ── v8.0 GIVES IT EQUAL WEIGHT, AND NOT FIRST PLACE ─────────────────────────
 * In v7.0 it was deliberately quieter, because it led to a page that mostly explained why
 * there was no form. It now leads to a real front door, so it carries the same weight as
 * the second of two links (Playbook v1.9 §12) — handled in `surface-v6.css`.
 *
 * Sign in STAYS FIRST and stays primary: most people arriving at the top right of this
 * screen already have an account. Opening registration does not change who is standing
 * here.
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
  const centerCopy = useCenterCopy();
  if (variant === 'rail') {
    return (
      <Link href={routes.portalSignIn} className="sign-in-link" data-variant={variant}>
        {centerCopy.signIn}
      </Link>
    );
  }

  return (
    <span className="sign-in-group">
      <Link href={routes.portalSignIn} className="sign-in-link" data-variant={variant}>
        {centerCopy.signIn}
      </Link>
      <Link href={routes.portalSignUp} className="sign-up-link">
        {centerCopy.signUp}
      </Link>
    </span>
  );
}
