'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';

/**
 * Decides whether a route gets the global marketing chrome (Header + Footer +
 * the shared #content main) or renders bare. Funnel segments such as the
 * Compute Bottleneck Review provide their own focused chrome via ReviewLayout,
 * so they must NOT also receive the global Header/Footer — otherwise the two
 * stack and the header looks duplicated.
 *
 * Add any future self-chromed segment (e.g. a fullscreen flow) to the list.
 */
const CHROMELESS_PREFIXES = ['/review'];

function isChromeless(pathname: string): boolean {
  return CHROMELESS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Self-chromed segment (ReviewLayout owns the header + main here): render bare.
  if (isChromeless(pathname)) return <>{children}</>;

  return (
    <>
      {/* Skip link for keyboard users (quality floor). */}
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-indigo-950 focus:px-4 focus:py-2 focus:text-oni"
      >
        Skip to content
      </a>
      <Header />
      <main id="content" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
    </>
  );
}