'use client';

import type { Artifact } from '@/types/artifact.types';
import { useLocaleStore } from '@/store/localeStore';

interface ProductBriefPayload {
  productContext?: string[];
  userImpact?: string;
  tradeoffs?: string[];
  evidenceNeeded?: string[];
  deploymentImplications?: string;
  nextDecision?: string;
}
function List({ items }: { items?: string[] }) {
  if (!items?.length) return null;
  return <ul className="artifact__list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
/** Product decision support: the renderer intentionally exposes only governed fields. */
export function ProductBriefArtifact({ artifact }: { artifact: Artifact }) {
  const p = artifact.payload as ProductBriefPayload;
  const ko = useLocaleStore((s) => s.locale) === 'ko';
  return <div className="artifact__body">
    <section><h3 className="artifact__section-title">{ko ? '제품 맥락' : 'Product context'}</h3><List items={p.productContext} /></section>
    {p.userImpact ? <section><h3 className="artifact__section-title">{ko ? '사용자 영향' : 'User impact'}</h3><p>{p.userImpact}</p></section> : null}
    <section><h3 className="artifact__section-title">{ko ? '트레이드오프' : 'Trade-offs'}</h3><List items={p.tradeoffs} /></section>
    <section><h3 className="artifact__section-title">{ko ? '필요한 증거' : 'Evidence needed'}</h3><List items={p.evidenceNeeded} /></section>
    {p.deploymentImplications ? <section><h3 className="artifact__section-title">{ko ? '배포 함의' : 'Deployment implications'}</h3><p>{p.deploymentImplications}</p></section> : null}
    {p.nextDecision ? <section><h3 className="artifact__section-title">{ko ? '다음 의사결정' : 'Next decision'}</h3><p>{p.nextDecision}</p></section> : null}
  </div>;
}
