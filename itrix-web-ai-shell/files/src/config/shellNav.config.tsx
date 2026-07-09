import type { ReactNode } from 'react';
import { routes } from '@/constants/routes';
import {
  IconCube,
  IconGrid,
  IconLayers,
  IconKey,
  IconDoc,
  IconInfo,
} from '@/components/shell/ShellIcons';

/**
 * Shell navigation model (Surface 1 v3.1).
 *
 * The AI-app shell relocates the former top-header navigation into the left rail.
 * This is an icon-aware projection of the canonical `primaryNav` — same routes and
 * labels, plus a rail icon and optional children shown as an inline sub-list when
 * the rail is expanded. It intentionally lives beside (not inside) navigation.config
 * so the header/footer keep their existing model untouched.
 *
 * "Pulled, not pushed" (Playbook §07) still holds: these are quiet links a visitor
 * chooses to open — nothing is auto-expanded, and the composer remains the default
 * focus of the canvas.
 */
export interface ShellNavChild {
  label: string;
  href: string;
}

export interface ShellNavItem {
  label: string;
  href: string;
  icon: ReactNode;
  children?: ShellNavChild[];
}

const ICON_SIZE = 18;

export const shellNav: ShellNavItem[] = [
  {
    label: 'Products',
    href: routes.alphaCompute,
    icon: <IconCube size={ICON_SIZE} />,
    children: [
      { label: 'ALPHA Compute', href: routes.alphaCompute },
      { label: 'ALPHA Core', href: routes.alphaCore },
    ],
  },
  {
    label: 'Technology',
    href: routes.technology,
    icon: <IconGrid size={ICON_SIZE} />,
    children: [
      { label: 'Overview', href: routes.technology },
      { label: 'AXIOM', href: routes.axiom },
      { label: 'CRE', href: routes.cre },
      { label: 'FQNM', href: routes.fqnm },
    ],
  },
  {
    label: 'Use Cases',
    href: '/use-cases',
    icon: <IconLayers size={ICON_SIZE} />,
  },
  {
    label: 'Licensing',
    href: routes.licensing,
    icon: <IconKey size={ICON_SIZE} />,
    children: [
      { label: 'Overview', href: routes.licensing },
      { label: 'Non-exclusive', href: routes.licensingNonExclusive },
      { label: 'Exclusive', href: routes.licensingExclusive },
    ],
  },
  {
    label: 'Resources',
    href: routes.resources,
    icon: <IconDoc size={ICON_SIZE} />,
  },
  {
    label: 'About',
    href: routes.about,
    icon: <IconInfo size={ICON_SIZE} />,
  },
];
