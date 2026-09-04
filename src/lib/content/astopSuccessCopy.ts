export const ASTOP_SUCCESS_COPY = {
  en: {
    title: 'ASTOP customer success',
    intro: 'Customer-visible ASTOP progress, verified value, deployment scope and governed next actions.',
    unavailable: 'N/A',
    labels: {
      progression: 'Progression', ttfv: 'Time to first value', value: 'Verified value', basis: 'Value basis',
      deployment: 'Deployment scope', readiness: 'Readiness', lo: 'LO status', licensedScope: 'Licensed scope',
      entitlement: 'Entitlement', entitlementExpiry: 'Entitlement expiry', support: 'Support', expansion: 'Expansion',
      nextAction: 'Next action', eligibility: 'Eligibility', assessment: 'Assessment state', fee: 'Fee state',
      waiver: 'Waiver state', assessmentEntitlement: 'Assessment entitlement', alphaCore: 'ALPHA Core',
    },
    sections: { assessment: 'ALPHA Compute assessment', alphaCore: 'ALPHA Core' },
    measured: 'Measured', estimated: 'Estimated', mixed: 'Measured and estimated',
    seconds: 'seconds', minutes: 'minutes', hours: 'hours',
    actionRequired: 'Action required',
  },
  ko: {
    title: 'ASTOP 고객 성공',
    intro: '고객에게 공개 가능한 ASTOP 진행 상태, 검증된 가치, 배포 범위와 승인된 다음 단계입니다.',
    unavailable: '해당 없음',
    labels: {
      progression: '진행 상태', ttfv: '최초 가치 확인 시간', value: '검증된 가치', basis: '가치 산정 기준',
      deployment: '배포 범위', readiness: '준비 상태', lo: 'LO 상태', licensedScope: '라이선스 범위',
      entitlement: '사용 권한', entitlementExpiry: '사용 권한 만료', support: '지원', expansion: '확장 상태',
      nextAction: '다음 조치', eligibility: '적격성', assessment: '평가 상태', fee: '비용 상태',
      waiver: '면제 상태', assessmentEntitlement: '평가 사용 권한', alphaCore: 'ALPHA Core',
    },
    sections: { assessment: 'ALPHA Compute 평가', alphaCore: 'ALPHA Core' },
    measured: '측정값', estimated: '추정값', mixed: '측정값 및 추정값',
    seconds: '초', minutes: '분', hours: '시간',
    actionRequired: '조치 필요',
  },
} as const;

export type AstopSuccessCopy = typeof ASTOP_SUCCESS_COPY.en | typeof ASTOP_SUCCESS_COPY.ko;
