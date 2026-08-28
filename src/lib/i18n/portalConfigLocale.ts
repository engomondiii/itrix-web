import type { AppLocale } from '@/store/localeStore';
import type { PortalStage, EvaluationStage, PoCMilestone } from '@/types/portal.types';

const NAV_KO: Record<string,string> = {
  overview:'홈', success:'내 워크스페이스', messages:'메시지', briefing:'브리핑', documents:'문서', evaluation:'평가', assessment:'어세스먼트', poc:'개념검증(PoC)', integration:'통합', settings:'설정',
  'success-home':'개요', outcomes:'성과', deployments:'배포', support:'지원', knowledge:'학습', meetings:'미팅', governance:'의사결정', feedback:'피드백',
};
export function portalNavLabel(locale: AppLocale, key: string, english: string) { return locale === 'ko' ? (NAV_KO[key] ?? english) : english; }

export const PORTAL_STAGE_LINE_KO: Record<PortalStage,string> = {
  review_ready:'리뷰를 읽을 수 있습니다.', briefing_preparing:'itriX 팀이 사례별 브리핑을 준비하고 있습니다.', conversation_arranging:'기밀 대화를 준비하고 있습니다.', evaluation_in_progress:'평가가 진행 중입니다.', poc_underway:'개념검증(PoC)이 진행 중입니다.',
};
export const EVALUATION_STAGE_LINE_KO: Record<EvaluationStage,string> = {
  requested:'요청됨 — itriX 팀이 범위와 다음 단계를 확인하고 있습니다.', scoping:'범위 정의 — 워크로드, 답해야 할 질문, KPI를 합의하고 있습니다.', in_progress:'진행 중 — 평가를 수행하고 있습니다. 근거가 확정되는 대로 공유합니다.', report_ready:'보고서 준비 완료 — 평가 보고서를 문서에서 확인할 수 있습니다.',
};
export const POC_MILESTONE_LINE_KO: Record<PoCMilestone,string> = {
  planning:'계획 — 워크로드, 성공 기준, 검증 경계를 합의합니다.', setup:'설정 — 환경과 기준선을 준비합니다.', execution:'실행 — 합의된 KPI에 따라 시험하고 결과를 기록합니다.', review:'검토 — 결과를 함께 살펴보고 의미를 합의합니다.', decision:'의사결정 — 통합, 라이선스 또는 추가 작업 여부를 별도로 결정합니다.',
};
