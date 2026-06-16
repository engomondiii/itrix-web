import { GeometricAccent } from '@/components/visual/GeometricAccent';

const STAGES = ['Representation', 'Observation', 'Transfer', 'Execution', 'Reconstruction'];

/** The unified pipeline that ties AXIOM, CRE, and FQNM together. */
export function UnifiedViewDiagram() {
  return (
    <div className="rounded-lg border border-line bg-surface p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-stretch md:gap-2">
        {STAGES.map((stage, i) => (
          <div key={stage} className="flex flex-1 items-center gap-2">
            <div className="flex-1 rounded-md border border-line bg-surface-warm px-3 py-4 text-center">
              <span className="block font-mono text-micro text-sapphire-600">0{i + 1}</span>
              <span className="mt-1 block text-secondary font-medium text-ink-900">{stage}</span>
            </div>
            {i < STAGES.length - 1 ? <span aria-hidden className="hidden text-ink-300 md:inline">→</span> : null}
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-3 border-t border-line-subtle pt-5 text-caption text-ink-500 md:grid-cols-3">
        <span className="flex items-center gap-2"><GeometricAccent shape="square" size={14} /> Linear algebra carries operator meaning</span>
        <span className="flex items-center gap-2"><GeometricAccent shape="cross" size={14} /> Topology carries connectivity and conservation</span>
        <span className="flex items-center gap-2"><GeometricAccent shape="corner" size={14} /> Geometry carries projection and embedding</span>
      </div>
    </div>
  );
}
