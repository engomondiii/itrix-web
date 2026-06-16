import { siteConfig } from '@/config/site.config';
import { brand } from '@/constants/brand';

type JsonLd = Record<string, unknown>;

/**
 * Injects JSON-LD. Pass a custom `data` schema, or omit for the default graph
 * (Organization + WebSite) used on the homepage. Finalized for production.
 */
export function StructuredData({ data }: { data?: JsonLd }) {
  const schema: JsonLd =
    data ?? {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${siteConfig.url}#organization`,
          name: brand.legalEntity,
          alternateName: brand.name,
          url: siteConfig.url,
          description: siteConfig.description,
          slogan: brand.thesis,
          email: brand.contactEmail,
        },
        {
          '@type': 'WebSite',
          '@id': `${siteConfig.url}#website`,
          url: siteConfig.url,
          name: siteConfig.name,
          description: siteConfig.description,
          publisher: { '@id': `${siteConfig.url}#organization` },
        },
      ],
    };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is static, server-rendered, and not user-derived — safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
