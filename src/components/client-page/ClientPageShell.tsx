'use client';

import { PersonalizedHero } from './PersonalizedHero';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { ConfidentialityNote } from '@/components/center/ConfidentialityNote';
import { LocaleToggle } from '@/components/review/LocaleToggle';
import { useLocaleStore } from '@/store/localeStore';
import { reviewCopy } from '@/lib/i18n/reviewLocale';
import type { ClientPage, DiagnosisRow, KpiPreviewRow, ProofPreviewRow } from '@/types/client.types';

function asArray<T>(v: unknown): T[] { return Array.isArray(v) ? (v as T[]) : []; }

export function ClientPageShell({ page }: { page: ClientPage }) {
  const locale = useLocaleStore((s) => s.locale);
  const copy = reviewCopy(locale);
  const diagnosis = asArray<DiagnosisRow>(page.diagnosis).filter((r) => r && typeof r.title === 'string');
  const kpis = asArray<KpiPreviewRow>(page.kpiPreview).filter((r) => r && typeof r.label === 'string');
  const proofs = asArray<ProofPreviewRow>(page.proofPreview).filter((r) => r && typeof r.title === 'string' && !String(r.reference ?? '').includes('2401.00000'));
  const mirror = page.problemMirror;

  return (
    <div className="container-page py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-7">
        <div className="flex justify-end"><LocaleToggle /></div>
        <PersonalizedHero page={page} />

        <Card variant="default" className="flex flex-col gap-4">
          <SectionLabel>{copy.boundedHypothesis}</SectionLabel>
          <p className="reading text-ink-primary">{mirror?.boundedHypothesis}</p>
          {(mirror?.unknowns ?? []).length > 0 ? (
            <div><h3 className="text-secondary font-semibold text-ink-primary">{copy.unknowns}</h3><ul className="mt-2 list-disc space-y-1 pl-5 text-body text-ink-secondary">{mirror.unknowns.map((v,i)=><li key={`${i}-${v.slice(0,24)}`}>{v}</li>)}</ul></div>
          ) : null}
          <p className="text-secondary text-ink-secondary">{mirror?.confirmOrCorrect}</p>
        </Card>

        {diagnosis.length > 0 ? (
          <Card variant="default" className="flex flex-col gap-3">
            <SectionLabel>{copy.structuralRead}</SectionLabel>
            <div className="grid gap-4">
              {diagnosis.map((row, i) => (
                <article key={`${row.title}-${i}`} className="rounded-md border border-border-soft p-4">
                  <h3 className="text-body font-semibold text-ink-primary">{row.title}</h3>
                  <p className="mt-2 text-body text-ink-primary">{row.observation}</p>
                  <p className="mt-2 text-secondary text-ink-secondary">{row.interpretation}</p>
                  {row.evidenceStatus ? <p className="mt-2 text-micro uppercase tracking-[0.08em] text-ink-secondary">{row.evidenceStatus}</p> : null}
                </article>
              ))}
            </div>
          </Card>
        ) : null}

        <Card variant="warm" className="flex flex-col gap-3">
          <SectionLabel>{copy.alphaFit}</SectionLabel>
          <p className="reading text-ink-primary">{page.alphaFitSummary}</p>
        </Card>

        {kpis.length > 0 ? (
          <Card variant="default" className="flex flex-col gap-3">
            <SectionLabel>{copy.measures}</SectionLabel>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {kpis.map((kpi, i) => <div key={`${kpi.label}-${i}`} className="rounded-md border border-border-soft bg-surface p-3"><span className="text-micro font-semibold uppercase tracking-[0.08em] text-ink-primary">{kpi.label}</span><p className="mt-1 text-secondary text-ink-secondary">{kpi.metric}</p></div>)}
            </div>
          </Card>
        ) : null}

        {proofs.length > 0 ? (
          <Card variant="default" className="flex flex-col gap-3">
            <SectionLabel>{copy.proof}</SectionLabel>
            <ul className="flex flex-col gap-3">{proofs.map((p,i)=><li key={`${p.title}-${i}`} className="rounded-md border border-border-soft p-3"><p className="text-body font-medium text-ink-primary">{p.title}</p>{p.reference ? <p className="mt-1 font-mono text-caption text-ink-secondary">{p.reference}</p> : null}</li>)}</ul>
          </Card>
        ) : null}

        {page.recommendedNextStep ? <Card variant="featured" className="flex flex-col gap-2"><SectionLabel tone="gold">{copy.nextStep}</SectionLabel><p className="reading text-ink-primary">{page.recommendedNextStep}</p></Card> : null}

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border-soft pt-4 text-caption text-ink-secondary">
          <span>{copy.artifactFamily}: {page.artifactFamily || 'my_review'} · {copy.version} {page.artifactVersion}</span>
          <time dateTime={page.generatedAt}>{copy.generated}: {page.generatedAt ? new Date(page.generatedAt).toLocaleString(locale === 'ko' ? 'ko-KR' : 'en') : '—'}</time>
        </footer>
        <ConfidentialityNote />
      </div>
    </div>
  );
}
