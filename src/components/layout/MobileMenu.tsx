'use client';

import Link from 'next/link';
import { useUiStore } from '@/store/uiStore';
import { primaryNav, primaryCta } from '@/config/navigation.config';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';

export function MobileMenu() {
  const open = useUiStore((s) => s.mobileMenuOpen);
  const close = useUiStore((s) => s.closeMobileMenu);

  return (
    <div
      id="mobile-menu"
      className={cn('md:hidden overflow-hidden border-b border-border-medium bg-surface transition-[max-height] duration-base ease-out', open ? 'max-h-[80vh]' : 'max-h-0')}
      aria-hidden={!open}
    >
      <nav className="container-page flex flex-col gap-1 py-4">
        {primaryNav.map((item) => (
          <div key={item.label} className="py-1">
            <Link href={item.href} onClick={close} className="block py-2 text-body font-medium text-ink-primary">
              {item.label}
            </Link>
            {item.children ? (
              <div className="ml-3 flex flex-col border-l border-border-medium pl-3">
                {item.children.map((child) => (
                  <Link key={child.href} href={child.href} onClick={close} className="py-1.5 text-secondary text-ink-secondary hover:text-ink-primary">
                    {child.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
        <Link href={primaryCta.href} onClick={close} className="mt-3">
          <Button variant="primary" fullWidth>
            {primaryCta.label}
          </Button>
        </Link>
      </nav>
    </div>
  );
}
