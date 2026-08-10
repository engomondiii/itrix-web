'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/** A single portal sidebar link with active-state styling and its glyph. */
export function PortalNavLink({
  href,
  label,
  badge,
  icon,
}: {
  href: string;
  label: string;
  badge?: number;
  /** The 18px house glyph rendered before the label (2026-08-10). */
  icon?: ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center justify-between gap-2 rounded-md px-3 py-2 text-body transition-colors',
        active ? 'bg-soft text-ink-primary font-medium' : 'text-ink-secondary hover:bg-surface hover:text-ink-primary',
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      {badge && badge > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-pill bg-ink-primary px-1.5 text-micro font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
