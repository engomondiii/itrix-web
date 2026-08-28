import { buildMetadata } from '@/components/seo/PageMeta';
import { LegalDocument } from '@/components/legal/LegalDocument';
import { legalInstrument, LEGAL_PUBLISHED } from '@/lib/content/legalCopy';

/**
 * /disclosure-policy — one of the four legal instruments (Architecture v2.7 §19.10, R44).
 *
 * v6.0 CREATES ALL FOUR ROUTES, WHICH CLEARS THE v5.0 RELEASE BLOCKER: /privacy and
 * /security did not exist, so the sidebar footer skipped them with a development
 * warning rather than shipping two 404s. The null-href workaround is removed with
 * this file, not extended.
 *
 * Statically rendered, indexable when the configured legal publication state is active,
 * printable, and readable without JavaScript. `noIndex` follows `LEGAL_PUBLISHED` so an
 * intentionally unpublished instrument is not cached as the governing version.
 */
const instrument = legalInstrument('disclosure-policy');

export const metadata = buildMetadata({
  title: instrument.title,
  description: instrument.standfirst,
  path: '/disclosure-policy',
  noIndex: !LEGAL_PUBLISHED,
});

export default function Page() {
  return <LegalDocument instrument={instrument} />;
}
