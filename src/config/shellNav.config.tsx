import { routes } from '@/constants/routes';

/**
 * Sidebar navigation configuration.
 *
 * The global header is retired in v5.0. Its contents — brand, navigation and NDA
 * access — moved to the TOP OF THE SIDEBAR, above the conversation list
 * (Surface 1 v5.0 §00.1 change 8, Playbook v1.6 §16A). The marketing routes and
 * the closed-by-default drawers that used to live below the landing fold moved
 * into the Explore group (§16B). The legal links moved to the sidebar footer
 * (§16D).
 *
 * Nothing here is an entitlement. Every item is a public route; the sidebar
 * sections that carry relationship content are authorized by the backend and
 * resolved through lib/journey/sidebarSections.ts.
 */

export interface ShellNavItem {
  label: string;
  /**
   * `null` means the route does not exist in this build yet. The renderer skips
   * the item and warns in development rather than shipping a dead link.
   */
  href: string | null;
}

export interface ShellNavGroup {
  title: string;
  items: ShellNavItem[];
}

/**
 * The condensed nav at the top of the sidebar.
 *
 * NOTE — "Approach" has no dedicated route in this repo. Playbook §16A names it,
 * and /about is the page that currently carries that content, so it points there
 * rather than at a 404. If a real /approach page is added, change it here.
 */
export const SIDEBAR_BRAND_NAV: ShellNavItem[] = [
  { label: 'Approach', href: routes.about },
  { label: 'Technology', href: routes.technology },
  { label: 'Resources', href: routes.resources },
];

/** NDA access — quiet and gated. Never a primary CTA (Surface 1 v5.0 §2.4). */
export const SIDEBAR_NDA_ACCESS: ShellNavItem = {
  label: 'Sign in',
  href: routes.portalSignIn,
};

/**
 * The Explore group — everything that used to be below the landing fold.
 *
 * The drawers themselves are rendered by ExploreGroup from INFO_DRAWERS; this
 * list is the ROUTE half of the group. Both are closed by default and pulled,
 * never pushed (R5 is preserved — only the entry point moved).
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
  {
    title: 'More',
    items: [
      { label: 'Use cases', href: '/use-cases' },
      { label: 'Visitor rooms', href: routes.rooms },
      { label: 'About itriX', href: routes.about },
      { label: 'Resources', href: routes.resources },
    ],
  },
];

/**
 * The legal footer (Playbook v1.6 §16D).
 *
 * RELEASE BLOCKER, stated here so it cannot be forgotten: /privacy and /security
 * DO NOT EXIST in this repo. The Playbook requires all three links, and they are
 * "not permitted to disappear". Rather than ship two 404s, they are `null` here
 * and the renderer skips them with a development warning.
 *
 * Create the two routes, set the hrefs, and the footer completes itself.
 * "Disclosure policy" already has real content and opens the approved
 * before-an-NDA drawer instead of a route.
 */
export const SIDEBAR_LEGAL: ShellNavItem[] = [
  { label: 'Privacy', href: null },
  { label: 'Security', href: null },
];

/** The drawer id opened by the "Disclosure policy" control in the legal footer. */
export const DISCLOSURE_DRAWER_ID = 'before-an-nda';
