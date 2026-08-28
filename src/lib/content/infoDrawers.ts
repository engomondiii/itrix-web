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
      'ALPHA Core is the execution-validation layer considered after ALPHA Compute has established a representation hypothesis. It tests whether that reconstructed form can run usefully in the target environment. It is not an automatic destination and may be unnecessary.',
  },
  {
    id: 'what-is-an-assessment',
    title: 'What is an Alpha Compute Assessment?',
    disclosure: 'public',
    body:
      'An ALPHA Compute Assessment is a focused engineering study of one workload. We look at where computation crosses unnecessary boundaries and produce a Boundary Waste Map, an applicability view, and a recommendation on the next evidence step. Confidential exchange requires appropriate protection and explicit authorization. A controlled evaluation is not a PoC, and either may end with a negative result or no further action.',
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
      'Before the appropriate confidentiality protection is in place, we can discuss public material and non-confidential descriptions of your problem. We ask that you do not submit confidential technical information. Access to restricted itriX material is separately authorized; signing an NDA does not create that authorization.',
  },
  {
    id: 'after-an-nda',
    title: 'What happens after an NDA?',
    disclosure: 'controlled_public',
    body:
      'An NDA protects disclosures that are made under it. It does not automatically unlock a data room, authorize technical material, start an assessment, create a PoC, or imply licensing. Those are separate decisions governed by explicit authorization, journey state, and any applicable written agreement.',
  },
  {
    id: 'commercial-pathway',
    title: 'How does the commercial pathway work?',
    disclosure: 'public',
    body:
      'Licensing is a possible later outcome, not a prescribed funnel. A conversation may remain public, move into a controlled evaluation, stop with a negative result, or—only when explicitly selected—progress to a PoC or commercial scoping. An NDA protects an authorized disclosure; it does not itself create access or consent to the next stage. Commercial rights exist only in the applicable written agreement.',
  },
];

/** The quiet intro line above the Learn-more row. */
export const LEARN_MORE_INTRO = 'Learn more';

export function getDrawer(id: string): InfoDrawer | undefined {
  return INFO_DRAWERS.find((d) => d.id === id);
}
