import { GeometricAccent } from '@/components/visual/GeometricAccent';
import { LocalizedText } from '@/components/i18n/LocalizedText';

const STAGES = [
  { en: 'Representation', ko: '표현' },
  { en: 'Observation', ko: '관측' },
  { en: 'Transfer', ko: '전달' },
  { en: 'Execution', ko: '실행' },
  { en: 'Reconstruction', ko: '재구성' },
];

/** The unified pipeline that ties AXIOM, CRE, and FQNM together. */
export function UnifiedViewDiagram() {
  return (
    <div className="rounded-lg border border-border-medium bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
        {STAGES.map((stage, i) => (
          <div key={stage.en} className="flex flex-1 items-center gap-2">
            <div className="flex-1 rounded-md border border-border-medium bg-surface px-3 py-4 text-center">
              <span className="block font-mono text-micro text-ink-primary">0{i + 1}</span>
              <span className="mt-1 block text-secondary font-medium text-ink-primary"><LocalizedText en={stage.en} ko={stage.ko} /></span>
            </div>
            {i < STAGES.length - 1 ? <span aria-hidden className="hidden text-ink-muted md:inline">→</span> : null}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 border-t border-border-soft pt-5 text-caption text-ink-secondary md:grid-cols-3">
        <span className="flex items-center gap-2"><GeometricAccent shape="square" size={14} /> <LocalizedText en="Linear algebra carries operator meaning" ko="선형대수는 연산자의 의미를 보존합니다" /></span>
        <span className="flex items-center gap-2"><GeometricAccent shape="cross" size={14} /> <LocalizedText en="Topology carries connectivity and conservation" ko="위상은 연결성과 보존 구조를 담습니다" /></span>
        <span className="flex items-center gap-2"><GeometricAccent shape="corner" size={14} /> <LocalizedText en="Geometry carries projection and embedding" ko="기하는 투영과 임베딩을 담습니다" /></span>
      </div>
    </div>
  );
}
