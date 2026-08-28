/**
 * The closed artifact vocabulary.
 *
 * Mirrored from apps/journey/constants.py (ARTIFACT_TYPES). It is NEVER
 * re-decided here — an artifact type this build does not know about renders
 * nothing and logs, exactly as an unknown sidebar section does.
 *
 * An artifact is a governed, structured payload rendered as an expandable block
 * INSIDE the transcript. It is not a page the visitor is sent to. It may also be
 * reachable at /a/[artifactId] for print, share or accessibility — but the
 * in-thread rendering is the primary one and the deep link never becomes the
 * only way to see it (Architecture v2.6 §2.5).
 *
 * PHASE 3 completes the set: every type now has a renderer.
 *
 * Surface 1 v5.0 §3.9
 */

export const ARTIFACT_TYPES = [
  'reflection',            // State 3
  'pitch_room',            // State 4
  'review_summary',        // State 5
  'boundary_waste_map',    // State 7
  'poc_evidence',          // State 8
  'integration_readiness', // State 9
  'success_overview',      // State 10
  'document',              // any state, once authorized
  'executive_brief',       // governed internal-champion decision support
  'technical_brief',       // governed internal-champion technical decision support
  'product_brief',         // governed internal-champion product decision support
] as const;

export type ArtifactType = (typeof ARTIFACT_TYPES)[number];

const KNOWN: ReadonlySet<string> = new Set(ARTIFACT_TYPES);

export function isArtifactType(value: string): value is ArtifactType {
  return KNOWN.has(value);
}

/**
 * The visitor-facing title for each type.
 *
 * Plain language, from Playbook v1.6 Part IV. Never a state number, never an
 * internal name, never a persona label.
 */
export const ARTIFACT_TITLE: Record<ArtifactType, string> = {
  reflection: 'What we think is actually happening',
  pitch_room: 'Your personalized brief',
  review_summary: 'Your review summary',
  boundary_waste_map: 'Your Alpha Compute Assessment',
  poc_evidence: 'Proving it on your workload',
  integration_readiness: 'Integration and commercial decisions',
  success_overview: 'Where things stand',
  document: 'Document',
  executive_brief: 'Executive Brief',
  technical_brief: 'Technical Brief',
  product_brief: 'Product Brief',
};

/**
 * PINNED ARTIFACTS.
 *
 * `success_overview` is regenerated on material change and pinned to the top of
 * the thread, so a customer sees where things stand before they scroll
 * (Architecture v2.6 §17.3). Everything else renders in sequence.
 */
export const PINNED_ARTIFACTS: ReadonlySet<ArtifactType> = new Set<ArtifactType>([
  'success_overview',
]);

export function isPinnedArtifact(type: string): boolean {
  return isArtifactType(type) && PINNED_ARTIFACTS.has(type);
}

/**
 * Every type has a renderer from Phase 3 onward. The helper is retained because
 * the vocabulary is shared with the backend and can grow ahead of this build —
 * a type added server-side must render nothing here rather than crash.
 */
export function isRenderableArtifact(type: string): type is ArtifactType {
  return isArtifactType(type);
}

export const ARTIFACT_TITLE_KO: Record<ArtifactType, string> = {
  reflection: '상황에 대한 itriX의 해석',
  pitch_room: '개인화 브리프',
  review_summary: '리뷰 요약',
  boundary_waste_map: 'ALPHA Compute 평가',
  poc_evidence: '워크로드 검증 결과',
  integration_readiness: '통합 및 상용화 의사결정',
  success_overview: '현재 진행 상황',
  document: '문서',
  executive_brief: '경영진 브리프',
  technical_brief: '기술 브리프',
  product_brief: '제품 브리프',
};

export function artifactTitle(type: ArtifactType, locale: 'en' | 'ko' = 'en'): string {
  return locale === 'ko' ? ARTIFACT_TITLE_KO[type] : ARTIFACT_TITLE[type];
}
