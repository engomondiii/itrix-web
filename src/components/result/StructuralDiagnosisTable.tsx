import { SectionLabel } from '@/components/ui/SectionLabel';
import { pressureLabel } from '@/lib/content/pressureSignals';
import type { DiagnosisRow } from '@/types/result.types';

export function StructuralDiagnosisTable({ rows }: { rows: DiagnosisRow[] }) {
  if (rows.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <SectionLabel>Structural diagnosis</SectionLabel>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[560px] border-collapse bg-surface text-left">
          <thead>
            <tr className="bg-surface-sunken text-caption text-ink-700">
              <th className="px-4 py-3 font-semibold">Pressure</th>
              <th className="px-4 py-3 font-semibold">What you observe</th>
              <th className="px-4 py-3 font-semibold">How iTrix reads it</th>
              <th className="px-4 py-3 font-semibold">ALPHA role</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.pressure} className="border-t border-line-subtle align-top">
                <td className="px-4 py-4 text-secondary font-medium text-indigo-950">{pressureLabel(r.pressure)}</td>
                <td className="px-4 py-4 text-secondary text-ink-700">{r.observation}</td>
                <td className="px-4 py-4 text-secondary text-ink-700">{r.itrixInterpretation}</td>
                <td className="px-4 py-4 text-secondary text-ink-700">{r.alphaRole}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
