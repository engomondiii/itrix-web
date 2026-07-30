/**
 * The content-pane vocabulary — PHASE 3 (Architecture v2.7 §11.6, §11.6B).
 *
 * Written as plain assertions with no framework import, matching
 * tests/unit/railSections.test.ts, so it moves to whichever runner this repo settles on.
 *
 * ── WHAT CHANGED FROM THE PHASE 2 VERSION, AND WHY ──────────────────────────
 * Phase 2 asserted `PHASE_2_RENDERABLE.has('outcomes') === false`. That flips here:
 * all seventeen sections have a renderer now. What replaces it is a sharper assertion —
 * that the two BACKING kinds stay disjoint and complete, because that is what the fill
 * rule in useContentPane depends on. A key in neither set would silently never appear.
 */
import assert from 'node:assert/strict';
import {
  ARTIFACT_BACKED,
  CONTENT_PANE_SECTIONS,
  CUSTOMER_SUCCESS_SECTIONS,
  RELATIONSHIP_BACKED,
  RENDERABLE_SECTIONS,
  contentPaneSectionsFromContract,
  isContentPaneSection,
} from '../../src/lib/journey/contentPaneSections';

/* 1 · Seventeen keys, mirrored from apps/journey/constants.py. */
assert.equal(CONTENT_PANE_SECTIONS.length, 17);
assert.equal(isContentPaneSection('workspace_assessment'), true);
assert.equal(isContentPaneSection('new_chat'), false, 'a rail section is not a pane section');
assert.equal(isContentPaneSection('right_rail'), false, 'the retired rail names stay retired');

/* 2 · PHASE 3: every section has a renderer. */
assert.equal(RENDERABLE_SECTIONS.size, 17);
for (const key of CONTENT_PANE_SECTIONS) {
  assert.ok(RENDERABLE_SECTIONS.has(key), `${key} must have a renderer in Phase 3`);
}

/* 3 · THE BACKING KINDS ARE DISJOINT AND COMPLETE.
       Every key is artifact-backed, relationship-backed, or one of the two orientation
       sections. A key in none of those would pass the renderable check and then be
       filtered out by every branch of the fill rule — never appearing, silently. */
const ORIENTATION = new Set(['explore', 'legal']);
for (const key of CONTENT_PANE_SECTIONS) {
  const inArtifact = Object.prototype.hasOwnProperty.call(ARTIFACT_BACKED, key);
  const inRelationship = RELATIONSHIP_BACKED.has(key);
  const inOrientation = ORIENTATION.has(key);
  const count = Number(inArtifact) + Number(inRelationship) + Number(inOrientation);
  assert.equal(count, 1, `${key} must be in exactly one backing kind, not ${count}`);
}

/* 4 · The State 10 six are a subset of the relationship-backed set, and they are the
       ones gated on the customer-success flag. */
assert.equal(CUSTOMER_SUCCESS_SECTIONS.size, 6);
for (const key of CUSTOMER_SUCCESS_SECTIONS) {
  assert.ok(RELATIONSHIP_BACKED.has(key), `${key} must be relationship-backed`);
}
assert.equal(CUSTOMER_SUCCESS_SECTIONS.has('nda'), false, 'the NDA section is not State 10');
assert.equal(CUSTOMER_SUCCESS_SECTIONS.has('governance'), false, 'the decision log is State 9');

/* 5 · The backend's order wins, and the two orientation sections always resolve. */
assert.deepEqual(
  contentPaneSectionsFromContract(['documents', 'artifacts']),
  ['documents', 'artifacts', 'explore', 'legal'],
);
assert.deepEqual(contentPaneSectionsFromContract(undefined), ['explore', 'legal']);
assert.deepEqual(contentPaneSectionsFromContract([]), ['explore', 'legal']);

/* 6 · Unknown keys are dropped, not rendered as placeholders. */
assert.deepEqual(
  contentPaneSectionsFromContract(['artifacts', 'left_rail', 'brand_nav']),
  ['artifacts', 'explore', 'legal'],
);

/* 7 · No duplicates, even when the backend sends them. */
assert.deepEqual(
  contentPaneSectionsFromContract(['legal', 'artifacts', 'legal']),
  ['legal', 'artifacts', 'explore'],
);

/* 8 · A full State 10 contract resolves in the backend's order with nothing lost. */
assert.deepEqual(
  contentPaneSectionsFromContract([
    'artifacts', 'documents', 'pathway', 'nda',
    'workspace_assessment', 'workspace_poc', 'workspace_integration',
    'decisions', 'governance',
    'outcomes', 'deployments', 'support', 'knowledge', 'meetings', 'feedback',
  ]).length,
  17,
);

console.log('contentPaneSections (Phase 3): all assertions passed');
