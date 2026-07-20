import { CENTER_COPY } from '@/lib/content/centerCopy';

/**
 * The supporting line beneath the main question (§2.1 element 3).
 *
 *   "Start with the workload, system constraint, or strategic opportunity you
 *    came to itriX to examine."
 *
 * Extracted from MainQuestion so the copy has ONE home and the seven approved
 * centre elements each map to exactly one component. That matters for the
 * minimal-landing acceptance test, which asserts what renders and in what order.
 */
export function SupportingLine() {
  return <p className="arrival__support">{CENTER_COPY.supportingLine}</p>;
}
