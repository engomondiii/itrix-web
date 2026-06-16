'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  exact?: boolean;
  onClick?: () => void;
}

/** Nav link with the Atelier Indigo gold active indicator. */
export function NavLink({ href, children, className, exact, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative inline-flex items-center text-secondary font-medium transition-colors',
        active ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900',
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          'absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-pill bg-gold-500 transition-transform duration-base',
          active ? 'scale-x-100' : 'scale-x-0',
        )}
      />
    </Link>
  );
}
