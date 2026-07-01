/**
 * Information drawers — closed by default ("pulled, not pushed", Playbook §00G).
 * Copy is EXACT from the playbook; keep it qualitative and claim-safe (no numbers,
 * prices, guarantees, or mechanism detail). Opening a drawer logs drawer.opened.
 */

export type DrawerDisclosure = 'public' | 'controlled_public';

export interface InfoDrawer {
  id: string;
  title: string;
  body: string;
  disclosure: DrawerDisclosure;
}

/** The seven standard drawers (Playbook §00G / Architecture §16.3). */
export const INFO_DRAWERS: InfoDrawer[] = [
  {
    id: 'what-is-alpha-compute',
    title: 'What is ALPHA Compute?',
    disclosure: 'public',
    body:
      'ALPHA Compute is the part of itriX that looks at the form of a computation before it runs. Instead of speeding up the same work, it examines whether the work can be rewritten into a more efficient representation first — with any benefit validated through evaluation, not promised.',
  },
  {
    id: 'what-is-alpha-core',
    title: 'What is ALPHA Core?',
    disclosure: 'public',
    body:
      'ALPHA Core is the part that executes the rewritten computation. Once ALPHA Compute has reshaped a workload, ALPHA Core runs it on the target hardware. The two are used together or separately, depending on the case.',
  },
  {
    id: 'what-is-an-assessment',
    title: 'What is an Alpha Compute Assessment?',
    disclosure: 'public',
    body:
      'An Alpha Compute Assessment is a focused, paid engineering study of one of your workloads. We look at where your computation crosses unnecessary boundaries and produce a Boundary Waste Map, a prioritised view of where Alpha Compute may help, and a recommendation for a proof of concept. You receive a clear engineering result even if you choose not to go further. It is arranged after an NDA; details are discussed privately.',
  },
  {
    id: 'what-is-a-boundary-waste-map',
    title: 'What is a Boundary Waste Map?',
    disclosure: 'public',
    body:
      'A Boundary Waste Map is the main deliverable of an Assessment. It shows where a workload spends effort crossing avoidable boundaries — moving data, changing memory layout, switching number formats, or shifting between devices — and which of those crossings may be worth removing. It turns a vague “this feels slow or expensive” into a clear, prioritised picture.',
  },
  {
    id: 'before-an-nda',
    title: 'What can be discussed before an NDA?',
    disclosure: 'controlled_public',
    body:
      'Before an NDA we can talk about your problem in general terms, the kind of bottleneck involved, which itriX direction may be relevant, and what an evaluation could measure. We ask that you share only non-confidential descriptions until an NDA is in place.',
  },
  {
    id: 'after-an-nda',
    title: 'What happens after an NDA?',
    disclosure: 'controlled_public',
    body:
      'With an NDA in place, the conversation can go deeper: a confidential technical briefing, a scoped Alpha Compute Assessment on your workload, and access to a private data room. The path typically continues toward a proof of concept and, where it fits, a license.',
  },
  {
    id: 'commercial-pathway',
    title: 'How does the commercial pathway work?',
    disclosure: 'public',
    body:
      'itriX licenses its technology to partners rather than selling a finished product. A typical path runs: free Compute Bottleneck Review → confidential conversation and NDA → paid Alpha Compute Assessment (a Boundary Waste Map of one workload) → paid proof of concept → integration → license. Exclusive arrangements exist for selected strategic partners and are discussed privately.',
  },
];

/** The quiet intro line above the Learn-more row. */
export const LEARN_MORE_INTRO = 'Learn more';

export function getDrawer(id: string): InfoDrawer | undefined {
  return INFO_DRAWERS.find((d) => d.id === id);
}
