'use client';

import Link from 'next/link';
import { AuthPanel } from '@/components/auth/AuthPanel';
import { AuthHeading } from '@/components/auth/AuthHeading';
import { AuthFooterLinks } from '@/components/auth/AuthFooterLinks';
import { RegistrationForm } from '@/components/auth/RegistrationForm';
import { InviteCodeDisclosure } from '@/components/auth/InviteCodeDisclosure';
import { useAuthCopy } from '@/lib/i18n/authLocale';
import { siteConfig } from '@/config/site.config';
import { routes } from '@/constants/routes';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * SIGN UP — a real registration form, open to anyone (Architecture v2.9 §27, R60).
 *
 * ── THE PAGE INVERTED ───────────────────────────────────────────────────────
 * v7.0 had two "doors": an invitation code, and a section explaining that there was no
 * form because accounts were earned. Both are withdrawn. The form IS the page, and the
 * code is a collapsed second option beneath it.
 *
 * What makes that safe is not this file. It is that reach was never a function of having
 * an account: `disclosure_ceiling_for()` takes the more restrictive of the plane cap and
 * the state ceiling, and State 1 is `public`. A person who registers on arrival and says
 * nothing reaches exactly what an anonymous visitor reaches (R59), and the backend has a
 * test that compares the two at every state so it stays that way.
 *
 * ── THE KILL SWITCH, AND WHY ITS OFF STATE IS STILL HERE ────────────────────
 * `ENABLE_OPEN_SIGNUP` now DEFAULTS ON and is a kill switch rather than a product gate
 * (Architecture v2.9 §22.1). With it thrown, this page renders the invitation path plus
 * v7.0's copy about a workspace opening after a short conversation, and links to the
 * arrival composer.
 *
 * That rendering is retained deliberately: a switch whose off state has been deleted from
 * the tree is not a switch, and nobody will dare throw it during an incident (§27.10).
 *
 * ── NO GREETING, EVER ───────────────────────────────────────────────────────
 * Nothing on this page or anywhere else in the zone recognises a returning address (R57).
 * A "welcome back" that appears once an email is typed is a live enumeration oracle with
 * a friendly face.
 */
export default function SignUpPage() {
  const authCopy = useAuthCopy();
  const openSignup = siteConfig.featureFlags.openSignup;
  const codeDoorEnabled = siteConfig.featureFlags.signupInviteCode;

  return (
    <AuthPanel>
      <AuthHeading
        title={authCopy.signUp.title}
        standfirst={openSignup ? authCopy.signUp.standfirst : undefined}
      />

      {openSignup ? <RegistrationForm /> : null}

      {openSignup && codeDoorEnabled ? <div className="auth-divider" role="separator" /> : null}

      {codeDoorEnabled ? <InviteCodeDisclosure /> : null}

      {/* The kill-switch rendering. Not a form: it says what is true when registration is
          closed, and takes the visitor to the one place a conversation starts. */}
      {!openSignup ? <ClosedRegistrationNotice /> : null}

      <AuthFooterLinks
        links={[
          {
            prefix: authCopy.signUp.haveAccountPrefix,
            label: authCopy.signUp.haveAccountLink,
            href: routes.portalSignIn,
          },
        ]}
      />
    </AuthPanel>
  );
}

/**
 * Rendered only when `ENABLE_OPEN_SIGNUP` is off (Architecture v2.9 §27.10).
 *
 * It collects nothing and promises nothing it cannot keep. The link goes to the arrival
 * composer, which is where a workspace actually starts when registration is closed.
 */
function ClosedRegistrationNotice() {
  const authCopy = useAuthCopy();
  return (
    <section className="auth-door" aria-labelledby="signup-closed">
      <h2 id="signup-closed" className="auth-door__label">
        {authCopy.signUp.closedLabel}
      </h2>
      <p className="auth-door__body">{authCopy.signUp.closedBody}</p>
      <Link
        href={routes.home}
        className="auth-door__action"
        onClick={() => trackEvent('auth.signup_door_chosen', { door: 'conversation' })}
      >
        {authCopy.signUp.closedAction}
      </Link>
    </section>
  );
}
