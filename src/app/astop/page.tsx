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
            <SectionLabel><LocalizedText en="Individual, organization and enterprise access" ko="개인, 조직 및 엔터프라이즈 접근" /></SectionLabel>
            <p className="mt-4 reading text-ink-secondary">
              <LocalizedText
                en="Individual access is USD 20 for one seat; organizations purchase two or more seats at USD 16 per seat. Eligible Branch referrals offer a 10% discount, without stacking with the organization discount. Verified legal identity, verified email, an accepted License Order and confirmed payment are required before signed software delivery. Enterprise evaluation remains separately scoped and protected."
                ko="개인은 1석 USD 20, 조직은 2석 이상 구매 시 좌석당 USD 16입니다. 적격 Branch 추천은 10% 할인이며 조직 할인과 중복되지 않습니다. 서명된 소프트웨어 제공 전에 법적 신원 및 이메일 확인, License Order 동의, 결제 확인이 필요합니다. 엔터프라이즈 평가는 별도로 범위를 정하고 보호 절차를 적용합니다."
              />
            </p>
          </div>
        </div>
      </section>

      <section className="section border-b border-border-medium bg-canvas">
        <div className="container-page max-w-4xl">
          <SectionLabel><LocalizedText en="Enterprise evaluation pathway" ko="엔터프라이즈 평가 경로" /></SectionLabel>
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

      <section className="section border-b border-border-medium bg-canvas"><div className="container-page max-w-4xl">
        <SectionLabel><LocalizedText en="Evidence and purchase terms" ko="근거 및 구매 조건" /></SectionLabel>
        <p className="mt-4 reading text-ink-secondary"><LocalizedText en="White Paper v2.3 reports 58.8–69.2% fewer observation-induced tokens, 23.1–30.1% fewer model calls and 88.1–90.0% fewer delivered bytes in its finite tested panel. The panel used Qwen3.5 models and 360 episodes; it is not a universal customer saving or a 24-hour endurance result. Some training workloads used more calls even when tokens fell. Compare task quality, missed events, delay and monitoring cost in your own workload." ko="White Paper v2.3의 제한된 시험군에서는 관측 관련 토큰 58.8–69.2%, 모델 호출 23.1–30.1%, 전달 바이트 88.1–90.0% 감소를 보고했습니다. Qwen3.5 모델과 360개 에피소드의 결과이며 모든 고객의 절감이나 24시간 연속 시험을 입증하지는 않습니다. 일부 학습 작업에서는 토큰이 줄어도 호출이 늘었습니다. 실제 워크로드에서 품질, 누락 이벤트, 지연, 관측 비용을 비교해야 합니다." /></p>
        <p className="mt-4 reading text-ink-secondary"><LocalizedText en="The standard refund request window is 30 calendar days. Approval revokes the affected order’s license, downloads and activation renewal before or with repayment. Offline access ends at the next validation or configured expiry. Mandatory consumer rights remain applicable. Updates and support are included only where the order says so." ko="표준 환불 요청 기간은 30일입니다. 승인 시 환급 전 또는 동시에 해당 주문의 라이선스, 다운로드, 활성화 갱신 권한을 취소합니다. 오프라인 접근은 다음 검증 또는 설정된 만료 시 종료됩니다. 법정 소비자 권리는 유지됩니다. 업데이트와 지원은 주문에 명시된 경우에만 포함됩니다." /></p>
        <Link href="/workspace/astop" className="mt-6 inline-flex min-h-11 items-center rounded-md border border-border-medium px-5 py-3"><LocalizedText en="View ASTOP access" ko="ASTOP 접근 보기" /></Link>
      </div></section>

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
