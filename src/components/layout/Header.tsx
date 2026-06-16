'use client';

import Link from 'next/link';
import { useUiStore } from '@/store/uiStore';
import { primaryNav, primaryCta } from '@/config/navigation.config';
import { routes } from '@/constants/routes';
import { brand } from '@/constants/brand';
import { NavLink } from './NavLink';
import { MobileMenu } from './MobileMenu';
import { Button } from '@/components/ui/Button';

export function Header() {
  const toggleMenu = useUiStore((s) => s.toggleMobileMenu);
  const menuOpen = useUiStore((s) => s.mobileMenuOpen);

  return (
    <header data-surface="indigo" className="on-indigo sticky top-0 z-40 border-b border-white/10 bg-indigo-950 text-oni">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href={routes.home} className="text-lg font-bold tracking-tight text-oni" aria-label={`${brand.name} home`}>
          iTri<span className="text-gold-400">X</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {primaryNav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <NavLink href={item.href} onIndigo>{item.label}</NavLink>
                <div className="invisible absolute left-1/2 top-full z-50 min-w-[200px] -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-base group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="rounded-md border border-line bg-surface p-2 shadow-2">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href} className="block rounded-sm px-3 py-2 text-secondary text-ink-700 transition-colors hover:bg-surface-warm hover:text-ink-900">
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <NavLink key={item.label} href={item.href} onIndigo>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link href={primaryCta.href} className="hidden md:inline-flex">
            <Button variant="primary" size="sm">
              {primaryCta.label}
            </Button>
          </Link>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm text-oni transition-colors hover:bg-white/10 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire-300"
          >
            <span aria-hidden className="text-xl leading-none">{menuOpen ? '×' : '≡'}</span>
          </button>
        </div>
      </div>
      <MobileMenu />
    </header>
  );
}