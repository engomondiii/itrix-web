'use client';

import type { Artifact } from '@/types/artifact.types';
import { useLocaleStore } from '@/store/localeStore';

interface TechnicalBriefPayload {
  workload?: string;
  baseline?: string;
  observedPressures?: string[];
  boundedHypothesis?: string;
  kpis?: string[];
  proofPlan?: string[];
  unknowns?: string[];
}
function List({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return <ul className="artifact__list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
/** No arbitrary payload keys are enumerated or stringified. */
export function TechnicalBriefArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as TechnicalBriefPayload;
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  return <div className="artifact__body">
    {p.workload ? <section><h3 className="artifact__section-title">{ko ? '워크로드' : 'Workload'}</h3><p>{p.workload}</p></section> : null}
    {p.baseline ? <section><h3 className="artifact__section-title">{ko ? '기준선' : 'Baseline'}</h3><p>{p.baseline}</p></section> : null}
    <section><h3 className="artifact__section-title">{ko ? '관찰된 압력' : 'Observed pressures'}</h3><List items={p.observedPressures} /></section>
    {p.boundedHypothesis ? <section><h3 className="artifact__section-title">{ko ? '제한된 가설' : 'Bounded hypothesis'}</h3><p>{p.boundedHypothesis}</p></section> : null}
    <section><h3 className="artifact__section-title">{ko ? '검증 KPI' : 'Validation KPIs'}</h3><List items={p.kpis} /></section>
    <section><h3 className="artifact__section-title">{ko ? '검증 계획' : 'Proof plan'}</h3><List items={p.proofPlan} /></section>
    <section><h3 className="artifact__section-title">{ko ? '미확정 사항' : 'Unknowns'}</h3><List items={p.unknowns} /></section>
  </div>;
}
