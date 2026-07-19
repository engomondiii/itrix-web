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
  onIndigo?: boolean;
}

/** Nav link with the Atelier Indigo gold active indicator. */
export function NavLink({ href, children, className, exact, onClick, onIndigo }: NavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative inline-flex items-center text-secondary font-medium transition-colors',
        onIndigo
          ? active
            ? 'text-ink-inverse'
            : 'text-ink-inverse/80 hover:text-ink-inverse'
          : active
            ? 'text-ink-primary'
            : 'text-ink-secondary hover:text-ink-primary',
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className={cn(
          'absolute -bottom-1.5 left-0 h-0.5 w-full origin-left rounded-pill bg-accent transition-transform duration-base',
          active ? 'scale-x-100' : 'scale-x-0',
        )}
      />
    </Link>
  );
}