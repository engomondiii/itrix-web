import { PRODUCTS } from '@/constants/products';

const ROWS: { dim: string; compute: string; core: string }[] = [
  { dim: 'Layer', compute: 'Representation', core: 'Runtime / execution' },
  { dim: 'Question it answers', compute: 'What form should this computation take?', core: 'Can the transformed form actually run?' },
  { dim: 'Output', compute: 'A transformation hypothesis', core: 'A validated proof-of-concept' },
  { dim: 'Primary buyer', compute: PRODUCTS.alpha_compute.buyer, core: PRODUCTS.alpha_core.buyer },
];

/** The Compute/Core boundary — identical framing across every surface. */
export function ProductBoundaryTable() {
  return (
    <div className="overflow-x-auto rounded-lg border border-border-medium">
      <table className="w-full min-w-[600px] border-collapse bg-surface text-left">
        <thead>
          <tr className="bg-soft text-caption text-ink-secondary">
            <th className="px-4 py-3 font-semibold"> </th>
            <th className="px-4 py-3 font-semibold">ALPHA Compute</th>
            <th className="px-4 py-3 font-semibold">ALPHA Core</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.dim} className="border-t border-border-soft align-top">
              <td className="px-4 py-4 text-micro font-semibold uppercase tracking-[0.06em] text-ink-secondary">{r.dim}</td>
              <td className="px-4 py-4 text-secondary text-ink-secondary">{r.compute}</td>
              <td className="px-4 py-4 text-secondary text-ink-secondary">{r.core}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
