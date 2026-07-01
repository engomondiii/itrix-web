import { routes } from '@/constants/routes';
import { CTA } from '@/lib/content/ctaCopy';
import { PORTAL_NAV } from '@/config/portal.config';
import type { PortalNavItem } from '@/config/portal.config';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

/**
 * Primary nav — "pulled, not pushed" (Playbook §07). The public site does not push
 * product/pricing; visitors pull detail through pages and drawers. A single primary
 * action ("Begin Compute Review") lives beside the nav. "Use Cases" is added.
 *
 * NOTE: The portal navigation is intentionally NOT part of this public nav. It lives
 * in the (portal) route group only (see portalNav below / PortalSidebar). No portal
 * links and no "Sign in" appear on the public header (Playbook §06).
 */
export const primaryNav: NavItem[] = [
  {
    label: 'Products',
    href: routes.alphaCompute,
    children: [
      { label: 'ALPHA Compute', href: routes.alphaCompute },
      { label: 'ALPHA Core', href: routes.alphaCore },
    ],
  },
  {
    label: 'Technology',
    href: routes.technology,
    children: [
      { label: 'Overview', href: routes.technology },
      { label: 'AXIOM', href: routes.axiom },
      { label: 'CRE', href: routes.cre },
      { label: 'FQNM', href: routes.fqnm },
    ],
  },
  { label: 'Use Cases', href: '/use-cases' },
  {
    label: 'Licensing',
    href: routes.licensing,
    children: [
      { label: 'Overview', href: routes.licensing },
      { label: 'Non-exclusive', href: routes.licensingNonExclusive },
      { label: 'Exclusive', href: routes.licensingExclusive },
    ],
  },
  { label: 'Resources', href: routes.resources },
  { label: 'About', href: routes.about },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
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
      { label: 'AXIOM', href: routes.axiom },
      { label: 'CRE', href: routes.cre },
      { label: 'FQNM', href: routes.fqnm },
    ],
  },
  {
    title: 'Licensing',
    items: [
      { label: 'Non-exclusive', href: routes.licensingNonExclusive },
      { label: 'Exclusive', href: routes.licensingExclusive },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'Use Cases', href: '/use-cases' },
      { label: 'About', href: routes.about },
      { label: 'Resources', href: routes.resources },
      { label: 'FQNM paper', href: routes.fqnmPaper },
    ],
  },
];

/** The single primary CTA (Playbook §08 vocabulary). */
export const primaryCta = { label: CTA.beginReview.label, href: CTA.beginReview.href };

/** Portal-internal navigation (used only inside the (portal) route group). */
export const portalNav: PortalNavItem[] = PORTAL_NAV;
