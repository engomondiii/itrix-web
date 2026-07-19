import { TECHNOLOGIES } from '@/constants/products';
import { DisclosureLevelBadge } from './DisclosureLevelBadge';
import { PatentReference } from './PatentReference';

const ROWS = ['axiom', 'cre', 'fqnm'] as const;

/** AXIOM / CRE / FQNM at a glance — public framing only; mechanism stays gated. */
export function TechnologyComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-medium">
      <table className="w-full min-w-[640px] border-collapse bg-surface text-left">
        <thead>
          <tr className="bg-soft text-caption text-ink-secondary">
            <th className="px-4 py-3 font-semibold">Technology</th>
            <th className="px-4 py-3 font-semibold">Gap addressed</th>
            <th className="px-4 py-3 font-semibold">What it does (public)</th>
            <th className="px-4 py-3 font-semibold">Public detail</th>
            <th className="px-4 py-3 font-semibold">Patent</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((key) => {
            const t = TECHNOLOGIES[key];
            return (
              <tr key={key} className="border-t border-border-soft align-top">
                <td className="px-4 py-4">
                  <span className="block text-card-title text-structure-900">{t.name}</span>
                  <span className="text-caption text-ink-secondary">{t.expansion}</span>
                </td>
                <td className="px-4 py-4 text-secondary text-ink-secondary">{t.gap}</td>
                <td className="px-4 py-4 text-secondary text-ink-secondary">{t.oneLiner}</td>
                <td className="px-4 py-4"><DisclosureLevelBadge level="controlled_public" /></td>
                <td className="px-4 py-4">{t.patentRef ? <PatentReference patentRef={t.patentRef} label="" /> : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
