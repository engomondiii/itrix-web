/**
 * Customer-success copy — Playbook v1.5 Part XII, single source.
 *
 *   PRIORITY RULE
 *   Keeping paying customers happy and successful is more important than moving
 *   them toward another agreement. This is not an upsell surface. It is the
 *   primary home for realized value, support, adoption, learning, trust and
 *   continuous improvement.
 *
 * Every string a customer reads in this zone lives here, so a wording change is
 * one edit with one owner (Customer Success, plus Fidel for flow).
 */

export const SUCCESS_COPY = {
  home: {
    welcome: 'Welcome back. Here is where things stand.',
    composerLabel: 'What can we improve for you?',
    composerHelper:
      'Ask for help, flag something that is not working, request training, or tell us what would make this better. We will route it — you do not need to find the right department.',
    composerPlaceholder: 'Tell us what would make this better…',
  },

  outcomes: {
    title: 'Your outcomes',
    intro: 'These are the outcomes we agreed together, and where each one stands.',
    empty: 'No outcomes have been agreed yet. Your customer-success owner will set these up with you.',
    /** Exactly these four words. Never "promising", never "trending". */
    status: {
      on_plan: 'On plan',
      at_risk: 'At risk',
      off_plan: 'Off plan',
      achieved: 'Achieved',
    },
  },

  deployments: {
    title: 'Deployment health',
    intro:
      'Current operational status, when we last checked, anything that has gone wrong, the versions you are running, and the limitations we know about.',
    limitationsTitle: 'Known limitations',
    limitationsIntro: 'These are the limitations we already know about. We would rather you hear them from us.',
    empty: 'Nothing is deployed yet.',
    status: {
      stable: 'Stable',
      degraded: 'Degraded',
      incident: 'Incident open',
      unknown: 'Not yet checked',
    },
  },

  support: {
    title: 'Support',
    intro: 'Your open requests, who owns each one, and when you can expect a response.',
    composerLabel: 'What do you need help with?',
    composerPlaceholder: 'Describe what is not working, or what you need help with.',
    subjectLabel: 'Summary',
    urgencyLabel: 'How urgent is this?',
    submit: 'Send to support',
    /** {owner} and {sla} are substituted at render. */
    acknowledgement: 'We have this. {owner} owns it and will respond within {sla}.',
    acknowledgementNoOwner: 'We have this. Someone from your team will respond within {sla}.',
    resolutionPrompt: 'Did this actually resolve it for you?',
    empty: 'No open requests. If something needs attention, tell us here.',
    status: {
      open: 'Open',
      in_progress: 'In progress',
      waiting_on_customer: 'Waiting on you',
      resolved: 'Resolved',
    },
    urgency: {
      low: 'Whenever',
      normal: 'Normal',
      high: 'Soon',
      critical: 'Blocking us',
    },
  },

  changes: {
    title: 'What changed since you were last here',
    intro: 'Work we completed, issues we resolved, updates we shipped, and anything waiting on a decision from you.',
    empty: 'Nothing has changed since your last visit.',
    kind: {
      work_completed: 'Completed',
      issue_resolved: 'Resolved',
      update: 'Update',
      decision_needed: 'Needs your decision',
    },
  },

  plan: {
    title: 'Our shared plan',
    intro:
      'The goals we agreed for the next 30, 60 and 90 days, who owns each one on both sides, and what we are measuring.',
    dependencyTitle: 'Needs something from you',
    dependencyIntro: 'These items need something from your side. We have flagged them early so they do not surprise anyone.',
    empty: 'No plan has been agreed yet.',
  },

  knowledge: {
    title: 'Learning and documentation',
    intro: 'Training for each role on your team, documentation, release notes, and the practices we recommend.',
    releaseNotesTitle: 'Release notes',
    empty: 'Nothing published yet.',
  },

  team: {
    title: 'Your team at itriX',
    intro: 'These are the people who own your relationship. You can reach any of them directly.',
    /** Role lines, verbatim from the Playbook. */
    roles: {
      customer_success: 'Day-to-day, outcomes, and anything that is not working.',
      technical: 'The workload, the deployment, and the numbers.',
      executive: 'Commercial questions and anything that needs a decision above the working level.',
      support: 'Anything urgent.',
    },
    roleLabel: {
      customer_success: 'Customer success',
      technical: 'Technical',
      executive: 'Executive',
      support: 'Support',
    },
    /** The absolute. A customer who asks for a person gets a person. */
    reachability: 'You can always reach a named person without going through an assistant first.',
    empty: 'Your team is being assigned. Ask here and someone will pick it up.',
  },

  feedback: {
    title: 'How are we doing?',
    prompt: 'This is private. It goes to your customer-success owner and nowhere else.',
    freeTextPlaceholder: 'Anything you would want us to change.',
    followUp: 'I would like someone to follow up on this.',
    submit: 'Send',
    thanks: 'Thank you — this went straight to your customer-success owner.',
    thanksWithFollowUp: 'Thank you. Your customer-success owner will follow up with you directly.',
    /** Deliberately not a scale of the CUSTOMER. It rates us. */
    scaleLabel: 'How is this going for you right now?',
    scale: ['Badly', 'Not great', 'Fine', 'Well', 'Very well'],
  },

  meetings: {
    title: 'Meetings',
    intro: 'Success reviews and technical sessions, with the agenda and prior notes.',
    nextReview: 'Next success review',
    empty: 'Nothing scheduled. Ask here if you would like to meet.',
  },

  governance: {
    title: 'Decision log',
    intro: 'The shared record of what was decided and by whom.',
    empty: 'No decisions recorded yet.',
  },
} as const;

/** The paid-workspace copy (States 7–9). */
export const WORKSPACE_COPY = {
  assessment: {
    title: 'Your Alpha Compute Assessment',
    intro:
      'This workspace holds the whole assessment: what we took in, the baseline we agreed, the Boundary Waste Map of your workload, technical feasibility, the benchmark we would design, and what we would recommend proving next.',
    standing: 'You should always know what is happening, why it matters, and who owns the next action.',
    empty: 'Your assessment has not started yet.',
    stages: {
      intake: 'Intake',
      baseline: 'Baseline',
      boundary_map: 'Boundary Waste Map',
      feasibility: 'Feasibility',
      benchmark_design: 'Benchmark design',
      recommendation: 'Recommendation',
    },
    boundaryMapTitle: 'Boundary Waste Map',
    boundaryMapIntro:
      'Where representational waste appears to sit in your workload, and why. This is a structural read, not a measurement — anything we can prove comes from a PoC.',
    significanceLabel: { low: 'Low significance', moderate: 'Moderate significance', high: 'High significance' },
    confidenceLabel: { preliminary: 'Preliminary', supported: 'Supported', strong: 'Strong' },
  },

  poc: {
    title: 'Proving it on your workload',
    intro:
      'Here is the baseline, the KPIs we agreed, and what counts as a pass, a partial result, or a negative result. Evidence appears here as it is produced.',
    empty: 'No proof of concept is running yet.',
    criterionLabel: 'Agreed before the run',
    /** Exactly these words. A negative result is reported as a negative result. */
    outcome: {
      pass: 'Pass',
      partial: 'Partial',
      negative: 'Negative',
      pending: 'Not yet measured',
    },
    decisionTitle: 'What we agreed this means',
  },

  integration: {
    title: 'Integration and commercial decisions',
    intro:
      'This workspace holds integration readiness, the evidence both sides have accepted, the commercial decisions still open, the documents in flight, and the decision log.',
    empty: 'Integration has not started yet.',
    readinessTitle: 'Readiness',
    evidenceTitle: 'Evidence we have both accepted',
    openDecisionsTitle: 'Decisions still open',
    documentsTitle: 'Documents',
    logTitle: 'Decision log',
    readinessStatus: {
      not_started: 'Not started',
      in_progress: 'In progress',
      complete: 'Complete',
      blocked: 'Blocked',
    },
    documentStatus: { draft: 'Draft', in_review: 'In review', signed: 'Signed' },
  },
} as const;
