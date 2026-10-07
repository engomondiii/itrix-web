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
  ['Discover', '탐색'], ['Enroll', '등록'], ['7-Day Trial & Prove', '7일 체험 및 검증'],
  ['Join', '가입'], ['Continue', '지속'], ['Renew', '갱신'],
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
            <SectionLabel><LocalizedText en="Individual and Organization Memberships" ko="개인 및 조직 멤버십" /></SectionLabel>
            <p className="mt-4 reading text-ink-secondary">
              <LocalizedText
                en="Try ASTOP for seven days without payment after verified enrollment and trial-term acceptance. After the full trial, choose Individual Membership at USD 20 per year or Organization Membership at USD 16 per named user per year (minimum two). An eligible Branch referral gives an individual 10% off; discounts do not stack. Join requires your explicit choice, accepted License Order, annual automatic-renewal authorization and successful payment."
                ko="신원 확인과 체험 약관 동의 후 결제 없이 7일간 ASTOP을 체험하세요. 전체 체험 기간 후 개인 멤버십은 연 USD 20, 조직 멤버십은 지정 사용자당 연 USD 16(최소 2명)입니다. 적격 Branch 추천 개인 할인은 10%이며 중복되지 않습니다. 유료 가입에는 명시적 선택, License Order 동의, 연간 자동 갱신 승인 및 결제가 필요합니다."
              />
            </p>
          </div>
        </div>
      </section>

      <section className="section border-b border-border-medium bg-canvas">
        <div className="container-page max-w-4xl">
          <SectionLabel><LocalizedText en="Your ASTOP journey" ko="ASTOP 이용 여정" /></SectionLabel>
          <ol className="mt-6 grid gap-3 md:grid-cols-3">
            {stages.map(([en, ko], i) => (
              <li key={en} className="rounded-md border border-border-medium bg-surface p-4">
                <span className="text-micro text-ink-secondary">0{i + 1}</span>
                <p className="mt-2 text-secondary font-semibold text-ink-primary"><LocalizedText en={en} ko={ko} /></p>
              </li>
            ))}
          </ol>
          <p className="mt-6 reading text-ink-secondary"><LocalizedText en="Before buying, check plausibility: do you repeatedly observe a long-running task, do meaningful changes occur infrequently, is evidence available through logs, APIs, files or counters, and can you compare a baseline during the free trial? This check is not proof. Ordinary access does not require a meeting or enterprise evaluation." ko="구매 전에 장시간 작업을 반복 관측하는지, 의미 있는 변화가 드문지, 로그·API·파일·카운터로 근거를 얻을 수 있는지, 무료 체험 중 기준 실행과 비교할 수 있는지 확인하세요. 이는 가능성 확인이며 효과 입증이 아닙니다. 일반 구매에는 회의나 엔터프라이즈 평가가 필수가 아닙니다." /></p>
          <p className="mt-4 reading text-ink-secondary"><LocalizedText en="During the seven-day trial, activate and compare a real workload. After the full trial, explicitly choose paid membership or stop. There is no automatic trial charge. Recheck value before expanding to a materially different workload. ASTOP keeps low-level sensing active and reduces unnecessary reasoning wakeups; it does not replace your runtime or scheduler." ko="7일 체험 중 활성화하고 실제 워크로드를 비교하세요. 전체 체험 후 유료 가입 또는 중단을 명시적으로 선택하세요. 체험은 자동으로 청구되지 않습니다. 다른 워크로드로 확장하기 전에 가치를 다시 검증하세요. ASTOP은 저수준 감지를 유지하면서 불필요한 추론 호출을 줄이며 런타임이나 스케줄러를 대체하지 않습니다." /></p>
          <p className="mt-4 reading text-ink-secondary"><LocalizedText en="Controlled delivery → Install → Activate → Connect → Run. Use your valid account and License ID, check activation status and follow any required renewal or environment-replacement action. ASTOP is licensed, not sold; possessing an installer alone does not grant permission to run it. Detailed activation controls are governed by the Protection Policy." ko="통제된 제공 → 설치 → 활성화 → 연결 → 실행. 유효한 계정과 License ID를 사용하고 활성화 상태 및 필요한 갱신·환경 교체 조치를 확인하세요. ASTOP은 라이선스로 제공되며 설치 파일 소지만으로 실행 권한이 생기지 않습니다. 세부 활성화 통제는 Protection Policy가 규정합니다." /></p>
          <details className="mt-6 rounded border border-border-medium p-4"><summary><LocalizedText en="When a protected enterprise review is needed" ko="보호된 엔터프라이즈 검토가 필요한 경우" /></summary><p className="mt-3 reading"><LocalizedText en="Use a separately scoped review for specific security, procurement, private deployment, extended-offline or protected-scope needs that ordinary access cannot address. A large organization can still use the ordinary route. Agree a workload, owner, baseline, fidelity criteria, authorized scope, effort limit and next decision before protected work. Evaluation is not a third ordinary license type." ko="일반 접근으로 해결할 수 없는 보안, 조달, 비공개 배포, 장기 오프라인 또는 보호 범위 요구는 별도 검토를 진행합니다. 대기업도 일반 경로를 사용할 수 있습니다. 보호 작업 전에 워크로드, 담당자, 기준 실행, 충실성 기준, 승인 범위, 투입 한도 및 다음 결정을 합의하세요. 평가는 세 번째 일반 라이선스 유형이 아닙니다." /></p></details>
        </div>
      </section>

      <section className="section border-b border-border-medium bg-canvas"><div className="container-page max-w-4xl">
        <SectionLabel><LocalizedText en="Evidence and purchase terms" ko="근거 및 구매 조건" /></SectionLabel>
        <p className="mt-4 reading text-ink-secondary"><LocalizedText en="White Paper v2.3 reports 58.8–69.2% fewer observation-induced tokens, 23.1–30.1% fewer model calls and 88.1–90.0% fewer delivered bytes in its finite tested panel. The panel used Qwen3.5 models and 360 episodes; it is not a universal customer saving or a 24-hour endurance result. Some training workloads used more calls even when tokens fell. Compare task quality, missed events, delay and monitoring cost in your own workload." ko="White Paper v2.3의 제한된 시험군에서는 관측 관련 토큰 58.8–69.2%, 모델 호출 23.1–30.1%, 전달 바이트 88.1–90.0% 감소를 보고했습니다. Qwen3.5 모델과 360개 에피소드의 결과이며 모든 고객의 절감이나 24시간 연속 시험을 입증하지는 않습니다. 일부 학습 작업에서는 토큰이 줄어도 호출이 늘었습니다. 실제 워크로드에서 품질, 누락 이벤트, 지연, 관측 비용을 비교해야 합니다." /></p>
        <p className="mt-4 reading text-ink-secondary"><LocalizedText en="Annual membership renews automatically only with your authorization unless cancelled under the License Order. Refund requests may be made within 14 calendar days after the applicable membership payment. Use the applicable refund path when eligible. Legal termination, renewal, offline validity and running-session treatment are governed by the License Order and Protection Policy. Mandatory consumer rights remain applicable; updates and support are included only where the order says so." ko="연간 멤버십은 승인한 조건에 따라 해지하지 않으면 자동 갱신됩니다. 해당 멤버십 결제 후 14일 이내 환불을 요청할 수 있습니다. 적격한 경우 해당 환불 경로를 이용하세요. 법적 종료, 갱신, 오프라인 유효 기간 및 실행 중인 세션 처리는 License Order와 Protection Policy가 규정합니다. 법정 소비자 권리는 유지되며 업데이트·지원은 주문에 포함된 범위에만 적용됩니다." /></p>
        <Link href="/workspace/astop" className="mt-6 inline-flex min-h-11 items-center rounded-md border border-border-medium px-5 py-3"><LocalizedText en="Explore trial and membership" ko="체험 및 멤버십 보기" /></Link>
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
