import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';

/**
 * The public sitemap.
 *
 * PUBLIC ONLY, by construction. This is a hand-maintained allow-list rather than
 * a crawl of the route tree, because a generated sitemap would happily publish
 * /c/[token] and the workspace the moment someone added a route. Every entry
 * here is a page an anonymous visitor is meant to find.
 *
 * The funnel (/review), the token-gated client pages (/c/*), the portal
 * (/workspace/*) and the auth screens are deliberately absent, and robots.txt
 * disallows them as well — belt and braces, because the two mechanisms fail in
 * different ways.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/+$/, '');
  const now = new Date();

  const paths = [
    '', '/alpha-compute', '/alpha-core',
    '/technology', '/technology/axiom', '/technology/cre', '/technology/fqnm',
    '/licensing', '/licensing/non-exclusive', '/licensing/exclusive',
    '/about', '/use-cases', '/resources', '/resources/fqnm-paper', '/rooms',
  ];

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.7,
  }));
}
