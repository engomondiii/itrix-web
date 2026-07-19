import Link from 'next/link';
import { footerNav } from '@/config/navigation.config';
import { brand } from '@/constants/brand';
import { routes } from '@/constants/routes';

/**
 * The public footer (Playbook §07, Brand Manual §3.2).
 *
 * The footer is one of the few places the Brand Manual permits a full dark
 * ground (#1F2937) — it closes the frame that the light canvas opens. Text on
 * that ground is ink-inverse; the quiet supporting text uses ink-muted, which is
 * the ONE context where that token is permitted to carry words (it reaches
 * ~5.7:1 on #1F2937, versus ~2.5:1 on the canvas).
 *
 * One calm one-line statement of what itriX does, the pulled-not-pushed link
 * set, and legal. No aggressive CTAs — the review is the one action, and it is
 * offered contextually, not in the furniture.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-structure-900 text-ink-inverse">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-xs">
          <Link
            href={routes.home}
            className="font-display text-lg font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft focus-visible:ring-offset-2 focus-visible:ring-offset-structure-900"
          >
            itri<span className="text-accent-soft">X</span>
          </Link>
          <p className="mt-3 text-secondary text-ink-muted">
            itriX makes computation worth scaling — we change the form of a workload before it runs,
            and validate any benefit through evaluation.
          </p>
          <p className="mt-4 text-caption italic text-ink-muted">“{brand.thesis}”</p>
        </div>

        {footerNav.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="font-mono text-micro font-semibold uppercase tracking-[0.1em] text-ink-muted">
              {col.title}
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-secondary text-ink-inverse/80 transition-colors hover:text-ink-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-start justify-between gap-2 py-5 text-caption text-ink-muted sm:flex-row sm:items-center">
          <span>
            © {year} {brand.legalEntity}. All rights reserved.
          </span>
          <span>{brand.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
