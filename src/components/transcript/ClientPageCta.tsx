'use client';

import Link from 'next/link';
import { routes } from '@/constants/routes';

/**
 * THE "OPEN YOUR PAGE" BUTTON, BENEATH THE LINK THAT CARRIES IT.
 *
 * ── WHY THIS IS DERIVED FROM THE MESSAGE AND NOT FROM STATE ─────────────────
 * There is already a "View your page" button in the conversation column, driven by
 * `useClientPageReveal`. It holds the token in `useState(null)` and fills it only
 * when a live `journey.reveal` socket frame arrives — so it shows nothing after a
 * reload, nothing in a second tab, and nothing at all if that one frame was missed.
 * The visitor in the reported case had a valid link in their transcript and no
 * button anywhere on screen.
 *
 * This reads the token out of the TURN BODY instead. The message is persisted, so
 * the button survives reloads, works in any tab, and needs no socket at all. The
 * two are complementary: that one appears the moment the page is ready, this one
 * stays for as long as the conversation does.
 *
 * ── AND IT SIDESTEPS THE PUNCTUATION TRAP ENTIRELY ──────────────────────────
 * A capability token is `<payload>.<signature>`, so it contains a period. Every
 * failure here came from a human or a heuristic guessing where the URL ended. A
 * button carries the token as data — nothing to select, nothing to mis-select.
 */

/* Matches a client-page URL, absolute or relative. Stops at whitespace, a closing
   angle bracket, or a quote — and deliberately NOT at a period, because the token
   contains one. Sentence punctuation is trimmed afterwards, where the rule can be
   stated once and read. */
const CLIENT_PAGE_URL = /(?:https?:\/\/[^\s<>"']+)?\/c\/([^\s<>"']+)/i;

const TRAILING = /[.,;:!?)\]}'"\u201d\u2019]+$/;

/** The client-page token carried by this text, or null. */
export function clientPageTokenIn(body: string): string | null {
  const match = CLIENT_PAGE_URL.exec(body || '');
  if (!match) return null;
  const token = (match[1] || '').replace(TRAILING, '');
  /* A token is `<payload>.<signature>`. Without both halves this is some other
     `/c/` path and not a reveal. */
  return token.includes('.') ? token : null;
}

export function ClientPageCta({ body }: { body: string }) {
  const token = clientPageTokenIn(body);
  if (!token) return null;

  return (
    <div className="turn__cta">
      <Link href={routes.clientPage(token)} className="turn__cta-button" prefetch={false}>
        Open your personalised page
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </Link>
    </div>
  );
}
