'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';

/** A single portal sidebar link with active-state styling. */
export function PortalNavLink({ href, label, badge }: { href: string; label: string; badge?: number }) {
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
      <span>{label}</span>
      {badge && badge > 0 ? (
        <span className="inline-flex min-w-5 items-center justify-center rounded-pill bg-ink-primary px-1.5 text-micro font-semibold text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
