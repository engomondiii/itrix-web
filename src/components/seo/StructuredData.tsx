import { siteConfig } from '@/config/site.config';
import { brand } from '@/constants/brand';

type JsonLd = Record<string, unknown>;

/**
 * Injects JSON-LD. Pass a custom `data` schema, or omit for the default graph used on
 * the homepage. Finalized for production: Organization + WebSite + the two ALPHA
 * products, with claim-safe descriptions (no numbers, no guarantees).
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
        {
          '@type': 'Product',
          '@id': `${siteConfig.url}/alpha-compute#product`,
          name: 'ALPHA Compute',
          brand: { '@id': `${siteConfig.url}#organization` },
          description:
            'Examines whether a workload can be rewritten into a more efficient representation before it runs, with any benefit validated through evaluation.',
        },
        {
          '@type': 'Product',
          '@id': `${siteConfig.url}/alpha-core#product`,
          name: 'ALPHA Core',
          brand: { '@id': `${siteConfig.url}#organization` },
          description:
            'Executes the reconstructed computation on target hardware and measures the result for the specific workload.',
        },
      ],
    };

  return (
    <script
      type="application/ld+json"
      // JSON-LD is static, server-rendered, and not user-derived — safe to inline.
      /*
        THE ONE EXCEPTION TO itrix/no-dangerous-html, and it is a real one.

        JSON-LD cannot be a text child of <script>: React escapes text children,
        which turns `<`, `>` and `&` into HTML entities and produces invalid JSON
        inside the tag. So structured data has to be injected as a string.

        WHY THAT IS SAFE HERE, unlike in a rendered turn: the content is OUR OWN
        object, serialized on the server from siteConfig and brand constants. No
        model output, no visitor input and no fetched content reaches it — which is
        exactly the property the rule exists to protect in MarkdownTurn, where none
        of those things is true.

        The `<` is escaped anyway, because a `</script>` sequence appearing inside a
        JSON string value would close the tag early. That is the standard hardening
        for JSON-LD and it costs nothing.

        Reviewed: Surface 1 v6.0 Phase 2. Do not widen this pattern — if another
        component needs it, it needs its own review, not this one's precedent.
      */
      // eslint-disable-next-line itrix/no-dangerous-html
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}
