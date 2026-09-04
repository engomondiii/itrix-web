import Link from 'next/link';
import { LocalizedText } from '@/components/i18n/LocalizedText';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { buildMetadata } from '@/components/seo/PageMeta';
import { routes } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'ASTOP',
  description: 'Controlled observation infrastructure for agentic AI workflows.',
  path: routes.astop,
});

const stages = [
  ['Identify & Qualify', '확인 및 적합성 검토'],
  ['NDA & Briefing', 'NDA 및 브리핑'],
  ['Controlled Evaluation', '통제된 평가'],
  ['License-Out & Deployment', 'License-Out 및 배포'],
  ['Verify & Expand', '가치 검증 및 확장'],
] as const;

export default function AstopPage() {
  return (
    <main>
      <section className="section border-b border-border-medium bg-canvas">
        <div className="container-page max-w-4xl">
          <SectionLabel><LocalizedText en="ASTOP" ko="ASTOP" /></SectionLabel>
          <h1 className="mt-5 font-display text-web-display text-structure-900">A System Trans-Observation Projector</h1>
          <p className="mt-5 max-w-reading reading text-ink-secondary">
            <LocalizedText
              en="ASTOP is itriX’s observation-efficiency product for agentic AI. It establishes reliable host, accelerator, process and experiment state so decision-relevant information can reach humans, software and AI agents without treating unavailable values as measured facts."
              ko="ASTOP은 에이전틱 AI를 위한 itriX의 관측 효율 제품입니다. 호스트, 가속기, 프로세스, 실험 상태를 신뢰할 수 있게 관측하고, 이용할 수 없는 값을 측정된 사실로 만들지 않으면서 사람·소프트웨어·AI 에이전트에 의사결정에 필요한 정보를 전달할 수 있도록 합니다."
            />
          </p>
        </div>
      </section>

      <section className="section border-b border-border-medium bg-surface">
        <div className="container-page max-w-4xl grid gap-8 md:grid-cols-2">
          <div>
            <SectionLabel><LocalizedText en="Observation before reasoning" ko="추론 전에 관측을 정리" /></SectionLabel>
            <p className="mt-4 reading text-ink-secondary">
              <LocalizedText
                en="PRISM is the observation architecture behind ASTOP: organize raw computational state into decision-relevant representations before expensive reasoning is invoked. The objective is decision sufficiency first; efficiency is evaluated only when the underlying task and decision fidelity are preserved."
                ko="PRISM은 ASTOP의 기반이 되는 관측 아키텍처입니다. 비용이 큰 추론을 호출하기 전에 원시 계산 상태를 의사결정에 필요한 표현으로 정리합니다. 핵심은 먼저 의사결정에 필요한 정보를 보존하는 것이며, 효율은 작업 결과와 의사결정 충실성이 유지될 때 평가합니다."
              />
            </p>
          </div>
          <div>
            <SectionLabel><LocalizedText en="Controlled access" ko="통제된 접근" /></SectionLabel>
            <p className="mt-4 reading text-ink-secondary">
              <LocalizedText
                en="ASTOP is not offered as an anonymous executable, public checkout or self-service subscription. Public visitors can learn about the problem and product safely; deeper evaluation is tied to an identified organization, defined scope and controlled entitlement. Production rights require an executed License-Out agreement."
                ko="ASTOP은 익명 실행 파일, 공개 결제 또는 셀프서비스 구독 형태로 제공되지 않습니다. 공개 방문자는 문제와 제품을 안전한 범위에서 이해할 수 있고, 더 깊은 평가는 확인된 조직, 정의된 범위, 통제된 권한에 연결됩니다. 프로덕션 권리는 체결된 License-Out 계약을 통해 부여됩니다."
              />
            </p>
          </div>
        </div>
      </section>

      <section className="section border-b border-border-medium bg-canvas">
        <div className="container-page max-w-4xl">
          <SectionLabel><LocalizedText en="Controlled progression" ko="통제된 진행 단계" /></SectionLabel>
          <ol className="mt-6 grid gap-3 md:grid-cols-5">
            {stages.map(([en, ko], i) => (
              <li key={en} className="rounded-md border border-border-medium bg-surface p-4">
                <span className="text-micro text-ink-secondary">0{i + 1}</span>
                <p className="mt-2 text-secondary font-semibold text-ink-primary"><LocalizedText en={en} ko={ko} /></p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="container-page max-w-3xl">
          <SectionLabel><LocalizedText en="Start with the observation problem" ko="관측 문제부터 시작" /></SectionLabel>
          <p className="mt-4 reading text-ink-secondary">
            <LocalizedText en="You do not need an account to ask a public-safe question. Describe the observation or agent-supervision problem without confidential details; deeper access is introduced only when the case and safeguards justify it." ko="공개 범위의 질문을 시작하기 위해 계정이 필요하지 않습니다. 기밀 정보를 제외하고 관측 또는 에이전트 감독 문제를 설명해 주세요. 더 깊은 접근은 사례와 보호 조건이 충족될 때만 진행합니다." />
          </p>
          <Link href={routes.home} className="mt-6 inline-flex min-h-11 items-center rounded-md bg-structure-900 px-5 py-3 text-secondary font-semibold text-white">
            <LocalizedText en="Start a conversation" ko="대화 시작" />
          </Link>
        </div>
      </section>
    </main>
  );
}
