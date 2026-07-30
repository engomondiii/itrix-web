/**
 * THE AUTHENTICATION ZONE — every string, in one place.
 *
 * Source: Playbook v1.8 Part XVIII. Architecture v2.8 §26.
 *
 * ── THREE OF THESE STRINGS ARE SECURITY CONTROLS ────────────────────────────
 *
 * They are marked below. Each one is a place where a more helpful message would be an
 * enumeration oracle — a way for anyone to test whether an address, or an invitation
 * code, belongs to a real account.
 *
 *   AUTH_COPY.signIn.failure        one message for a wrong password AND an unknown
 *                                   address
 *   AUTH_COPY.forgot.confirmation   the same sentence whether or not the address has
 *                                   a workspace, and written to be TRUE either way
 *   AUTH_COPY.signUp.codeFailure    one message for unknown, used and expired codes
 *
 * Softening any of the three into something friendlier publishes a customer list.
 * They read slightly less helpful than they could, and that is the trade.
 *
 * REWORDING ANY OF THEM NEEDS SECURITY SIGN-OFF, not just copy review
 * (Playbook v1.8 §00.1).
 */

import { PASSWORD_MIN_LENGTH } from '@/lib/validation/password';

/** Shared across all four routes. */
export const AUTH_COPY = {
  shared: {
    errorSummaryHeading: 'Please check the following',
    /** Rate limiting surfaces as a stated wait, never a silent failure (R55). */
    rateLimited: (minutes: number) =>
      `Too many attempts. Please try again in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`,
    serviceFailure: 'We could not complete that just now. Please try again in a moment.',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    capsLock: 'Caps Lock is on.',
  },

  signIn: {
    title: 'Sign in to your workspace',
    standfirst: 'Your conversation, your documents and your team are where you left them.',
    emailLabel: 'Work email',
    passwordLabel: 'Password',
    submit: 'Sign in',
    submitting: 'Signing you in…',

    /**
     * SECURITY CONTROL. One message for a wrong password and for an address we have
     * never seen. Do not soften it to "we don't recognise that email", and do not add
     * "if you have an account with us" — either turns this field into a way to test
     * whether a company is our customer.
     */
    failure: 'Those details did not match. Please check your email and password.',

    forgot: 'Forgot your password?',
    noAccountPrefix: "Don't have an account yet?",
    noAccountLink: 'Sign up',
  },

  signUp: {
    title: 'Open your itriX workspace',
    standfirst: 'If you have an invitation, you can open your workspace now.',

    /* Door 1 — the case the missing link was actually blocking. */
    doorOneLabel: 'I have an invitation',
    codeLabel: 'Invitation code',
    codeHint: 'It is in the email we sent you, and it looks like a long string of letters and numbers.',
    codeSubmit: 'Continue',
    codeChecking: 'Checking…',

    /**
     * SECURITY CONTROL. Unknown, already used and expired all get this one message.
     * Naming which it was would let anyone test codes and learn which exist. The
     * second sentence is useful without being diagnostic.
     */
    codeFailure:
      'That invitation code is not usable. If it was sent a while ago it may have expired — reply to the email and we will send a new one.',

    /* Door 2 — deliberately NOT a form. */
    doorTwoLabel: "I don't have one yet",
    doorTwoBody:
      'A workspace opens after a short conversation. Tell us what you would like computation to do better, and if there is something for us to work on together, we will set one up for you.',
    doorTwoAction: 'Start the conversation',

    haveAccountPrefix: 'Already have an account?',
    haveAccountLink: 'Sign in',

    /* Open registration. Off by default — Architecture v2.8 §00.2. */
    openTitle: 'Create your workspace',
    openSubmit: 'Create workspace',
    openSubmitting: 'Creating your workspace…',
    nameLabel: 'Full name',
    organizationLabel: 'Company / organization',
    roleLabel: 'Role (optional)',
    emailLabel: 'Work email',
  },

  forgot: {
    title: 'Reset your password',
    standfirst: 'Enter the email you use for your workspace and we will send you a link.',
    emailLabel: 'Work email',
    submit: 'Send the reset link',
    submitting: 'Sending…',

    /**
     * SECURITY CONTROL, and the most important sentence in the zone.
     *
     * Shown whether or not the address has a workspace, and written to be TRUE either
     * way. "If that address has an itriX workspace" does the work: honest, confirms
     * nothing, and does not read as evasive.
     *
     * Do NOT change it to "We've sent you a link" — that confirms the account exists.
     * Do NOT add a "we couldn't find that address" state; that is the whole hole in
     * one sentence. Do NOT shorten "can be used once" — a link that stops working
     * without warning reads as a broken product rather than a security feature.
     */
    confirmation:
      'If that address has an itriX workspace, a reset link is on its way. It is good for the next hour and can be used once.',
    confirmationFollowOn: 'Nothing arrived? Check the spam folder, or ask your itriX contact.',

    back: 'Back to sign in',
  },

  reset: {
    title: 'Choose a new password',
    standfirst: 'Almost done. Pick something long — length matters far more than symbols.',
    passwordLabel: 'New password',
    confirmLabel: 'Confirm new password',
    submit: 'Save and sign in',
    submitting: 'Saving…',

    /* Shown ALWAYS, not only after a failure. */
    rules: `At least ${PASSWORD_MIN_LENGTH} characters. No required symbols or capitals. Paste from a password manager if you use one.`,
    mismatch: 'Those two do not match.',
    tooShort: `Use at least ${PASSWORD_MIN_LENGTH} characters.`,

    /** Names the session invalidation on purpose: silent sign-out looks like a fault. */
    success: 'Your password is changed, and you have been signed out everywhere else.',
    expired:
      'That link is no longer usable. Reset links are good for an hour and can be used once — request a new one and we will send it straight away.',
    requestAgain: 'Send me a new link',
    back: 'Back to sign in',
  },

  setPassword: {
    title: 'Set your password',
    standfirst: 'One more step and your workspace is ready.',
  },

  /** Strength meter labels. No time-to-crack figure, ever. */
  strength: {
    short: 'Too short',
    fair: 'Fair',
    good: 'Good',
    strong: 'Strong',
    label: 'Password strength',
  },
} as const;
