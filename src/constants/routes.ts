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
  reviewResult: '/review/result',
  reviewConfirmation: '/review/confirmation',

  rooms: '/rooms',
  room: (slug: string) => `/rooms/${slug}`,
} as const;

/** Backend API paths (relative to NEXT_PUBLIC_API_URL). Used by the Phase 3 API layer. */
export const apiRoutes = {
  visitorSession: '/visitors/sessions/',
  visitorRoomEntry: (id: string) => `/visitors/sessions/${id}/room-entry/`,
  reviewSession: '/review/sessions/',
  reviewPrompt: (id: string) => `/review/sessions/${id}/prompt/`,
  reviewQualify: (id: string) => `/review/sessions/${id}/qualify/`,
  generateResult: '/ai/generate-result/',
  resultPage: (leadId: string) => `/result-page/${leadId}/`,
  leadCaptureEmail: '/lead-capture/email/',
} as const;
