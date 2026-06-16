import { routes } from '@/constants/routes';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

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
      { label: 'About', href: routes.about },
      { label: 'Resources', href: routes.resources },
      { label: 'FQNM paper', href: routes.fqnmPaper },
    ],
  },
];

export const primaryCta = { label: 'Begin a review', href: routes.review };
