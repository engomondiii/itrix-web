import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';

export interface OpenGraphInput {
  title: string;
  description?: string;
  path?: string; // route path, e.g. /alpha-compute
  image?: string;
}

/**
 * Builds the Open Graph + Twitter slice of a page's Metadata. Finalized for
 * production: the image is resolved to an absolute URL (crawlers require it) and the
 * canonical URL is derived from the site origin.
 */
export function buildOpenGraph({ title, description, path = '/', image }: OpenGraphInput): Metadata {
  const url = new URL(path, siteConfig.url).toString();
  const desc = description ?? siteConfig.description;
  const rawImg = image ?? siteConfig.ogImage;
  const img = rawImg.startsWith('http') ? rawImg : new URL(rawImg, siteConfig.url).toString();
  return {
    metadataBase: new URL(siteConfig.url),
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      title,
      description: desc,
      url,
      images: [{ url: img, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description: desc, images: [img] },
  };
}
