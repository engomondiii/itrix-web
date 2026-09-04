export type PortalLocale = 'en' | 'ko';

export interface GovernedCta {
  key: string;
  href: string;
  label: string;
}

type CtaDefinition = { href: string; en: string; ko: string };

/**
 * ONE canonical UI map for actions chosen by the backend commercial-progression and
 * Customer Success services. The frontend translates and routes; it never infers
 * eligibility or advances product state.
 */
const CTA_MAP: Record<string, CtaDefinition> = {
  resolve_blocking_support: { href: '/workspace/success/support', en: 'Resolve blocking support', ko: '차단 중인 지원 이슈 해결하기' },
  continue_success_plan: { href: '/workspace/messages', en: 'Continue with itriX', ko: 'itriX와 다음 단계 이어가기' },
  finalize_license_out_terms: { href: '/workspace/messages', en: 'Finalize License-Out terms', ko: 'License-Out 조건 확정하기' },
  execute_license_out: { href: '/workspace/messages', en: 'Complete the License-Out', ko: 'License-Out 체결 진행하기' },
  activate_entitlement: { href: '/workspace/messages', en: 'Complete entitlement activation', ko: '사용 권한 활성화 완료하기' },
  progress_alpha_core_opportunity: { href: '/workspace/messages', en: 'Continue the ALPHA Core opportunity', ko: 'ALPHA Core 기회 이어가기' },
  resolve_alpha_core_gate: { href: '/workspace/messages', en: 'Review ALPHA Core requirements', ko: 'ALPHA Core 요건 확인하기' },
  resolve_alpha_compute_gate: { href: '/workspace/assessment', en: 'Review ALPHA Compute requirements', ko: 'ALPHA Compute 요건 확인하기' },
  complete_alpha_core_case: { href: '/workspace/messages', en: 'Complete the ALPHA Core case', ko: 'ALPHA Core 검토 근거 완료하기' },
  open_alpha_core_opportunity: { href: '/workspace/messages', en: 'Discuss an ALPHA Core opportunity', ko: 'ALPHA Core 기회 논의하기' },
  open_alpha_compute_assessment: { href: '/workspace/assessment', en: 'Review ALPHA Compute assessment', ko: 'ALPHA Compute 평가 확인하기' },
  complete_astop_verified_value: { href: '/workspace/evaluation', en: 'Complete ASTOP value verification', ko: 'ASTOP 가치 검증 완료하기' },
  continue_discovery: { href: '/workspace/messages', en: 'Continue discovery with itriX', ko: 'itriX와 탐색 계속하기' },
};

const FALLBACK: CtaDefinition = {
  href: '/workspace/messages',
  en: 'Review the next step with itriX',
  ko: 'itriX와 다음 단계 확인하기',
};

function canonicalKey(action: string): string {
  return action.trim().replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[\s-]+/g, '_').toLowerCase();
}

export function getGovernedCta(action: string | null, locale: PortalLocale): GovernedCta | null {
  if (!action) return null;
  const key = canonicalKey(action);
  if (!key || key === 'none') return null;
  const definition = CTA_MAP[key] ?? FALLBACK;
  return { key, href: definition.href, label: locale === 'ko' ? definition.ko : definition.en };
}
