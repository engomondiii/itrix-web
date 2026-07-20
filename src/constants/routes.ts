/** Canonical route map for itrix-web. Single source for links and nav. */
export const routes = {
  home: '/',

  alphaCompute: '/alpha-compute',
  alphaCore: '/alpha-core',

  technology: '/technology',
  axiom: '/technology/axiom',
  cre: '/technology/cre',
  fqnm: '/technology/fqnm',

  licensing: '/licensing',
  licensingNonExclusive: '/licensing/non-exclusive',
  licensingExclusive: '/licensing/exclusive',

  about: '/about',
  resources: '/resources',
  fqnmPaper: '/resources/fqnm-paper',

  review: '/review',
  reviewQualify: '/review/qualify',
  reviewPreparing: '/review/preparing',
  // Retired in v3.0 (kept as builders for any lingering deep links; both now
  // resolve to the token-gated client page instead of standalone pages).
  reviewResult: '/review/preparing',
  reviewConfirmation: '/review/preparing',

  /** Customized client page (reveal ①) + the hidden account-creation reveal (②). */
  clientPage: (token: string) => `/c/${token}`,
  clientAccountCreate: (token: string) => `/c/${token}/create-account`,

  /** (portal) route group — the private client workspace (Phase 2, reveal ③). */
  portalSignIn: '/sign-in',
  portalSetPassword: '/set-password',
  portalForgotPassword: '/forgot-password',
  /* v5.0 Phase 3: /workspace IS the thread. The overview dashboard is retired —
     a customer's home is the conversation they have been having all along. */
  workspace: '/workspace',
  workspaceOverview: '/workspace',
  workspaceMessages: '/workspace/messages',
  workspaceBriefing: '/workspace/briefing',
  workspaceDocuments: '/workspace/documents',
  workspaceEvaluation: '/workspace/evaluation',
  workspacePoc: '/workspace/poc',
  workspaceSettings: '/workspace/settings',

  rooms: '/rooms',
  room: (slug: string) => `/rooms/${slug}`,
} as const;

/** Backend API paths (relative to NEXT_PUBLIC_API_URL). */
export const apiRoutes = {
  visitorSession: '/visitors/sessions/',
  visitorRoomEntry: (id: string) => `/visitors/sessions/${id}/room-entry/`,
  reviewSession: '/review/sessions/',
  reviewPrompt: (id: string) => `/review/sessions/${id}/prompt/`,
  reviewQualify: (id: string) => `/review/sessions/${id}/qualify/`,
  reviewChat: (id: string) => `/review/sessions/${id}/chat/`,
  generateResult: '/ai/generate-result/',
  resultPage: (leadId: string) => `/result-page/${leadId}/`,
  leadCaptureEmail: '/lead-capture/email/',

  /** v3.0 — journey, client page, and account invite (Backend v4.0). */
  journeyState: (token: string) => `/journey/${token}/`,
  clientPage: (token: string) => `/client-page/${token}/`,
  clientPageChat: (token: string) => `/client-page/${token}/chat/`,
  accountInviteClaim: (token: string) => `/accounts/invite/${token}/claim/`,

  /** Phase 2 — client auth plane (client-JWT). */
  clientAuthLogin: '/client/auth/login/',
  clientAuthRefresh: '/client/auth/token/refresh/',
  clientMe: '/client/me/',

  /** Phase 2 — portal data (client-JWT, disclosure-gated). */
  portalOverview: '/portal/overview/',
  portalConversations: '/portal/conversations/',
  portalConversationMessages: (id: string) => `/portal/conversations/${id}/messages/`,
  portalConversationSend: (id: string) => `/portal/conversations/${id}/messages/`,
  portalDocuments: '/portal/documents/',
  portalEvaluation: '/portal/evaluation/',
  portalPoc: '/portal/poc/',
  portalSettings: '/portal/settings/',
  portalTeamInvite: '/portal/settings/team/invite/',
} as const;
