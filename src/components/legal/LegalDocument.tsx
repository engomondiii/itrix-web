import Link from 'next/link';
import { routes } from '@/constants/routes';
import { ItrixLogo } from '@/components/brand/ItrixLogo';
import { LEGAL_DRAFT_NOTICE, LEGAL_PUBLISHED } from '@/lib/content/legalCopy';
import type { LegalInstrument } from '@/lib/content/legalCopy';
import { LegalNav } from './LegalNav';
import { LegalVersionBadge } from './LegalVersionBadge';

/**
 * One legal instrument, rendered as a document.
 *
 * ── IT IS A SERVER COMPONENT, ON PURPOSE ────────────────────────────────────
 * No `use client`, no hooks, no store. These four pages must be readable with
 * JavaScript disabled and printable (Surface 1 v6.0 §1.1), and both stop being true
 * the moment a legal page depends on a client-side shell. It is also why
 * ShellModeGate renders the legal routes bare rather than nesting them in the
 * working shell.
 *
 * ── THE DRAFT BANNER ────────────────────────────────────────────────────────
 * Until `NEXT_PUBLIC_LEGAL_PUBLISHED=true`, every instrument renders
 * LEGAL_DRAFT_NOTICE at the top and the route is `noindex`. These documents have not
 * been reviewed by counsel, and publishing an unreviewed contract as the
 * authoritative terms of a commercial platform is a worse failure than a delayed
 * index. The requirement the specification actually cares about — that the four
 * instruments EXIST, are reachable at every state and every width, and are linked
 * from the arrival screen — is met either way.
 *
 * A paragraph beginning "· " renders as a list item. That is a deliberately small
 * formatting vocabulary: a legal instrument needs prose and lists and nothing else,
 * and anything richer would invite markup into a document whose exact wording is the
 * point.
 */
export function LegalDocument({ instrument }: { instrument: LegalInstrument }) {
  return (
    <div className="legal-page">
      <header className="legal-page__bar">
        <Link href={routes.home} className="legal-page__brand" aria-label="itriX home">
          <ItrixLogo width={104} />
        </Link>
        <LegalNav current={instrument.slug} />
      </header>

      <main id="content" className="legal-page__main">
        <article className="legal-doc">
          <h1 className="legal-doc__title">{instrument.title}</h1>
          <p className="legal-doc__standfirst">{instrument.standfirst}</p>
          <LegalVersionBadge instrument={instrument} />

          {!LEGAL_PUBLISHED ? (
            <aside className="legal-draft" role="note">
              <p className="legal-draft__label">Draft</p>
              <p>{LEGAL_DRAFT_NOTICE}</p>
            </aside>
          ) : null}

          {instrument.sections.map((section) => (
            <section key={section.heading} className="legal-doc__section">
              <h2>{section.heading}</h2>
              {renderBody(section.body)}
            </section>
          ))}
        </article>
      </main>
    </div>
  );
}

/** Group consecutive "· " paragraphs into one list; everything else is prose. */
function renderBody(body: string[]) {
  const blocks: Array<{ kind: 'p'; text: string } | { kind: 'ul'; items: string[] }> = [];

  for (const raw of body) {
    if (raw.startsWith('· ')) {
      const last = blocks[blocks.length - 1];
      const item = raw.slice(2);
      if (last && last.kind === 'ul') last.items.push(item);
      else blocks.push({ kind: 'ul', items: [item] });
    } else {
      blocks.push({ kind: 'p', text: raw });
    }
  }

  return blocks.map((block, i) =>
    block.kind === 'p' ? (
      <p key={i}>{block.text}</p>
    ) : (
      <ul key={i}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    ),
  );
}
