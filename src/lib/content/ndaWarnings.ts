/**
 * Standard, on-message gating copy for content that sits behind the NDA boundary.
 * Keeps the public surface honest: public framing is shown, mechanism and numbers are not.
 */
export const NDA_WARNINGS = {
  benchmarks:
    'Specific benchmark figures are shared only when explicitly authorized for the current work and validated per workload. An NDA may protect that disclosure but does not authorize it by itself.',
  mechanism:
    'The underlying mechanism is described publicly only at a structural level. Restricted implementation detail is shared only with explicit content authorization and any required agreement in place.',
  pricing:
    'Commercial terms are never quoted here. Pricing and licensing structure are handled directly by the team.',
  exclusivity:
    'Exclusivity, strategic rights and their economics are not public defaults. They exist only if an applicable written agreement expressly provides them.',
  results:
    'Any advantage is stated conditionally and only to the strength supported by the applicable evidence. A PoC is one possible later validation stage, never an automatic requirement.',
} as const;

export type NdaWarningKey = keyof typeof NDA_WARNINGS;

export const NDA_WARNINGS_KO = {
  benchmarks:'구체적인 벤치마크 수치는 현재 작업에 명시적으로 승인되고 워크로드별로 검증된 경우에만 공유됩니다. NDA는 해당 공개를 보호할 수 있지만 그 자체로 승인하지는 않습니다.',
  mechanism:'기반 메커니즘은 공개적으로 구조 수준에서만 설명합니다. 제한된 구현 세부사항은 명시적인 콘텐츠 승인과 필요한 계약이 갖춰진 경우에만 공유됩니다.',
  pricing:'상업 조건은 이곳에서 제시하지 않습니다. 가격과 라이선스 구조는 담당 팀과 직접 논의합니다.',
  exclusivity:'독점권, 전략적 권리, 관련 경제조건은 공개 기본값이 아닙니다. 해당 서면 계약이 명시적으로 정한 경우에만 존재합니다.',
  results:'가능한 이점은 적용 가능한 근거가 뒷받침하는 강도까지만 조건부로 표현합니다. PoC는 가능한 후속 검증 단계 중 하나이며 자동 요구사항이 아닙니다.',
} as const;
