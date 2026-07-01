import type { RoomId, RoomGroup } from '@/types/room.types';
import type { VisitorType } from '@/types/visitor.types';
import { routes } from '@/constants/routes';

export interface RoomContent {
  id: RoomId;
  slug: string;
  title: string;
  label: string;
  summary: string;
  group: RoomGroup;
  visitorType: VisitorType;
  audience: string;
  intro: string;
  offers: string[];
  ctaLabel: string;
  ctaHref: string;
}

/**
 * The 13 visitor rooms (Playbook Part V). Phase 3 finalizes the set:
 *   preserved: bottleneck, technical, research, investor, partner, shareholder,
 *              media, public-infrastructure
 *   renamed:   creator → story, explore → orientation, + technical-assessment
 *              (from the old bottleneck/technical split)
 *   new:       sustainable-ai, architecture
 * Each room routes a persona to the right material and classifies the session.
 */
export const VISITOR_ROOMS: Record<RoomId, RoomContent> = {
  bottleneck: {
    id: 'bottleneck',
    slug: 'bottleneck',
    title: 'I have a compute bottleneck',
    label: 'Compute bottleneck',
    summary: 'Describe a workload that is getting expensive and get a structural read on it.',
    group: 'operator',
    visitorType: 'technical',
    audience: 'Teams whose compute cost, speed, or energy is becoming a limit',
    intro:
      'Start from the workload. Tell us where it runs and what is becoming expensive, and the review returns a structural diagnosis — not a quote.',
    offers: [
      'A representation-level read on where the cost actually sits',
      'Which ALPHA layer the problem maps to, and why',
      'A conservative view of what may be possible on eligible workloads',
    ],
    ctaLabel: 'Begin the review',
    ctaHref: routes.review,
  },
  'technical-assessment': {
    id: 'technical-assessment',
    slug: 'technical-assessment',
    title: 'I want a technical assessment',
    label: 'Technical assessment',
    summary: 'Scope a focused, paid study of one real workload — the Boundary Waste Map.',
    group: 'operator',
    visitorType: 'technical',
    audience: 'Teams ready to test the approach on a real workload',
    intro:
      'An Alpha Compute Assessment is a focused engineering study of one workload: where it crosses avoidable computational boundaries, a prioritised Boundary Waste Map, and a recommendation on whether a proof of concept is worth it. Arranged after an NDA; details discussed privately.',
    offers: [
      'A Boundary Waste Map of one workload',
      'A prioritised view of where ALPHA Compute may help',
      'A clear recommendation on a proof of concept',
    ],
    ctaLabel: 'Request an Alpha Compute Assessment',
    ctaHref: routes.review,
  },
  technical: {
    id: 'technical',
    slug: 'technical',
    title: 'I want the technical detail',
    label: 'Technical',
    summary: 'AXIOM, CRE, and FQNM — what they are and where the public boundary sits.',
    group: 'technical',
    visitorType: 'technical',
    audience: 'Engineers and applied researchers evaluating the approach',
    intro:
      'The public framing of each technology, the unified Representation → Observation → Transfer → Execution → Reconstruction view, and the one public proof point. Mechanism detail and benchmarks are available under NDA.',
    offers: [
      'Public framing of AXIOM, CRE, and FQNM',
      'The FQNM paper as a public reference',
      'A clear map of what opens up under NDA',
    ],
    ctaLabel: 'Explore the technology',
    ctaHref: routes.technology,
  },
  research: {
    id: 'research',
    slug: 'research',
    title: 'I am a researcher',
    label: 'Research',
    summary: 'Collaboration, validation, and the published work behind the methods.',
    group: 'technical',
    visitorType: 'researcher',
    audience: 'Academic and institutional researchers',
    intro:
      'Where the methods are published, how validation works, and how research collaboration with iTrix is structured.',
    offers: ['The FQNM publication and its claims', 'How independent validation is approached', 'Routes to collaboration'],
    ctaLabel: 'Read the FQNM paper',
    ctaHref: routes.fqnmPaper,
  },
  architecture: {
    id: 'architecture',
    slug: 'architecture',
    title: 'I design chips or accelerators',
    label: 'Architecture',
    summary: 'How reconstructed computation maps to CPU, GPU, NPU, edge, or custom silicon.',
    group: 'technical',
    visitorType: 'partner',
    audience: 'Semiconductor and accelerator architects',
    intro:
      'How a stronger, structure-preserving software layer could differentiate the hardware beneath it, and how reconstructed computation maps to your architecture. This usually begins with an architecture discussion and an ALPHA Core runtime-fit assessment.',
    offers: [
      'How representation maps to your architecture',
      'Where ALPHA Core runtime-fit is assessed',
      'The path from discussion to evaluation',
    ],
    ctaLabel: 'Request an architecture discussion',
    ctaHref: routes.review,
  },
  investor: {
    id: 'investor',
    slug: 'investor',
    title: 'I am an investor',
    label: 'Investor',
    summary: 'The thesis, the asset-light model, and how value participation works.',
    group: 'capital',
    visitorType: 'investor',
    audience: 'Investors assessing the opportunity',
    intro:
      'The computational-infrastructure thesis, the IP-and-licensing model, and how iTrix participates in the value it creates. Figures and the data room are shared directly.',
    offers: ['The infrastructure thesis in brief', 'The asset-light, IP-led model', 'How to reach the team for the data room'],
    ctaLabel: 'Request an investor briefing',
    ctaHref: routes.review,
  },
  partner: {
    id: 'partner',
    slug: 'partner',
    title: 'I want to partner',
    label: 'Partner',
    summary: 'Integration, co-development, and strategic partnership pathways.',
    group: 'capital',
    visitorType: 'partner',
    audience: 'Hardware, cloud, and platform partners',
    intro:
      'How ALPHA Core embeds with hardware and runtime partners, and how co-development and strategic rights are structured.',
    offers: ['Integration and embedding model', 'Co-development pathway', 'Where strategic rights apply'],
    ctaLabel: 'Start a partnership conversation',
    ctaHref: routes.review,
  },
  shareholder: {
    id: 'shareholder',
    slug: 'shareholder',
    title: 'I am a shareholder',
    label: 'Shareholder',
    summary: 'Direction, milestones, and where the company is heading.',
    group: 'capital',
    visitorType: 'shareholder',
    audience: 'Existing shareholders',
    intro: 'A high-level view of direction and milestones. Detailed updates are shared through official channels.',
    offers: ['Strategic direction in brief', 'Milestone framing', 'Official contact for detail'],
    ctaLabel: 'Contact the team',
    ctaHref: routes.review,
  },
  'public-infrastructure': {
    id: 'public-infrastructure',
    slug: 'public-infrastructure',
    title: 'I work in public infrastructure',
    label: 'Public infrastructure',
    summary: 'Sustainable-compute relevance for public and large-scale systems.',
    group: 'capital',
    visitorType: 'public_infrastructure',
    audience: 'Public-sector and large-scale infrastructure leads',
    intro:
      'Where representation-first computation matters for energy and cost at public-infrastructure scale, framed conservatively.',
    offers: ['Sustainable-compute relevance', 'Where the approach fits at scale', 'Route to a structured conversation'],
    ctaLabel: 'Begin a review',
    ctaHref: routes.review,
  },
  'sustainable-ai': {
    id: 'sustainable-ai',
    slug: 'sustainable-ai',
    title: 'Energy is my real constraint',
    label: 'Sustainable AI',
    summary: 'Reducing the energy burden by reconstructing computation before scaling hardware.',
    group: 'capital',
    visitorType: 'public_infrastructure',
    audience: 'Infrastructure and data-centre strategists',
    intro:
      'When the constraint is power, not silicon. itriX explores whether part of the energy burden can be reduced by reconstructing computation before infrastructure is scaled — the most direct expression of the mission: sustainable AI through better structure, not only more power.',
    offers: [
      'Where energy is spent on avoidable work',
      'How representation-first lowers the ask on hardware',
      'Where ALPHA Core fits when hardware is involved',
    ],
    ctaLabel: 'Explore sustainable AI infrastructure',
    ctaHref: routes.review,
  },
  media: {
    id: 'media',
    slug: 'media',
    title: 'I am from the media',
    label: 'Media',
    summary: 'Accurate framing, the thesis, and what can be said publicly.',
    group: 'communications',
    visitorType: 'media',
    audience: 'Journalists and analysts',
    intro:
      'The accurate, public framing of what iTrix does — written carefully so the claims stay correct. Mechanism detail and numbers are not public.',
    offers: ['Accurate one-line and paragraph framing', 'What is and is not public', 'Press contact'],
    ctaLabel: 'Request a media / story kit',
    ctaHref: routes.room('story'),
  },
  story: {
    id: 'story',
    slug: 'story',
    title: 'I want to tell the story',
    label: 'Story',
    summary: 'A media / story kit: accurate framing, quotes, and what can be said publicly.',
    group: 'communications',
    visitorType: 'media',
    audience: 'Journalists, storytellers, and explainers',
    intro:
      'A story kit for telling the itriX story accurately: the public thesis, the metaphors that hold up, approved framing, and the disclosure boundary — so the claims stay correct without crossing into mechanism detail.',
    offers: ['Approved public framing and quotes', 'The metaphors that hold up', 'What to avoid claiming'],
    ctaLabel: 'Request the story kit',
    ctaHref: routes.review,
  },
  orientation: {
    id: 'orientation',
    slug: 'orientation',
    title: 'I am just exploring',
    label: 'Orientation',
    summary: 'No agenda — start with the idea and follow it where it goes.',
    group: 'orientation',
    visitorType: 'general',
    audience: 'Anyone new to iTrix',
    intro: 'Start with the thesis and move at your own pace into products, technology, or a review.',
    offers: ['The idea in one line', 'A map of where to go next', 'No pressure'],
    ctaLabel: 'See how iTrix thinks',
    ctaHref: routes.home,
  },
};

export const ROOM_LIST: RoomContent[] = Object.values(VISITOR_ROOMS);

export function getRoom(id: RoomId): RoomContent {
  return VISITOR_ROOMS[id];
}

export const ROOM_GROUP_LABEL: Record<RoomGroup, string> = {
  operator: 'Start from a problem',
  technical: 'Go deep',
  capital: 'Capital & partnership',
  communications: 'Tell the story',
  orientation: 'Just looking',
};
