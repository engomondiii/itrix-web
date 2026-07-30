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
         search result, and a crawled reset URL is a crawled bearer token.

         v8.0 Phase 5 adds /verify-email for the same reason, and it is the strongest case of
         the set: that URL carries a single-use confirmation token in its query string, and a
         crawler following it would burn the link before the person ever clicked it. */
      disallow: [
        '/review', '/c/', '/workspace',
        '/sign-in', '/sign-up', '/set-password', '/forgot-password', '/reset-password',
        '/verify-email',
        '/api',
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
