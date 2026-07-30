/**
 * THE AUTHENTICATION ZONE — every string, in one place.
 *
 * Source: Playbook v1.9 Part XVIII. Architecture v2.9 §26–§27.
 *
 * ── FOUR OF THESE STRINGS ARE SECURITY CONTROLS ─────────────────────────────
 *
 * They are marked below. Each one is a place where a more helpful message would be an
 * enumeration oracle — a way for anyone to test whether an address, or an invitation
 * code, belongs to a real account.
 *
 *   AUTH_COPY.signIn.failure          one message for a wrong password AND an unknown
 *                                     address
 *   AUTH_COPY.forgot.confirmation     the same sentence whether or not the address has
 *                                     a workspace, and written to be TRUE either way
 *   AUTH_COPY.signUp.codeFailure      one message for unknown, used and expired codes
 *   AUTH_COPY.signUp.confirmation ★   the same sentence whether the address was free or
 *                                     already held by somebody else
 *
 * The fourth is new in v8.0 and it is the one most tempting to break, because a
 * registration form is exactly where a designer reaches for "That email is already
 * registered." That single field error publishes a customer list (Playbook v1.9 §00.2).
 *
 * Softening any of the four publishes a customer list. They read slightly less helpful
 * than they could, and that is the trade.
 *
 * REWORDING ANY OF THEM NEEDS SECURITY SIGN-OFF, not just copy review
 * (Playbook v1.9 §00.1).
 */

import { PASSWORD_MIN_LENGTH } from '@/lib/validation/password';

/** Shared across every route in the zone. */
export const AUTH_COPY = {
  shared: {
    errorSummaryHeading: 'Please check the following',

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
     * SECURITY CONTROL. One message for a wrong password and an address we have never
     * seen. Do not soften it into "we don't recognise that email", and do not add "if
     * you have an account with us" — either turns this field into a way to test whether
     * a company is our customer.
     *
     * AND THERE IS NO GREETING anywhere in the zone. A "welcome back" that appears once
     * the email is recognised is the same hole with a friendlier face.
     */
    failure: 'Those details did not match. Please check your email and password.',

    forgot: 'Forgot your password?',
    noAccountPrefix: "Don't have an account yet?",
    noAccountLink: 'Sign up',
  },

  signUp: {
    title: 'Open your itriX workspace',

    /**
     * v8.0 — REGISTRATION IS THE PAGE.
     *
     * v7.0's standfirst opened with "If you have an invitation", which told the 95% of
     * people arriving here without one that they were in the wrong place. Open
     * registration inverts the page, so the standfirst describes what an account IS: a
     * container for your work.
     *
     * "It is free" means one narrow thing — you do not have to qualify for a login. It
     * must never be allowed to imply that having an account shows you more of the
     * material, because it does not: reach is set by the conversation, not the account
     * (Architecture v2.9 R59, Playbook v1.9 §00.2).
     */
    standfirst:
      'It takes a minute, and it is free. A workspace keeps your conversations, your documents and your work in one place.',

    nameLabel: 'Full name',
    organizationLabel: 'Company or organization',
    roleLabel: 'Role (optional)',
    emailLabel: 'Work email',
    /**
     * Playbook v1.9 SS18C names these 'Password' and 'Confirm password'.
     *
     * They are NOT reused from `reset`, whose labels are 'New password' and 'Confirm new
     * password' - correct there, and wrong on a form where the person has never had one.
     * The POLICY strings (`reset.rules`, `mismatch`, `tooShort`) stay shared, because those
     * are the twelve-character contract and must exist in exactly one place (R52).
     */
    passwordLabel: 'Password',
    confirmLabel: 'Confirm password',
    submit: 'Create workspace',
    submitting: 'Opening your workspace…',

    missingName: 'Tell us who to address in the workspace.',
    missingOrganization: 'Add your company or organization.',
    missingEmail: 'Enter your work email.',

    /**
     * SECURITY CONTROL — the fourth one, and new in v8.0.
     *
     * Shown whether the address was free or already belongs to somebody, and written to
     * be TRUE either way. "If that address can have an itriX workspace" does the work.
     *
     * Do NOT add "That email is already registered" as a second state — that one field
     * error lets anyone with a browser test which companies are our customers. When the
     * address is already in use we email the person who OWNS it, not the person who
     * typed it (Architecture v2.9 §27.6).
     */
    confirmation:
      'Check your email. If that address can have an itriX workspace, a confirmation link is on its way. Your workspace is ready in the meantime.',

    /** Distinct from the shared failure: it states that nothing was created. */
    serviceFailure:
      'We could not open your workspace just now. Nothing has been created — please try again in a moment.',

    /* ── The second option: an invitation code, collapsed ──────────────────── */
    /** v8.0 — a disclosure trigger, not a section heading. */
    codeDisclosure: 'Have an invitation code?',
    codeLabel: 'Invitation code',
    codeHint: 'It is in the email we sent you, and it looks like a long string of letters and numbers.',
    codeSubmit: 'Continue',
    codeChecking: 'Checking…',

    /**
     * SECURITY CONTROL. Unknown, already used and expired all get this one message.
     * Naming which it was would let anyone test codes and learn which ones exist. The
     * second sentence is useful without being diagnostic.
     *
     * UNCHANGED from v7.0, deliberately — the code path is not what this phase changes.
     */
    codeFailure:
      'That invitation code is not usable. If it was sent a while ago it may have expired — reply to the email and we will send a new one.',

    haveAccountPrefix: 'Already have an account?',
    haveAccountLink: 'Sign in',

    /* ── The kill-switch rendering (ENABLE_OPEN_SIGNUP=false) ─────────────────
       Retained from v7.0 rather than deleted. A switch whose off state has been
       removed from the tree is not a switch (Architecture v2.9 §27.10). */
    closedLabel: "I don't have one yet",
    closedBody:
      'A workspace opens after a short conversation. Tell us what you would like computation to do better, and if there is something for us to work on together, we will set one up for you.',
    closedAction: 'Start the conversation',
  },

  verify: {
    title: 'Confirm your email address',
    standfirst: (email: string) =>
      `We sent a link to ${email}. Opening it confirms the address is yours.`,
    standfirstNoAddress: 'We sent you a link. Opening it confirms the address is yours.',

    /**
     * THE COMPLETE LIST of what confirmation gates (Architecture v2.9 R66). Do not add
     * "for full access" or "to see everything" — reach is set by the conversation, not
     * by the mailbox, and claiming otherwise would be false.
     */
    unlocks:
      'You can use your workspace right now. Confirming lets us send you documents, and it is required before we can put an NDA in place.',

    confirming: 'Confirming…',
    success: 'Your email address is confirmed.',
    expired:
      'That link is no longer usable. Confirmation links are good for 48 hours and can be used once — we can send you a new one.',

    resend: 'Send the link again',
    resending: 'Sending…',

    /** SECURITY CONTROL, same family as the others. One sentence, always. */
    resendConfirmation: 'If that address can have an itriX workspace, another link is on its way.',

    continueToWorkspace: 'Go to your workspace',
    back: 'Back to sign in',

    /* The banner inside the workspace. It must never read as a block. */
    bannerBody: 'Confirm your email address so we can send you documents.',
    bannerAction: 'Send the link again',
    bannerSent: 'A new link is on its way.',
  },

  forgot: {
    title: 'Reset your password',
    standfirst: 'Enter the email you use for your workspace and we will send you a link.',
    emailLabel: 'Work email',
    submit: 'Send the reset link',
    submitting: 'Sending…',

    /**
     * SECURITY CONTROL, and the sentence the sign-up confirmation is modelled on.
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

/**
 * The "keep this conversation" card (Playbook v1.9 §18H).
 *
 * It lives here rather than in `centerCopy` because it is part of the account story, and
 * because the constraint on it is the same kind of constraint the strings above carry:
 * it must contain NO commercial content. No next step, no offer, no pathway hint, no
 * mention of an assessment, a PoC or a licence. The moment a sentence about our services
 * appears here it becomes a commitment ask, and commitment asks are governed by
 * value-first and belong at State 5 (Architecture v2.9 §16.9 / Surface 1 v8.0 §16.9).
 */
export const KEEP_WORK_COPY = {
  title: 'Keep this conversation',
  body:
    'Right now this is saved in this browser only. Open a workspace and it moves with you — everything you have written, and everything we have sent back.',
  action: 'Open a workspace',
  dismiss: 'Not now',
} as const;
