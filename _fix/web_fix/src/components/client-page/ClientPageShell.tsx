'use client';

import { PersonalizedHero } from './PersonalizedHero';
import { PitchSlideDeck } from './PitchSlideDeck';
import { AccountCreateGate } from './AccountCreateGate';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AgentChatPanel } from '@/components/chat/AgentChatPanel';
import { ConfidentialityNote } from '@/components/homepage/ConfidentialityNote';
import { routeLabel, licenseLabel } from '@/lib/formatting/formatRoute';
import { cn } from '@/lib/cn';
import type { ClientPage, DiagnosisRelevanceRow, KpiPreviewRow, ProofPreviewRow } from '@/types/client.types';

/**
 * Renders the Problemology customized client page (the Pitch Room) from a ClientPage
 * payload. This is the relocation home for the old result-card content — the
 * structural diagnosis, product route, ALPHA fit, KPI preview, proof preview, and
 * recommended next step — now presented as a personalized, earned pitch surface with
 * embedded governed agent chat and the (gated) account-creation reveal.
 *
 * DEFENSIVE (v4.0.2): every list is coerced to an array and every row is read through a
 * safe accessor, so a missing/renamed field from the backend degrades to a skipped row
 * rather than crashing the whole page. (The /api/client-page proxy already normalizes the
 * payload; this is belt-and-braces so the page can never white-screen on shape drift.)
 */

const RELEVANCE_TONE: Record<'high' | 'medium' | 'low', string> = {
  high: 'text-sapphire-700',
  medium: 'text-ink-700',
  low: 'text-ink-400',
};

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function relevanceOf(row: DiagnosisRelevanceRow): 'high' | 'medium' | 'low' {
  return row?.relevance === 'high' || row?.relevance === 'medium' || row?.relevance === 'low'
    ? row.relevance
    : 'medium';
}

export function ClientPageShell({ page }: { page: ClientPage }) {
  const diagnosis = asArray<DiagnosisRelevanceRow>(page?.diagnosis).filter((r) => r && typeof r.label === 'string');
  const kpiPreview = asArray<KpiPreviewRow>(page?.kpiPreview).filter((k) => k && typeof k.label === 'string');
  const proofPreview = asArray<ProofPreviewRow>(page?.proofPreview).filter((p) => p && typeof p.title === 'string');

  return (
    <div className="container-page py-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        {/* Left — the pitch room */}
        <div className="flex flex-col gap-8">
          <PersonalizedHero page={page} />

          <PitchSlideDeck page={page} />

          {/* Structural diagnosis (relocated result content). */}
          {diagnosis.length > 0 ? (
            <Card variant="default" className="flex flex-col gap-3">
              <SectionLabel>Structural read</SectionLabel>
              <h2 className="text-web-h3 text-indigo-950">How your workload maps to the bottleneck</h2>
              <ul className="mt-1 flex flex-col divide-y divide-line-subtle">
                {diagnosis.map((row, i) => {
                  const relevance = relevanceOf(row);
                  return (
                    <li key={`${row.label}-${i}`} className="flex items-center justify-between gap-4 py-2.5">
                      <span className="text-body text-ink-900">{row.label}</span>
                      <span className={cn('text-secondary font-medium capitalize', RELEVANCE_TONE[relevance])}>
                        {relevance} relevance
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ) : null}

          {/* ALPHA fit + recommended pathway. */}
          <Card variant="warm" className="flex flex-col gap-3">
            <SectionLabel>Where itriX fits</SectionLabel>
            <p className="reading text-ink-900">{page.alphaFitSummary}</p>
            <div className="mt-1 flex flex-wrap gap-x-8 gap-y-2 text-secondary text-ink-500">
              <span>Recommended: <strong className="text-ink-900">{routeLabel(page.productRoute)}</strong></span>
              <span>Pathway: <strong className="text-ink-900">{licenseLabel(page.licensePathway)}</strong></span>
            </div>
          </Card>

          {/* What an evaluation could measure (qualitative only). */}
          {kpiPreview.length > 0 ? (
            <Card variant="default" className="flex flex-col gap-3">
              <SectionLabel>What an evaluation could measure</SectionLabel>
              <div className="grid gap-3 sm:grid-cols-3">
                {kpiPreview.map((kpi, i) => (
                  <div key={`${kpi.label}-${i}`} className="rounded-md border border-line-subtle bg-surface p-3">
                    <span className="text-micro font-semibold uppercase tracking-[0.08em] text-sapphire-600">
                      {kpi.label}
                    </span>
                    <p className="mt-1 text-secondary text-ink-700">{kpi.metric}</p>
                  </div>
                ))}
              </div>
            </Card>
          ) : null}

          {/* Proof preview (public references shown; NDA-only marked, never exposed). */}
          {proofPreview.length > 0 ? (
            <Card variant="default" className="flex flex-col gap-3">
              <SectionLabel>Proof</SectionLabel>
              <ul className="flex flex-col gap-2">
                {proofPreview.map((p, i) => (
                  <li key={`${p.title}-${i}`} className="flex items-center justify-between gap-4">
                    <span className="text-body text-ink-900">{p.title}</span>
                    {p.disclosure === 'public' && p.reference ? (
                      <span className="font-mono text-caption text-ink-500">{p.reference}</span>
                    ) : (
                      <span className="rounded-pill bg-gold-50 px-2 py-0.5 text-micro font-semibold uppercase tracking-[0.08em] text-gold-600">
                        Shared after NDA
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {/* Recommended next step. */}
          <Card variant="featured" className="flex flex-col gap-2">
            <SectionLabel tone="gold">Suggested next step</SectionLabel>
            <p className="reading text-ink-900">{page.recommendedNextStep}</p>
          </Card>
        </div>

        {/* Right — embedded governed chat + the (gated) account-creation reveal */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-6">
          <AgentChatPanel
            context="client_page"
            conversationId={page.conversationId ?? `client-page-${page.token}`}
            token={page.token}
            title="Discuss your review"
            intro="Ask about the diagnosis, the recommended pathway, or what a next step would involve."
            suggestions={[
              'What would an assessment involve?',
              'Which ALPHA product fits us best?',
              'What can we discuss before an NDA?',
            ]}
          />

          <AccountCreateGate token={page.token} />

          <ConfidentialityNote />
        </aside>
      </div>
    </div>
  );
}
