import Link from 'next/link';
import { footerNav } from '@/config/navigation.config';
import { brand } from '@/constants/brand';
import { routes } from '@/constants/routes';

/**
 * Public footer (Playbook §07). A single calm one-line statement of what itriX does,
 * the pulled-not-pushed link set, and legal. No aggressive CTAs; the review is the
 * one action, offered contextually elsewhere.
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-surface="indigo" className="on-indigo mt-20 bg-indigo-950 text-oni">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-xs">
          <Link href={routes.home} className="text-lg font-bold tracking-tight">
            iTri<span className="text-gold-400">X</span>
          </Link>
          <p className="mt-3 text-secondary text-on-indigo-muted">
            itriX makes computation worth scaling — we change the form of a workload before it runs,
            and validate any benefit through evaluation.
          </p>
          <p className="mt-4 text-caption italic text-on-indigo-muted">“{brand.thesis}”</p>
        </div>
        {footerNav.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-micro font-semibold uppercase tracking-[0.1em] text-on-indigo-muted">{col.title}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-secondary text-oni/80 transition-colors hover:text-oni">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-caption text-on-indigo-muted sm:flex-row sm:items-center">
          <span>© {year} {brand.legalEntity}. All rights reserved.</span>
          <span>{brand.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
