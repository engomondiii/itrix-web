'use client';

import type { Artifact } from '@/types/artifact.types';
import { useLocaleStore } from '@/store/localeStore';

interface ExecutiveBriefPayload {
  summary?: string[];
  decision?: string;
  customerImpact?: string;
  evidenceNeeded?: string[];
  risks?: string[];
  recommendation?: string;
}

function List({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return <ul className="artifact__list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

/** Governed internal-champion artifact. Only the closed schema below is renderable. */
export function ExecutiveBriefArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as ExecutiveBriefPayload;
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  return (
    <div className="artifact__body">
      <section><h3 className="artifact__section-title">{ko ? '확인된 상황' : 'Confirmed context'}</h3><List items={p.summary} /></section>
      {p.decision ? <section><h3 className="artifact__section-title">{ko ? '지원할 의사결정' : 'Decision to support'}</h3><p>{p.decision}</p></section> : null}
      {p.customerImpact ? <section><h3 className="artifact__section-title">{ko ? '고객 영향' : 'Customer impact'}</h3><p>{p.customerImpact}</p></section> : null}
      <section><h3 className="artifact__section-title">{ko ? '필요한 증거' : 'Evidence needed'}</h3><List items={p.evidenceNeeded} /></section>
      <section><h3 className="artifact__section-title">{ko ? '위험과 경계' : 'Risks and boundaries'}</h3><List items={p.risks} /></section>
      {p.recommendation ? <section><h3 className="artifact__section-title">{ko ? '권고' : 'Recommendation'}</h3><p>{p.recommendation}</p></section> : null}
    </div>
  );
}
