import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';

/**
 * robots.txt, generated.
 *
 * The static public/robots.txt is kept as a fallback for any deploy that serves
 * the directory directly; this route is the authoritative one and they say the
 * same thing. Keeping them in sync matters, so both list the same disallows in
 * the same order.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url.replace(/\/+$/, '');
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* v7.0 Phase 4 adds the two new authentication routes. An authentication page has
         no business in an index: it is not content, it cannot be usefully entered from a
         search result, and a crawled reset URL is a crawled bearer token. */
      disallow: [
        '/review', '/c/', '/workspace',
        '/sign-in', '/sign-up', '/set-password', '/forgot-password', '/reset-password',
        '/api',
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
