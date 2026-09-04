'use client';

import { usePortalAuth } from '@/hooks/usePortalAuth';
import { useLocaleStore } from '@/store/localeStore';

const TITLE_KO: Record<string,string> = {
  'Your workspace':'워크스페이스',
  'Assessment':'ALPHA Compute 평가',
  'Briefing':'브리핑',
  'Documents':'문서',
  'Evaluation':'평가',
  'Integration':'통합',
  'Messages':'메시지',
  'Proof of concept':'개념검증(PoC)',
  'Settings':'설정',
  'Outcomes':'성과',
  'Deployment health':'배포 상태',
  'Support':'지원',
  'Learning and documentation':'학습 및 문서',
  'Meetings':'미팅',
  'Decision log':'의사결정 기록',
  'Deployments':'배포',
  'Decisions':'의사결정',
  'Learning':'학습',
  'Feedback':'피드백',
};
/** Slim workspace top bar: the current client + organization. No public chrome. */
export function PortalTopbar({ title }: { title: string }) {
  const { client } = usePortalAuth();
  const ko = useLocaleStore((s)=>s.locale)==='ko';
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border-medium bg-surface px-6 py-4">
      <h1 className="text-web-h3 text-structure-900">{ko ? (TITLE_KO[title] ?? title) : title}</h1>
      {client ? <div className="text-right"><p className="text-secondary font-medium text-ink-primary">{client.fullName ?? client.email}</p>{client.organization ? <p className="text-caption text-ink-secondary">{client.organization}</p> : null}</div> : null}
    </header>
  );
}
