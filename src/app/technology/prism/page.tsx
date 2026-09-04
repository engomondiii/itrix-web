import Link from 'next/link';
import { LocalizedText } from '@/components/i18n/LocalizedText';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'PRISM',
  description: 'Projection and Representation for Intelligent Semantic Monitoring.',
  path: routes.prism,
});

export default function PrismPage() {
  return (
    <main>
      <section className="section border-b border-border-medium bg-canvas">
        <div className="container-page max-w-4xl">
          <SectionLabel><LocalizedText en="Technology behind ASTOP" ko="ASTOP 기반 기술" /></SectionLabel>
          <h1 className="mt-5 font-display text-web-display text-structure-900">PRISM</h1>
          <p className="mt-2 text-secondary font-semibold text-ink-primary">Projection and Representation for Intelligent Semantic Monitoring</p>
          <p className="mt-5 max-w-reading reading text-ink-secondary">
            <LocalizedText en="PRISM places a logically independent Observation Layer before an expensive AI controller. It projects raw computational history into decision-facing semantic state and can deliver information when meaningful state changes, rather than forcing the controller to reconstruct the same context from repeated raw observations." ko="PRISM은 비용이 큰 AI 컨트롤러 앞에 논리적으로 독립된 Observation Layer를 둡니다. 원시 계산 이력을 의사결정에 필요한 의미 상태로 투영하고, 반복적인 원시 관측에서 같은 맥락을 계속 재구성하게 하는 대신 의미 있는 상태 변화가 있을 때 필요한 정보를 전달할 수 있습니다." />
          </p>
        </div>
      </section>
      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page max-w-4xl grid gap-6 md:grid-cols-3">
          <div><SectionLabel><LocalizedText en="Project" ko="투영" /></SectionLabel><p className="mt-3 text-secondary text-ink-secondary"><LocalizedText en="Convert raw state into a representation relevant to the next decision." ko="원시 상태를 다음 의사결정에 필요한 표현으로 변환합니다." /></p></div>
          <div><SectionLabel><LocalizedText en="Select" ko="선택" /></SectionLabel><p className="mt-3 text-secondary text-ink-secondary"><LocalizedText en="Suppress decision-equivalent repetition while retaining required evidence." ko="필요한 근거는 유지하면서 의사결정상 동일한 반복을 줄입니다." /></p></div>
          <div><SectionLabel><LocalizedText en="Preserve fidelity" ko="충실성 보존" /></SectionLabel><p className="mt-3 text-secondary text-ink-secondary"><LocalizedText en="Efficiency is meaningful only when the underlying task and controller decision remain faithful." ko="효율은 실제 작업 결과와 컨트롤러의 의사결정 충실성이 유지될 때만 의미가 있습니다." /></p></div>
        </div>
      </section>
      <section className="section bg-canvas"><div className="container-page max-w-3xl"><p className="reading text-ink-secondary"><LocalizedText en="PRISM is supporting technology, not a separately purchasable product. ASTOP is the current product that operationalizes this observation approach." ko="PRISM은 별도로 구매하는 제품이 아니라 ASTOP을 뒷받침하는 기술입니다. 현재 이 관측 접근법을 제품으로 구현하는 것은 ASTOP입니다." /></p><Link href={routes.astop} className="mt-5 inline-flex text-secondary font-semibold text-ink-primary underline underline-offset-4"><LocalizedText en="Explore ASTOP" ko="ASTOP 보기" /></Link></div></section>
    </main>
  );
}
