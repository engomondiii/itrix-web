import { LocalizedText as L } from '@/components/i18n/LocalizedText';

export function AstopJourneyGuide() {
  return <section className="space-y-4 rounded border border-border-medium p-4">
    <h2 className="text-xl font-semibold"><L en="Discover → Acquire → Activate → Prove → Decide → Continue" ko="탐색 → 구매 → 활성화 → 검증 → 결정 → 지속" /></h2>
    <p><L en="Discovery checks plausibility, not proven savings. Complete verified identity, exact License Order acceptance and payment before delivery. Activate using the signed production build, your account and License ID." ko="탐색은 가능성을 확인하며 절감 효과를 입증하지 않습니다. 제공 전에 신원 확인, 정확한 License Order 동의 및 결제를 완료하세요. 서명된 배포 빌드, 계정 및 License ID로 활성화하세요." /></p>
    <p><L en="Controlled delivery → Install → Activate → Connect → Run. Check your entitlement status and the renewal and expiry dates shown for your environment. Follow the required activation or replacement action. The Protection Policy governs the detailed controls; the License Order governs your rights." ko="통제된 제공 → 설치 → 활성화 → 연결 → 실행. 권한 상태와 환경에 표시된 갱신·만료일을 확인하고 필요한 활성화 또는 교체 조치를 따르세요. 세부 통제는 Protection Policy, 사용 권리는 License Order가 규정합니다." /></p>
    <details><summary><L en="Prove value on your workload" ko="실제 워크로드에서 가치 검증" /></summary>
      <ol className="mt-3 list-decimal space-y-2 pl-6">
        <li><L en="Define the task, decisions and events that must never be missed or delayed. Record the model, hardware, software, workload and baseline version." ko="작업, 의사결정, 누락 또는 지연되면 안 되는 이벤트를 정의하세요. 모델, 하드웨어, 소프트웨어, 워크로드 및 기준 실행 버전을 기록하세요." /></li>
        <li><L en="Run comparable baseline and ASTOP cases. Check task success, missed events, false wakeups and decision latency before counting savings." ko="비교 가능한 기준 실행과 ASTOP 실행을 수행하세요. 절감량을 계산하기 전에 작업 성공, 누락 이벤트, 불필요한 호출 및 판단 지연을 확인하세요." /></li>
        <li><L en="Record observation tokens, model calls, delivered bytes and observer CPU, memory and I/O cost when measurable. Mark unavailable values as unknown; separate estimates and qualitative feedback from measured results." ko="측정 가능한 관측 토큰, 모델 호출, 전달 바이트 및 관측기의 CPU·메모리·I/O 비용을 기록하세요. 이용할 수 없는 값은 미확인으로 표시하고 추정치·정성 의견과 측정 결과를 구분하세요." /></li>
        <li><L en="Continue only when decision fidelity is preserved and the total benefit exceeds the added cost. Otherwise tune and retest, choose another workload, stop, or request an eligible refund. Reprove value before expansion." ko="의사결정 충실성을 유지하고 전체 이익이 추가 비용보다 클 때만 계속하세요. 그렇지 않으면 조정 및 재시험, 다른 워크로드 선택, 중단 또는 적격 환불 요청을 고려하세요. 확장 전에 가치를 다시 검증하세요." /></li>
      </ol>
      <p className="mt-3"><L en="Published benchmarks are not your proof. Keep raw workload data private. Share only approved summaries through your agreed support channel, including negative results and where you stopped. Use the decision form for your license to record your outcome. Reports remain customer-reported until separately reviewed; they are not automatically published as shared knowledge." ko="공개 벤치마크는 고객 워크로드의 증명이 아닙니다. 원시 워크로드 데이터는 비공개로 유지하세요. 실패 결과와 중단 지점을 포함한 승인된 요약만 합의된 지원 채널로 공유하세요. 라이선스의 결정 양식에 결과를 기록하세요. 별도 검토 전까지 고객 보고로 유지되며 공유 지식으로 자동 공개되지 않습니다." /></p>
    </details>
  </section>;
}
