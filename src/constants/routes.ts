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

  /** The four legal instruments (Architecture v2.7 §19.10). Created in v6.0 —
   *  /privacy and /security did not exist before, which was a release blocker. */
  terms: '/terms',
  privacy: '/privacy',
  security: '/security',
  disclosurePolicy: '/disclosure-policy',

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
  /**
   * v8.0 Phase 5. OPEN REGISTRATION, and it is the default (Architecture v2.9 §27.2, R60).
   *
   * The v7.0 comment said this was "NOT open registration by default". That decision was
   * taken the other way: anyone may open a workspace on arrival, and the invitation code is
   * a collapsed second option on the same page.
   */
  portalSignUp: '/sign-up',
  portalSetPassword: '/set-password',
  portalForgotPassword: '/forgot-password',
  /** v7.0 Phase 4. The reset landing, reached from the emailed link. */
  portalResetPassword: '/reset-password',
  /**
   * v8.0 Phase 5. Confirming an email address (Architecture v2.9 §27.7).
   *
   * It is where registration lands, and it is NOT a gate: an unconfirmed account can sign
   * in, hold a conversation and get an answer. Confirmation is required for the NDA path,
   * for anything we would email, and for being named on a commercial document (R66).
   */
  portalVerifyEmail: '/verify-email',
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
