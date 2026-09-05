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
    title: 'Your ALPHA Compute Assessment',
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

/** Korean UI copy. Canonical server/business identifiers remain English. */
export const SUCCESS_COPY_KO = {
  home:{welcome:'다시 오신 것을 환영합니다. 현재 상황입니다.',composerLabel:'무엇을 개선할까요?',composerHelper:'도움이 필요하거나 작동하지 않는 점, 교육 요청, 개선 아이디어를 알려주세요. 적절한 담당자에게 연결합니다.',composerPlaceholder:'무엇을 개선하면 좋을지 알려주세요…'},
  outcomes:{title:'성과',intro:'함께 합의한 성과와 현재 상태입니다.',empty:'아직 합의된 성과가 없습니다. 고객 성공 담당자와 함께 설정할 수 있습니다.',status:{on_plan:'계획대로',at_risk:'위험',off_plan:'계획 이탈',achieved:'달성'}},
  deployments:{title:'배포 상태',intro:'현재 운영 상태, 마지막 확인 시점, 발생한 문제, 실행 버전과 알려진 제한 사항입니다.',limitationsTitle:'알려진 제한 사항',limitationsIntro:'이미 알고 있는 제한 사항을 먼저 공유합니다.',empty:'아직 배포된 항목이 없습니다.',status:{stable:'안정',degraded:'저하',incident:'사고 진행 중',unknown:'미확인'}},
  support:{title:'지원',intro:'진행 중인 요청, 담당자와 예상 응답 시점입니다.',composerLabel:'어떤 도움이 필요하신가요?',composerPlaceholder:'작동하지 않는 점이나 필요한 도움을 설명해주세요.',subjectLabel:'요약',urgencyLabel:'긴급도',submit:'지원팀에 보내기',acknowledgement:'접수했습니다. {owner} 담당이며 {sla} 이내에 응답합니다.',acknowledgementNoOwner:'접수했습니다. 담당자가 {sla} 이내에 응답합니다.',resolutionPrompt:'실제로 해결되었나요?',empty:'열려 있는 요청이 없습니다. 도움이 필요하면 여기에서 알려주세요.',status:{open:'열림',in_progress:'진행 중',waiting_on_customer:'고객 응답 대기',resolved:'해결됨'},urgency:{low:'여유 있음',normal:'보통',high:'빠른 대응',critical:'업무 차단'}},
  changes:{title:'마지막 방문 이후 변경 사항',intro:'완료한 작업, 해결한 문제, 배포한 업데이트 및 고객 결정이 필요한 항목입니다.',empty:'마지막 방문 이후 변경 사항이 없습니다.',kind:{work_completed:'완료',issue_resolved:'해결',update:'업데이트',decision_needed:'결정 필요'}},
  plan:{title:'공동 계획',intro:'다음 30·60·90일 목표, 양측 담당자와 측정 항목입니다.',dependencyTitle:'고객 측 조치 필요',dependencyIntro:'고객 측에서 필요한 항목을 미리 표시합니다.',empty:'아직 합의된 계획이 없습니다.'},
  knowledge:{title:'학습 및 문서',intro:'팀 역할별 교육, 문서, 릴리스 노트와 권장 실무입니다.',releaseNotesTitle:'릴리스 노트',empty:'아직 게시된 자료가 없습니다.'},
  team:{title:'itriX 담당 팀',intro:'고객 관계를 담당하는 사람들입니다. 직접 연락할 수 있습니다.',roles:{customer_success:'일상 운영, 성과, 작동하지 않는 모든 것.',technical:'워크로드, 배포 및 측정.',executive:'상업 질문 및 상위 의사결정.',support:'긴급한 모든 것.'},roleLabel:{customer_success:'고객 성공',technical:'기술',executive:'임원',support:'지원'},reachability:'언제든 먼저 어시스턴트를 거치지 않고 지정된 담당자에게 연락할 수 있습니다.',empty:'담당 팀을 지정 중입니다. 여기에서 요청하면 담당자가 이어받습니다.'},
  feedback:{title:'어떻게 하고 있나요?',prompt:'이 내용은 비공개이며 고객 성공 담당자에게만 전달됩니다.',freeTextPlaceholder:'바꾸었으면 하는 점이 있다면 알려주세요.',followUp:'이 내용에 대해 담당자의 후속 연락을 원합니다.',submit:'보내기',thanks:'감사합니다. 고객 성공 담당자에게 직접 전달되었습니다.',thanksWithFollowUp:'감사합니다. 고객 성공 담당자가 직접 후속 연락을 드립니다.',scaleLabel:'지금 경험은 어떤가요?',scale:['매우 나쁨','좋지 않음','보통','좋음','매우 좋음']},
  meetings:{title:'미팅',intro:'성공 검토와 기술 세션, 의제 및 이전 메모입니다.',nextReview:'다음 성공 검토',empty:'예정된 일정이 없습니다. 미팅이 필요하면 여기에서 요청하세요.'},
  governance:{title:'의사결정 기록',intro:'무엇을 누가 결정했는지 공유하는 기록입니다.',empty:'아직 기록된 결정이 없습니다.'},
} as const;

export const WORKSPACE_COPY_KO = {
  assessment:{title:'ALPHA Compute 평가',intro:'이 워크스페이스에는 입력, 합의된 기준선, Boundary Waste Map, 기술적 타당성, 벤치마크 설계 및 다음 증거 단계 권고가 담깁니다.',standing:'무엇이 진행 중인지, 왜 중요한지, 다음 행동의 담당자가 누구인지 항상 알 수 있어야 합니다.',empty:'아직 평가가 시작되지 않았습니다.',stages:{intake:'입력',baseline:'기준선',boundary_map:'Boundary Waste Map',feasibility:'타당성',benchmark_design:'벤치마크 설계',recommendation:'권고'},boundaryMapTitle:'Boundary Waste Map',boundaryMapIntro:'워크로드에서 표현적 낭비가 있을 수 있는 위치와 이유를 구조적으로 정리합니다. 측정값 자체가 아니며 검증은 별도 증거 단계에서 이루어집니다.',significanceLabel:{low:'낮은 중요도',moderate:'중간 중요도',high:'높은 중요도'},confidenceLabel:{preliminary:'예비',supported:'근거 있음',strong:'강한 근거'}},
  poc:{title:'워크로드에서 검증하기',intro:'합의된 기준선, KPI 및 통과·부분 결과·부정 결과의 기준입니다. 생성되는 근거가 여기에 표시됩니다.',empty:'현재 진행 중인 PoC가 없습니다.',criterionLabel:'실행 전 합의',outcome:{pass:'통과',partial:'부분',negative:'부정 결과',pending:'아직 측정되지 않음'},decisionTitle:'이 결과의 의미에 대한 합의'},
  integration:{title:'통합 및 상업적 의사결정',intro:'통합 준비 상태, 양측이 수용한 근거, 열린 상업적 의사결정, 진행 중 문서와 결정 기록입니다.',empty:'아직 통합이 시작되지 않았습니다.',readinessTitle:'준비 상태',evidenceTitle:'양측이 수용한 근거',openDecisionsTitle:'열린 결정',documentsTitle:'문서',logTitle:'의사결정 기록',readinessStatus:{not_started:'시작 전',in_progress:'진행 중',complete:'완료',blocked:'차단됨'},documentStatus:{draft:'초안',in_review:'검토 중',signed:'서명됨'}},
} as const;
