import { TechnologyHero } from '@/components/technology/TechnologyHero';
import { DisclosureLevelBadge } from '@/components/technology/DisclosureLevelBadge';
import { PublicProofReference } from '@/components/technology/PublicProofReference';
import { LocalizedText } from '@/components/i18n/LocalizedText';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { TECHNOLOGIES } from '@/constants/products';
import { routes } from '@/constants/routes';

const t = TECHNOLOGIES.fqnm;
export const metadata = buildMetadata({ title: 'FQNM', description: t.oneLiner, path: routes.fqnm });

export default function FqnmPage() {
  return (
    <>
      <TechnologyHero
        eyebrow={<LocalizedText en={t.gap} ko="보존 법칙 동역학" />}
        title="FQNM"
        expansion={t.expansion}
        lead={<LocalizedText en={t.oneLiner} ko="선택된 보존형 동역학에서 양의 이동을 정수 단위로 표현하고, 이후 연속 관측값을 재구성하는 수치 방법입니다." />}
      />
      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page max-w-3xl">
          <div className="flex items-center gap-3"><DisclosureLevelBadge level="public" /></div>
          <SectionLabel className="mt-8"><LocalizedText en="The idea" ko="핵심 아이디어" /></SectionLabel>
          <div className="reading mt-4">
            <LocalizedText
              en={<p>FQNM treats selected conservative dynamics as countable transfer. In its supported domain, discrete conservation follows from the transfer construction itself, and continuum observables are reconstructed afterward. Applicability and any performance advantage remain workload-specific questions that require validation.</p>}
              ko={<p>FQNM은 지원되는 보존형 동역학에서 이동을 셀 수 있는 전달로 다룹니다. 현재 입증된 범위에서는 전달 구조 자체에서 이산 보존이 성립하며, 이후 연속 관측값을 재구성합니다. 적용 가능성과 성능상 이점은 워크로드별로 별도 검증이 필요합니다.</p>}
            />
          </div>
          <div className="mt-8">
            <PublicProofReference
              title="Fast Quantised Numerical Method"
              reference="arXiv:2604.06947"
              note={<LocalizedText en="A public arXiv preprint describing the method and its demonstrated scope. It is not presented here as peer-reviewed evidence." ko="방법과 현재 입증 범위를 설명하는 공개 arXiv 프리프린트입니다. 여기서는 동료평가 논문으로 표시하지 않습니다." />}
            />
          </div>
        </div>
      </section>
    </>
  );
}
