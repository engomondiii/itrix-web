/**
 * All portal system copy (Playbook Part XII, §60–68). These are the site's own
 * wording — labels, greetings, status lines, safety messages — kept in one place so
 * the workspace always reads consistently. Live back-and-forth is authored by the
 * team; only the system lines live here. Copy stays calm, claim-safe, and never
 * presents the assessment intelligence as a named person.
 */

export const PORTAL_COPY = {
  signIn: {
    title: 'Sign in to your itriX workspace',
    emailLabel: 'Email address',
    passwordLabel: 'Password',
    button: 'Sign in',
    forgot: 'Forgot your password?',
    needAccess: 'Need access? Continue with an itriX Specialist',
  },
  forgotPassword: {
    intro: 'Enter the email address for your workspace and we will send a link to reset your password.',
    button: 'Send reset link',
    confirmation: 'If that email is registered, a reset link is on its way.',
  },
  setPassword: {
    title: 'Set your workspace password',
    intro: 'Choose a password to finish setting up your itriX workspace.',
    passwordLabel: 'New password',
    confirmLabel: 'Confirm password',
    button: 'Set password and continue',
  },
  home: {
    welcome: (firstName: string) => `Welcome back, ${firstName}.`,
    welcomeBody:
      'This is your private itriX workspace. Your review, your conversations with the itriX team, and your next steps all live here.',
    empty:
      'There is nothing waiting on you right now. When the itriX team has an update, it will appear here and in Messages.',
    nextSteps: {
      read_briefing: {
        title: 'Read your briefing',
        body: 'See what we heard, the likely bottleneck, and the recommended path.',
        cta: 'Open briefing',
      },
      talk_to_itrix: {
        title: 'Talk with itriX',
        body: 'Ask a question or continue the conversation with the team.',
        cta: 'Open messages',
      },
      consider_astop: {
        title: 'Explore ASTOP qualification',
        body: 'If observation overhead is material, the next controlled step is to confirm a candidate workflow and fit.',
        cta: 'View ASTOP journey',
      },
      consider_alpha_assessment: {
        title: 'Consider an ALPHA Compute assessment',
        body: 'A separate, fee-bearing assessment opens only after ASTOP has established value and a deeper computational workload remains.',
        cta: 'View assessment',
      },
    },
  },
  messages: {
    labels: { team: 'itriX team', agent: 'itriX assessment', client: 'You' },
    greeting:
      'This is your direct line to itriX. Ask anything about your review, ASTOP, the broader itriX portfolio, or the next steps. We will share what we can before an NDA, and tell you when something is better discussed confidentially.',
    greetingConfidentiality: 'Please avoid sharing confidential technical information before an NDA.',
    suggestedFirst: [
      'What did your review find?',
      'How does ASTOP fit our observation workload?',
      'When would an ALPHA Compute assessment become appropriate?',
      'Can we set up an NDA and a technical briefing?',
    ],
    states: {
      preparing: 'itriX assessment is preparing a response…',
      underReview: 'The itriX team is reviewing this before it reaches you. You’ll see the response here shortly.',
      teamJoined: (name: string) => `${name} from the itriX team has joined this conversation.`,
      outsideHours:
        'A specialist will follow up here, usually within one business day. You can keep writing in the meantime.',
    },
    redirect: {
      body:
        'Please avoid sharing confidential technical information before an NDA. We can continue with a non-confidential description, and move into an NDA if a deeper review is appropriate.',
      button: 'Request an NDA',
      bodyWithNda:
        'Your NDA is in place. Access is still determined separately by explicit content authorization and the stage of the work; no restricted material has been authorized here yet.',
    },
    tooSensitive: {
      body:
        'That is a good question to take into a confidential conversation. With an NDA in place we can give you a complete answer in a technical briefing.',
      button: 'Arrange a confidential briefing',
    },
    inputPlaceholder: 'Write a message to the itriX team…',
    sendButton: 'Send',
    inputNote: 'Non-confidential descriptions only until an NDA is in place.',
    /* The inbox chrome (2026-08-10). 'Briefing' is no longer a nav label; this
       screen is where messages are read and answered. */
    inbox: {
      header: 'Messaging',
      listLabel: 'Conversations',
      threadFallbackSubject: 'Conversation with the itriX team',
      empty: 'Nothing here yet. Write to the itriX team below and your conversation will appear in this list.',
      briefingRow: 'Your itriX briefing',
      briefingPreview: 'The living review of what we heard, kept up to date by the team.',
      briefingNotReady: 'Your briefing is being prepared. When it is ready it will appear here.',
      unreadLabel: (n: number) => `${n} unread`,
      teamJoinedTag: 'itriX team',
    },
  },
  briefing: {
    header: 'Your itriX review',
    intro:
      'This is a living document. As we learn more about your workload, we update it here — and tell you in Messages when we do.',
    lastUpdated: (date: string) => `Updated ${date} by the itriX team.`,
    updateNotice: 'We’ve updated your review based on our recent conversation. The changes are highlighted below.',
  },
  documents: {
    header: 'Documents',
    intro:
      'Everything itriX has shared with you, in one place. Restricted material appears only when it has been explicitly authorized for this workspace; an NDA may protect a disclosure but does not grant access by itself.',
    openFolders: ['Your review', 'Product overviews', 'Public technology notes', 'How an evaluation works'],
    dataRoomLocked: {
      heading: 'Restricted materials — authorization required',
      body:
        'Detailed technical material, validation results, and proof documents are shared only when the specific material has been authorized for your current work and any required agreement is in place.',
      button: 'Request an NDA',
      bodyWithNda:
        'Your NDA is in place. Access is still determined separately by explicit content authorization and the stage of the work; no restricted material has been authorized here yet.',
    },
    dataRoomUnlocked: {
      heading: 'Confidential data room',
      body: 'The material shown below has been explicitly authorized for this workspace. Where an NDA or other agreement applies, that agreement protects the disclosure; it is not the source of the authorization.',
      folders: ['Validation & proof', 'Technical deep-dive', 'Evaluation working files', 'PoC materials'],
    },
    confidentialityBanner:
      'Please do not submit confidential technical information before the appropriate protection is in place. Restricted material is shared only when it is explicitly authorized for the current work and any required agreement applies.',
  },
  evaluation: {
    header: 'Your evaluation',
    intro:
      'A focused, paid assessment of your real workload. You can follow each stage here, and everything we produce lands in your documents.',
    reportButton: 'Open the report',
    measuresReminder:
      'Depending on your workload, an evaluation may look at runtime, memory, energy, accuracy, reproducibility, and integration. These are measured for your case — not promised in advance.',
    emptyState: 'No evaluation is underway yet. When one is agreed with the itriX team, you can follow it here.',
  },
  poc: {
    header: 'Your proof of concept',
    intro:
      'A hands-on test of itriX’s approach on your real workload, against success criteria we agree together before we begin.',
    successNote:
      'A PoC is judged against the criteria we set at the start. We keep proven results, results still under validation, and future possibilities clearly separated.',
    emptyState: 'No proof of concept is underway yet. When one is agreed, its milestones will appear here.',
  },
  settings: {
    profileHeader: 'Your profile',
    profileFields: { fullName: 'Full name', email: 'Email address', organization: 'Organization', role: 'Role', password: 'Password' },
    saveProfile: 'Save changes',
    teamHeader: 'Your team',
    teamIntro:
      'Invite colleagues into this workspace so you can evaluate itriX together. Everyone you invite sees the same review, documents, and conversation.',
    invitePlaceholder: 'colleague@company.com',
    sendInvite: 'Send invite',
    notificationsHeader: 'Notifications',
    notificationsIntro: 'Choose when itriX emails you.',
    notificationLabels: {
      newTeamMessage: 'New message from the itriX team',
      reviewUpdated: 'Your review is updated',
      evalOrPocStatus: 'Evaluation or PoC status changes',
      documentShared: 'A document is shared with you',
    },
    savePreferences: 'Save preferences',
    signOut: 'Sign out',
  },
  invite: {
    accepting: 'Setting up your workspace…',
    welcomeTitle: 'Welcome to your itriX workspace',
    welcomeBody: 'Your workspace is ready. This is where your review, conversations, and next steps live.',
    enterButton: 'Enter your workspace',
    fallbackTitle: 'We’ll be in touch',
    fallbackBody:
      'The itriX team will confirm your workspace shortly. You can keep your review open in the meantime.',
  },
} as const;

/** Korean workspace system copy. Dynamic customer/workload content is returned by the backend in the selected locale. */
export const PORTAL_COPY_KO = {
  signIn: { title:'itriX 워크스페이스에 로그인', emailLabel:'이메일 주소', passwordLabel:'비밀번호', button:'로그인', forgot:'비밀번호를 잊으셨나요?', needAccess:'접근이 필요하신가요? itriX Specialist와 계속하기' },
  forgotPassword: { intro:'워크스페이스 이메일 주소를 입력하면 비밀번호 재설정 링크를 보내드립니다.', button:'재설정 링크 보내기', confirmation:'해당 이메일이 등록되어 있는 경우 재설정 링크가 전송됩니다.' },
  setPassword: { title:'워크스페이스 비밀번호 설정', intro:'itriX 워크스페이스 설정을 완료하려면 비밀번호를 정해 주세요.', passwordLabel:'새 비밀번호', confirmLabel:'비밀번호 확인', button:'비밀번호 설정 후 계속' },
  home: {
    welcome:(firstName:string)=>`다시 오신 것을 환영합니다, ${firstName}.`,
    welcomeBody:'이곳은 비공개 itriX 워크스페이스입니다. 리뷰, itriX 팀과의 대화, 다음 단계가 모두 여기에 있습니다.',
    empty:'현재 확인할 새 항목이 없습니다. itriX 팀의 업데이트가 생기면 여기와 메시지에 표시됩니다.',
    nextSteps:{
      read_briefing:{title:'브리핑 읽기',body:'itriX가 이해한 내용, 가능성이 있는 병목, 권고된 경로를 확인합니다.',cta:'브리핑 열기'},
      talk_to_itrix:{title:'itriX와 대화하기',body:'질문하거나 팀과의 대화를 이어갑니다.',cta:'메시지 열기'},
      consider_astop:{title:'ASTOP 적합성 검토',body:'관측 오버헤드가 실질적인 경우 후보 워크로드와 적합성을 확인하는 통제된 단계로 진행할 수 있습니다.',cta:'ASTOP 진행 보기'},
      consider_alpha_assessment:{title:'ALPHA Compute 평가 검토',body:'ASTOP에서 검증 가치가 확인되고 별도의 더 깊은 계산 문제가 남아 있을 때 유료 평가를 검토합니다.',cta:'평가 보기'},
    },
  },
  messages:{
    labels:{team:'itriX 팀',agent:'itriX 평가',client:'나'},
    greeting:'이곳은 itriX와 직접 대화하는 공간입니다. 리뷰, ASTOP, itriX 제품군, 다음 단계에 대해 질문할 수 있습니다. NDA 이전에 공유 가능한 범위에서 답하고, 기밀 논의가 더 적절한 경우 이를 명확히 안내합니다.',
    greetingConfidentiality:'NDA 이전에는 기밀 기술 정보를 공유하지 마세요.',
    suggestedFirst:['리뷰에서 무엇을 확인했나요?','ASTOP이 우리 관측 워크로드에 어떻게 적용될 수 있나요?','ALPHA Compute 평가는 언제 검토할 수 있나요?','NDA와 기술 브리핑을 준비할 수 있나요?'],
    states:{ preparing:'itriX 평가 응답을 준비하고 있습니다…', underReview:'이 답변은 전달 전에 itriX 팀이 검토 중입니다. 잠시 후 여기에서 확인할 수 있습니다.', teamJoined:(name:string)=>`${name} 님이 itriX 팀에서 이 대화에 참여했습니다.`, outsideHours:'전문가가 보통 영업일 기준 1일 이내에 이곳에서 답변합니다. 그동안 계속 작성해도 됩니다.' },
    redirect:{ body:'NDA 이전에는 기밀 기술 정보를 공유하지 마세요. 비기밀 설명으로 계속할 수 있으며 더 깊은 검토가 필요하면 NDA 절차를 선택할 수 있습니다.', button:'NDA 요청', bodyWithNda:'NDA가 체결되어 있습니다. 하지만 접근 권한은 명시적인 콘텐츠 승인과 작업 단계에 따라 별도로 결정됩니다. 여기에서 제한 자료가 자동 승인되지는 않습니다.' },
    tooSensitive:{ body:'이 질문은 기밀 대화에서 다루는 것이 적절합니다. 필요한 NDA와 콘텐츠 승인이 갖춰진 기술 브리핑에서 논의할 수 있습니다.', button:'기밀 브리핑 준비' },
    inputPlaceholder:'itriX 팀에 메시지 작성…', sendButton:'보내기', inputNote:'적절한 보호가 마련되기 전에는 비기밀 설명만 공유해 주세요.',
    inbox:{ header:'메시지', listLabel:'대화', threadFallbackSubject:'itriX 팀과의 대화', empty:'아직 메시지가 없습니다. 아래에서 itriX 팀에 작성하면 이 목록에 대화가 표시됩니다.', briefingRow:'내 itriX 브리핑', briefingPreview:'itriX가 이해한 내용을 팀이 최신 상태로 유지하는 리뷰입니다.', briefingNotReady:'브리핑을 준비 중입니다. 준비되면 여기에 표시됩니다.', unreadLabel:(n:number)=>`읽지 않은 메시지 ${n}개`, teamJoinedTag:'itriX 팀' },
  },
  briefing:{ header:'내 itriX 리뷰', intro:'이 문서는 계속 업데이트됩니다. 워크로드를 더 이해하게 되면 여기에서 갱신하고 메시지로 알려드립니다.', lastUpdated:(date:string)=>`itriX 팀이 ${date}에 업데이트`, updateNotice:'최근 대화를 반영해 리뷰를 업데이트했습니다. 변경된 부분이 아래에 표시됩니다.' },
  documents:{
    header:'문서', intro:'itriX가 공유한 자료를 한곳에서 확인합니다. 제한 자료는 이 워크스페이스에 명시적으로 승인된 경우에만 나타납니다. NDA는 공개를 보호할 수 있지만 그 자체로 접근 권한을 부여하지 않습니다.',
    openFolders:['내 리뷰','제품 개요','공개 기술 노트','평가 진행 방식'],
    dataRoomLocked:{ heading:'제한 자료 — 별도 승인 필요', body:'상세 기술 자료, 검증 결과, 증거 문서는 현재 작업에 해당 자료가 명시적으로 승인되고 필요한 계약 조건이 충족된 경우에만 공유됩니다.', button:'NDA 요청', bodyWithNda:'NDA가 체결되어 있습니다. 접근은 여전히 명시적인 콘텐츠 승인과 작업 단계에 따라 별도로 결정됩니다. 이 상태만으로 제한 자료가 승인되지는 않습니다.' },
    dataRoomUnlocked:{ heading:'승인된 제한 자료', body:'아래 자료는 이 워크스페이스에 명시적으로 승인되었습니다. NDA나 다른 계약이 적용되는 경우 그 계약은 공개를 보호하지만 승인 자체의 근거는 아닙니다.', folders:['검증 및 근거','기술 심화 자료','평가 작업 파일','PoC 자료'] },
    confidentialityBanner:'적절한 보호가 마련되기 전에는 기밀 기술 정보를 제출하지 마세요. 제한 자료는 현재 작업에 명시적으로 승인되고 필요한 계약이 적용되는 경우에만 공유됩니다.',
  },
  evaluation:{ header:'내 평가', intro:'실제 워크로드를 대상으로 한 범위가 정해진 유료 평가입니다. 각 단계를 여기에서 확인할 수 있고 산출물은 문서에 저장됩니다.', reportButton:'보고서 열기', measuresReminder:'워크로드에 따라 실행시간, 메모리, 에너지, 정확도, 재현성, 통합을 측정할 수 있습니다. 이는 해당 사례에서 측정되는 값이며 사전에 보장되지 않습니다.', emptyState:'진행 중인 평가가 없습니다. itriX 팀과 평가에 합의하면 여기에서 진행 상황을 확인할 수 있습니다.' },
  poc:{ header:'내 개념검증(PoC)', intro:'실제 워크로드에서 itriX 접근법을 시험하는 별도의 단계이며 시작 전에 성공 기준과 범위를 명시적으로 합의합니다.', successNote:'PoC는 시작 시 합의한 기준으로 판단합니다. 입증된 결과, 검증 중인 결과, 향후 가능성을 분리해 표시합니다.', emptyState:'진행 중인 PoC가 없습니다. 별도로 합의된 경우 이곳에 마일스톤이 표시됩니다.' },
  settings:{
    profileHeader:'내 프로필', profileFields:{fullName:'이름',email:'이메일 주소',organization:'조직',role:'역할',password:'비밀번호'}, saveProfile:'변경사항 저장',
    teamHeader:'내 팀', teamIntro:'동료를 이 워크스페이스에 초대해 함께 itriX를 평가할 수 있습니다. 초대된 사람은 같은 리뷰, 문서, 대화를 봅니다.', invitePlaceholder:'colleague@company.com', sendInvite:'초대 보내기',
    notificationsHeader:'알림', notificationsIntro:'itriX가 이메일을 보내는 경우를 선택하세요.', notificationLabels:{newTeamMessage:'itriX 팀의 새 메시지',reviewUpdated:'리뷰 업데이트',evalOrPocStatus:'평가 또는 PoC 상태 변경',documentShared:'새 문서 공유'}, savePreferences:'알림 설정 저장', signOut:'로그아웃',
  },
  invite:{ accepting:'워크스페이스 설정 중…', welcomeTitle:'itriX 워크스페이스에 오신 것을 환영합니다', welcomeBody:'워크스페이스가 준비되었습니다. 리뷰, 대화, 다음 단계가 여기에 있습니다.', enterButton:'워크스페이스 들어가기', fallbackTitle:'곧 연락드리겠습니다', fallbackBody:'itriX 팀이 워크스페이스를 확인하고 있습니다. 그동안 리뷰는 계속 열어둘 수 있습니다.' },
} as const;
