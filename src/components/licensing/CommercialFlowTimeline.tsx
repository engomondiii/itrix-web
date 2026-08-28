'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useLocaleStore } from '@/store/localeStore';
const EN=[
  {t:'Understand the decision',d:'Start with the workload, evidence question, or commercial issue the organisation actually needs to resolve.'},
  {t:'Protect the discussion when needed',d:'An NDA or other agreement may protect a disclosure. It does not itself authorize restricted material or commit either side to a later stage.'},
  {t:'Choose an evaluation deliberately',d:'A controlled evaluation can be scoped as its own stage. It remains distinct from a proof of concept.'},
  {t:'Consider a proof of concept only if selected',d:'A PoC is a separate, explicitly agreed validation stage with its own scope and success criteria.'},
  {t:'Scope commercial terms in writing',d:'Licensing, field of use, exclusivity, duration and other rights exist only as the applicable written agreement provides.'},
];
const KO=[
  {t:'의사결정부터 이해합니다',d:'조직이 실제로 해결해야 하는 워크로드, 근거 질문 또는 상업적 쟁점에서 시작합니다.'},
  {t:'필요한 경우 논의를 보호합니다',d:'NDA 또는 다른 계약은 공개를 보호할 수 있습니다. 그 자체로 제한 자료를 승인하거나 다음 단계에 동의하게 만들지는 않습니다.'},
  {t:'평가는 의도적으로 선택합니다',d:'제어된 평가는 독립된 단계로 범위를 정할 수 있으며 PoC와 동일하지 않습니다.'},
  {t:'PoC는 별도로 선택한 경우에만 검토합니다',d:'PoC는 자체 범위와 성공 기준을 가진 별도의 명시적 합의 단계입니다.'},
  {t:'상업 조건은 서면으로 정합니다',d:'라이선스, 사용 분야, 독점권, 기간 및 기타 권리는 적용 가능한 서면 계약이 정한 범위에서만 존재합니다.'},
];
export function CommercialFlowTimeline(){const ko=useLocaleStore(s=>s.locale)==='ko';const stages=ko?KO:EN;return <section className="section border-b border-border-medium bg-surface"><div className="container-page"><SectionLabel>{ko?'가능한 의사결정 지점 — 자동 순서가 아닙니다':'Possible decision points — not an automatic sequence'}</SectionLabel><ol className="mt-8 border-l border-border-strong pl-6">{stages.map((x,i)=><li key={x.t} className="relative pb-7 last:pb-0"><span className="absolute -left-[1.65rem] flex h-6 w-6 items-center justify-center rounded-pill border border-border-medium bg-surface font-mono text-micro text-ink-primary">{i+1}</span><p className="text-card-title text-ink-primary">{x.t}</p><p className="mt-1 text-secondary text-ink-secondary">{x.d}</p></li>)}</ol></div></section>}
