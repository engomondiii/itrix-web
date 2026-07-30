'use client';

import { ClientAuthForm } from '@/components/portal/ClientAuthForm';

/**
 * Sign in to your workspace.
 *
 * ── NO `useSearchParams`, AND THAT IS A DELIBERATE STRUCTURAL CHOICE ─────────
 * The v3.1 page read `?next=` with `useSearchParams`, which forces the component into a
 * Suspense boundary — and because the fallback was `null`, the STATIC HTML for /sign-in
 * contained the shell and an empty space where the panel should be. No heading, no
 * fields, nothing until hydration.
 *
 * That is a flash of empty panel on the screen a paying customer sees every morning, and
 * it also means the route's `h1` does not exist in the server response.
 *
 * `next` is only needed at the moment the button is pressed, which is client-side by
 * definition — so `ClientAuthForm` reads it from `window.location` at submit time
 * instead. The whole panel now prerenders, and there is no Suspense boundary to get
 * wrong.
 *
 * The page stays thin: the form is `ClientAuthForm`, rebuilt in place rather than
 * replaced, which keeps ONE credential path instead of leaving an older form alive with
 * a weaker failure message in it.
 */
export default function SignInPage() {
  return <ClientAuthForm />;
}
