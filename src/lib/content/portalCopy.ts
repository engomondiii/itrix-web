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
    emailLabel: 'Work email',
    passwordLabel: 'Password',
    button: 'Sign in',
    forgot: 'Forgot your password?',
    needAccess: 'Need access? Continue with an itriX Specialist',
  },
  forgotPassword: {
    intro: 'Enter your work email and we will send a link to reset your password.',
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
      consider_evaluation: {
        title: 'Consider an evaluation',
        body: 'A focused, paid assessment of your real workload.',
        cta: 'Explore evaluation',
      },
    },
  },
  messages: {
    labels: { team: 'itriX team', agent: 'itriX assessment', client: 'You' },
    greeting:
      'This is your direct line to itriX. Ask anything about your review, the two products, or the next steps. We will share what we can before an NDA, and tell you when something is better discussed confidentially.',
    greetingConfidentiality: 'Please avoid sharing confidential technical information before an NDA.',
    suggestedFirst: [
      'What did your review find?',
      'Which product fits us first — ALPHA Compute or ALPHA Core?',
      'How would a paid evaluation work?',
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
      button: 'Arrange an NDA',
    },
    tooSensitive: {
      body:
        'That is a good question to take into a confidential conversation. With an NDA in place we can give you a complete answer in a technical briefing.',
      button: 'Arrange a confidential briefing',
    },
    inputPlaceholder: 'Write a message to the itriX team…',
    sendButton: 'Send',
    inputNote: 'Non-confidential descriptions only until an NDA is in place.',
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
      'Everything itriX has shared with you, in one place. Confidential material lives in the data room, which opens once an NDA is in place.',
    openFolders: ['Your review', 'Product overviews', 'Public technology notes', 'How an evaluation works'],
    dataRoomLocked: {
      heading: 'Confidential data room — opens with an NDA',
      body:
        'Detailed technical material, validation results, and proof documents are kept here. To protect both sides, this room opens once an NDA is in place. We can arrange that whenever you are ready.',
      button: 'Arrange an NDA',
    },
    dataRoomUnlocked: {
      heading: 'Confidential data room',
      body: 'Thank you — your NDA is in place. This material is confidential and intended only for your evaluation.',
      folders: ['Validation & proof', 'Technical deep-dive', 'Evaluation working files', 'PoC materials'],
    },
    confidentialityBanner:
      'Please do not submit confidential technical information before an NDA. Material marked confidential is shared under the terms of your agreement with itriX.',
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
    profileFields: { fullName: 'Full name', email: 'Work email', organization: 'Organization', role: 'Role', password: 'Password' },
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
