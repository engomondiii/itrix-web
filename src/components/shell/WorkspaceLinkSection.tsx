'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { trackEvent } from '@/lib/analytics/trackEvent';

/**
 * One workspace or State 10 sidebar entry.
 *
 * It is a LINK TO A DEEP-LINK VIEW, not a place the work lives. The work is in
 * the thread; these routes are alternatives for print, sharing and direct
 * access, and each one carries a way back (Architecture v2.6 §2.5).
 *
 * The label and description come from the closed vocabulary in
 * sidebarRegistry.ts — never from the backend payload, which carries section
 * KEYS only. A section that could render arbitrary server-supplied text in the
 * sidebar would be a way to put words in front of a visitor without governance.
 */
export interface WorkspaceLinkSectionProps {
  sectionKey?: string;
  label: string;
  description: string;
  href: string;
}

export function WorkspaceLinkSection({
  sectionKey, label, description, href,
}: WorkspaceLinkSectionProps) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className="sidebar-workspace-link"
      aria-current={active ? 'page' : undefined}
      onClick={() => trackEvent('sidebar.section_opened', { section: sectionKey ?? label })}
    >
      <span className="sidebar-workspace-link__label">{label}</span>
      <span className="sidebar-workspace-link__desc">{description}</span>
    </Link>
  );
}
