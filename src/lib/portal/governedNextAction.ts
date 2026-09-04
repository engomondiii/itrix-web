export type PortalLocale = 'en' | 'ko';

export interface GovernedCta {
  key: string;
  href: string;
  label: string;
}

type CtaDefinition = { href: string; en: string; ko: string };

/**
 * ONE canonical UI map for backend-governed next actions.
 *
 * This map translates an action the backend already chose. It never chooses an
 * action from entitlement, fee, readiness, product usage or any other local state.
 */
const CTA_MAP: Record<string, CtaDefinition> = {
  talk_to_itrix: { href: '/workspace/messages', en: 'Talk to itriX', ko: 'itriX와 대화하기' },
  contact_itrix: { href: '/workspace/messages', en: 'Talk to itriX', ko: 'itriX와 대화하기' },
  contact_support: { href: '/workspace/success/support', en: 'Open support', ko: '지원 열기' },
  review_support: { href: '/workspace/success/support', en: 'Review support', ko: '지원 확인하기' },
  review_deployment: { href: '/workspace/success/deployments', en: 'Review deployment', ko: '배포 상태 확인하기' },
  continue_deployment: { href: '/workspace/success/deployments', en: 'Continue deployment work', ko: '배포 작업 계속하기' },
  prepare_lo: { href: '/workspace/messages', en: 'Prepare the LO', ko: 'LO 준비하기' },
  review_lo: { href: '/workspace/messages', en: 'Review the LO', ko: 'LO 검토하기' },
  negotiate_lo: { href: '/workspace/messages', en: 'Continue LO discussion', ko: 'LO 협의 계속하기' },
  execute_lo: { href: '/workspace/messages', en: 'Complete the LO', ko: 'LO 체결 진행하기' },
  complete_entitlement: { href: '/workspace/messages', en: 'Complete entitlement setup', ko: '사용 권한 설정 완료하기' },
  review_entitlement: { href: '/workspace/messages', en: 'Review entitlement', ko: '사용 권한 확인하기' },
  renew_entitlement: { href: '/workspace/messages', en: 'Discuss renewal', ko: '갱신 논의하기' },
  review_verified_value: { href: '/workspace/success/outcomes', en: 'Review verified value', ko: '검증된 가치 확인하기' },
  review_alpha_assessment: { href: '/workspace/assessment', en: 'Review ALPHA assessment', ko: 'ALPHA 평가 확인하기' },
  continue_alpha_assessment: { href: '/workspace/assessment', en: 'Continue ALPHA assessment', ko: 'ALPHA 평가 계속하기' },
  review_alpha_core: { href: '/workspace/messages', en: 'Discuss ALPHA Core', ko: 'ALPHA Core 논의하기' },
  review_expansion: { href: '/workspace/messages', en: 'Review the governed next step', ko: '승인된 다음 단계 검토하기' },
};

function canonicalKey(action: string): string {
  return action.trim().replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
}

export function getGovernedCta(action: string | null, locale: PortalLocale): GovernedCta | null {
  if (!action) return null;
  const key = canonicalKey(action);
  const definition = CTA_MAP[key];
  if (!definition) return null;
  return { key, href: definition.href, label: locale === 'ko' ? definition.ko : definition.en };
}
