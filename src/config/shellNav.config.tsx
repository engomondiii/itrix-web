import { routes } from '@/constants/routes';

/**
 * What is left of the navigation configuration.
 *
 * ── v6.0 EMPTIED THE NAVIGATION ─────────────────────────────────────────────
 *
 * REMOVED: `SIDEBAR_BRAND_NAV` — the Approach · Technology · Resources trio. The
 * change request removed the links from the top of the arrival screen and removed
 * `Approach` from the rail by name; v6.0 retires all three AS NAVIGATION ITEMS on
 * every surface (Architecture v2.7 §11.6). Their ROUTES remain live and in the
 * sitemap: /about, /technology and /resources are untouched pages, reachable by
 * search and by direct link, and Phase 2 reaches them from the content pane's
 * Explore section.
 *
 * REMOVED: `SIDEBAR_NDA_ACCESS` — the label became "Sign in" and now lives in
 * CENTER_COPY.signIn, beside the rest of the arrival copy, because it is one control
 * with one string rather than a navigation item.
 *
 * WHAT SURVIVES is the Explore route list, which PHASE 2 mounts in the content
 * pane's `explore` section, and the disclosure drawer id. Both are kept rather than
 * deleted because Phase 2 consumes them unchanged — deleting them now and rewriting
 * them in a fortnight would be churn, not tidiness.
 *
 * Nothing here is an entitlement. Every item is a public route; the sections that
 * carry relationship content are authorized by the backend.
 */

export interface ShellNavItem {
  label: string;
  href: string;
}

export interface ShellNavGroup {
  title: string;
  items: ShellNavItem[];
}

/**
 * The Explore group — everything that used to be below the landing fold, and then
 * in the sidebar, and from Phase 2 in the content pane.
 *
 * The drawers themselves are rendered from INFO_DRAWERS; this list is the ROUTE half
 * of the group. Both are closed by default and pulled, never pushed — R5 is
 * preserved, and only the entry point has moved (again).
 */
export const SIDEBAR_EXPLORE: ShellNavGroup[] = [
  {
    title: 'Products',
    items: [
      { label: 'ALPHA Compute', href: routes.alphaCompute },
      { label: 'ALPHA Core', href: routes.alphaCore },
    ],
  },
  {
    title: 'Technology',
    items: [
      { label: 'Overview', href: routes.technology },
      { label: 'AXIOM', href: routes.axiom },
      { label: 'CRE', href: routes.cre },
      { label: 'FQNM', href: routes.fqnm },
    ],
  },
  {
    title: 'Licensing',
    items: [
      { label: 'Overview', href: routes.licensing },
      { label: 'Non-exclusive', href: routes.licensingNonExclusive },
      { label: 'Exclusive', href: routes.licensingExclusive },
    ],
  },
  /* THE "More" GROUP IS REMOVED (change request, 2026-08).
     It was the pop-out menu inside Explore, and it is the last place the label
     appeared anywhere in the interface. The four routes it linked - /use-cases,
     the visitor rooms, /about and /resources - are all still live, still
     rendered by their own pages and still in the sitemap; only this menu entry
     is gone. Restoring it means restoring this one array element. */
];

/**
 * The legal instruments, as routes.
 *
 * THE v5.0 RELEASE BLOCKER IS CLEARED. /privacy and /security did not exist, so the
 * sidebar footer carried `null` hrefs and warned in development rather than shipping
 * two 404s. Phase 1 creates all four routes, so all four have real hrefs — and the
 * canonical list now lives in lib/content/legalCopy.ts, beside the documents
 * themselves. This export is kept as a route-only view of it for Phase 2's content
 * pane, which needs hrefs without pulling in the body copy.
 */
export const SIDEBAR_LEGAL: ShellNavItem[] = [
  { label: 'Terms', href: routes.terms },
  { label: 'Privacy', href: routes.privacy },
  { label: 'Security', href: routes.security },
  { label: 'Disclosure policy', href: routes.disclosurePolicy },
];

/** The drawer id for the approved before-an-NDA content, used inside Explore. */
export const DISCLOSURE_DRAWER_ID = 'before-an-nda';
