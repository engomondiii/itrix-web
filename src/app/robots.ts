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
      disallow: ['/review', '/c/', '/workspace', '/sign-in', '/set-password', '/forgot-password', '/api'],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
