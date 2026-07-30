'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * The links out of a route.
 *
 * ── R47: NO ROUTE IN THE ZONE IS A DEAD END ─────────────────────────────────
 * That is the requirement this component exists to make hard to break. The v3.1
 * sign-in page had a forgot-password link and a "Need access?" link into the review
 * flow, but nothing for the person who has an invitation and no account yet — which is
 * exactly who arrives at a sign-in page they cannot use.
 *
 * A dead end is a screen a person can reach and not leave. Every route in the zone
 * renders one of these, and the acceptance test asserts it.
 */
export interface AuthFooterLink {
  /** Optional lead-in, rendered as plain text before the link. */
  prefix?: string;
  label: string;
  href: string;
}

export function AuthFooterLinks({ links, children }: { links: AuthFooterLink[]; children?: ReactNode }) {
  return (
    <footer className="auth-footer">
      {links.map((link) => (
        <p key={`${link.href}-${link.label}`} className="auth-footer__row">
          {link.prefix ? <span className="auth-footer__prefix">{link.prefix} </span> : null}
          <Link href={link.href} className="auth-footer__link">
            {link.label}
          </Link>
        </p>
      ))}
      {children}
    </footer>
  );
}
