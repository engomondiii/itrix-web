import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';
import { LEGAL_INSTRUMENTS, LEGAL_PUBLISHED } from '@/lib/content/legalCopy';

/**
 * The public sitemap.
 *
 * PUBLIC ONLY, by construction. This is a hand-maintained allow-list rather than a
 * crawl of the route tree, because a generated sitemap would happily publish
 * /c and the workspace the moment someone added a route. Every entry here is
 * a page an anonymous visitor is meant to find.
 *
 * ── v6.0: THE MARKETING ROUTES STAY, EVEN THOUGH NOTHING LINKS TO THEM ──────
 * The arrival screen no longer carries navigation, so /about, /technology, /licensing
 * and the rooms are reachable only by search or direct link until the content pane's
 * Explore section lands in Phase 2. Removing them from the sitemap because the front
 * door stopped linking to them would turn a deliberate UI decision into an
 * accidental deindexing (Architecture v2.7 §00.2).
 *
 * ── AND THE LEGAL ROUTES ARE CONDITIONAL ────────────────────────────────────
 * They are listed only once `NEXT_PUBLIC_LEGAL_PUBLISHED=true`. An intentionally
 * unpublished instrument should not be the version a search engine caches, and the
 * page-level `noindex` and this list have to agree.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/+$/, '');
  const now = new Date();

  const paths = [
    '', '/astop', '/alpha-compute', '/alpha-core',
    '/technology', '/technology/prism', '/technology/axiom', '/technology/cre', '/technology/fqnm',
    '/licensing', '/licensing/non-exclusive', '/licensing/exclusive',
    '/about', '/use-cases', '/resources', '/resources/fqnm-paper', '/rooms',
    ...(LEGAL_PUBLISHED ? LEGAL_INSTRUMENTS.map((i) => `/${i.slug}`) : []),
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
