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
 */
export function SignInLink({ variant = 'arrival' }: { variant?: 'arrival' | 'rail' }) {
  return (
    <Link href={routes.portalSignIn} className="sign-in-link" data-variant={variant}>
      {CENTER_COPY.signIn}
    </Link>
  );
}
