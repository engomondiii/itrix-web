import { TECHNOLOGIES } from '@/constants/products';
import { DisclosureLevelBadge } from './DisclosureLevelBadge';
import { PatentReference } from './PatentReference';

const ROWS = ['axiom', 'cre', 'fqnm'] as const;

/** AXIOM / CRE / FQNM at a glance — public framing only; mechanism stays gated. */
export function TechnologyComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[640px] border-collapse bg-surface text-left">
        <thead>
          <tr className="bg-surface-sunken text-caption text-ink-700">
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
              <tr key={key} className="border-t border-line-subtle align-top">
                <td className="px-4 py-4">
                  <span className="block text-card-title text-indigo-950">{t.name}</span>
                  <span className="text-caption text-ink-400">{t.expansion}</span>
                </td>
                <td className="px-4 py-4 text-secondary text-ink-700">{t.gap}</td>
                <td className="px-4 py-4 text-secondary text-ink-700">{t.oneLiner}</td>
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
