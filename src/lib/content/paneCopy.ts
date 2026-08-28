/**
 * CONTENT-PANE COPY — single source (Playbook v1.7 §16B–16E).
 *
 * The pane is a READING SURFACE, not a pitch. There is no offer here, no
 * countdown, no availability line, and no wording that asks for anything. If a
 * string in this file ever starts selling, the pane has become the thing §2.7
 * forbids.
 */

import type { ContentPaneSection } from '@/lib/journey/contentPaneSections';

export const PANE_COPY = {
  /** The pane header. Names what it holds, and claims nothing about it. */
  header: 'What itriX has prepared',

  /** Shown when the thread has produced nothing yet. */
  empty: 'Nothing has been prepared yet. Describe your bottleneck and we will start here.',

  /** Shown when a section is authorized but this build cannot render it. */
  notYet: 'This opens here shortly.',

  close: 'Hide content',
  open: 'Open content',
  collapse: 'Collapse the reading pane',
  expand: 'Expand the reading pane',

  /** The pane, as a landmark. */
  regionLabel: 'What itriX has prepared for you',

  /** Switch between the artifacts a thread has produced. */
  artifactSwitcherLabel: 'Prepared for you',

  /**
   * PHASE 3. The feedback section keeps half of its promise and says so.
   *
   * "What we did about it" is the change digest, and it renders. "What you have told
   * us" has NO READ ENDPOINT — the feedback endpoints are write-only by design, so a
   * customer's candid rating cannot become something they are later shown. Rather than
   * imply a record exists, the section points at where feedback is actually answered.
   */
  feedbackNote: 'Anything you tell us is answered in your conversation, by the person who owns it.',

  /** PHASE 3. What an NDA opens up, in the approved framing. */
  ndaNote: 'An NDA can protect an authorized confidential disclosure, but it does not itself authorize access. Restricted material is shared only when the current stage, any required agreement, and an explicit content authorization all permit it.',
} as const;

/**
 * Section labels, from Playbook v1.7 §16E.
 *
 * Plain language, and never a state number, a tier, a score or an internal name.
 */
export const PANE_SECTION_LABEL: Record<ContentPaneSection, string> = {
  artifacts: 'Prepared',
  documents: 'Documents',
  pathway: 'Your pathway',
  nda: 'NDA',
  workspace_assessment: 'Your assessment',
  workspace_poc: 'PoC',
  workspace_integration: 'Integration',
  decisions: 'Decisions',
  governance: 'Decision log',
  outcomes: 'Outcomes',
  deployments: 'Deployments',
  support: 'Support',
  knowledge: 'Learning',
  meetings: 'Meetings',
  feedback: 'Feedback',
  explore: 'Explore',
  legal: 'Legal',
};

/**
 * One-line descriptions, used as the section's standfirst.
 *
 * Playbook v1.7 §16E, verbatim. Each says what the section HOLDS. None of them makes a
 * claim, offers anything, or implies a next step — the pane is a reading surface, and
 * a standfirst that started selling would be the first sign it had stopped being one.
 */
export const PANE_SECTION_INTRO: Partial<Record<ContentPaneSection, string>> = {
  documents: 'What has been shared, and what has been viewed.',
  pathway: 'Where things stand and what has been decided.',
  nda: 'What is done and what is outstanding.',
  workspace_assessment:
    'Intake, baseline, the Boundary Waste Map of your workload, feasibility, the benchmark, and what we would recommend proving next.',
  workspace_poc: 'The baseline, the measures we agreed, and where each milestone stands.',
  workspace_integration: 'Readiness, accepted evidence, governance and commercial documents.',
  decisions: 'What has been agreed, and when.',
  governance: 'The shared record of what was decided and by whom.',
  outcomes: 'Your agreed outcomes and their status.',
  deployments: 'Environments, versions and health.',
  support: 'Your open requests.',
  knowledge: 'Training, documentation and release notes.',
  meetings: 'Past notes and what is scheduled.',
  feedback: 'What you have told us, and what we did about it.',
};

/**
 * PHASE 3. What a section says when it has nothing in it.
 *
 * A SENTENCE, never a skeleton. A relationship-backed section is authorized by state,
 * so "authorized but thin" is a normal condition rather than a loading failure — and a
 * shimmering placeholder for data that is not coming is a small lie told repeatedly.
 */
export const PANE_SECTION_EMPTY: Partial<Record<ContentPaneSection, string>> = {
  documents: 'Nothing has been shared here yet.',
  pathway: 'Nothing has been prepared yet. It will appear here as it is.',
  nda: 'We can go a long way on non-confidential descriptions.',
  workspace_assessment: 'Your assessment will appear here once it begins.',
  workspace_poc: 'Evidence appears here as it is produced.',
  workspace_integration: 'Integration material will appear here when it is ready.',
  decisions: 'Nothing has been agreed yet.',
  governance: 'The decision log is empty so far.',
  outcomes: 'Your agreed outcomes will appear here.',
  deployments: 'Nothing is deployed yet.',
  support: 'You have no open requests.',
  knowledge: 'Training and documentation will appear here.',
  meetings: 'Nothing is scheduled yet.',
};

/** Korean public/client-plane copy. Protected identifiers remain canonical English. */
export const PANE_COPY_KO = {
  header: 'itriX가 준비한 내용',
  empty: '아직 준비된 내용이 없습니다. 병목을 설명하면 여기에서 시작합니다.',
  notYet: '곧 여기에서 열립니다.',
  close: '내용 숨기기',
  open: '내용 열기',
  collapse: '읽기 패널 접기',
  expand: '읽기 패널 펼치기',
  regionLabel: 'itriX가 귀하를 위해 준비한 내용',
  artifactSwitcherLabel: '준비된 자료',
  feedbackNote: '전해 주신 내용에는 대화에서 담당자가 직접 답변합니다.',
  ndaNote: 'NDA는 승인된 공개를 보호할 수 있지만 그 자체로 자료 접근을 승인하지 않습니다. 제한 자료는 현재 단계, 필요한 계약, 명시적 콘텐츠 권한이 모두 허용할 때만 공유됩니다.',
} as const;

export const PANE_SECTION_LABEL_KO: Record<ContentPaneSection, string> = {
  artifacts: '준비된 자료', documents: '문서', pathway: '현재 경로', nda: 'NDA',
  workspace_assessment: '평가', workspace_poc: 'PoC', workspace_integration: '통합',
  decisions: '결정 사항', governance: '의사결정 기록', outcomes: '성과', deployments: '배포',
  support: '지원', knowledge: '학습', meetings: '미팅', feedback: '피드백', explore: '탐색', legal: '법률',
};

export const PANE_SECTION_INTRO_KO: Partial<Record<ContentPaneSection, string>> = {
  documents: '공유된 자료와 확인 상태입니다.',
  pathway: '현재 위치와 지금까지 결정된 내용입니다.',
  nda: '완료된 내용과 남아 있는 항목입니다.',
  workspace_assessment: '접수, 기준선, Boundary Waste Map, 기술적 가능성, 벤치마크 설계와 다음 검증 권고입니다.',
  workspace_poc: '기준선, 합의한 측정 항목과 각 마일스톤의 상태입니다.',
  workspace_integration: '준비도, 수용된 근거, 거버넌스 및 상업 문서입니다.',
  decisions: '합의된 내용과 시점입니다.',
  governance: '무엇을 누가 결정했는지에 대한 공유 기록입니다.',
  outcomes: '합의한 성과와 상태입니다.', deployments: '환경, 버전 및 상태입니다.', support: '열려 있는 지원 요청입니다.',
  knowledge: '교육, 문서 및 릴리스 노트입니다.', meetings: '이전 메모와 예정된 미팅입니다.',
  feedback: '전해 주신 내용과 그에 대한 조치입니다.',
};

export const PANE_SECTION_EMPTY_KO: Partial<Record<ContentPaneSection, string>> = {
  documents: '아직 공유된 자료가 없습니다.', pathway: '아직 준비된 내용이 없습니다. 준비되는 대로 표시됩니다.',
  nda: '비기밀 설명만으로도 상당한 범위까지 진행할 수 있습니다.', workspace_assessment: '평가가 시작되면 여기에 표시됩니다.',
  workspace_poc: '근거가 생성되는 대로 여기에 표시됩니다.', workspace_integration: '통합 자료가 준비되면 여기에 표시됩니다.',
  decisions: '아직 합의된 결정이 없습니다.', governance: '아직 의사결정 기록이 없습니다.', outcomes: '합의된 성과가 여기에 표시됩니다.',
  deployments: '아직 배포된 항목이 없습니다.', support: '열려 있는 요청이 없습니다.', knowledge: '교육 및 문서가 여기에 표시됩니다.', meetings: '예정된 미팅이 없습니다.',
};
