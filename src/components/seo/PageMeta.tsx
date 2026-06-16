import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';
import { buildOpenGraph } from './OpenGraph';

export interface PageMetaInput {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Helper for `export const metadata` in any page (App Router). Merges canonical,
 * robots, and Open Graph in one call:
 *   export const metadata = buildMetadata({ title: 'ALPHA Compute', path: '/alpha-compute' });
 */
export function buildMetadata({ title, description, path = '/', image, noIndex }: PageMetaInput): Metadata {
  const canonical = new URL(path, siteConfig.url).toString();
  return {
    title,
    description: description ?? siteConfig.description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    ...buildOpenGraph({ title, description, path, image }),
  };
}
