/**
 * The conversation-rail vocabulary (Architecture v2.7 §11.6).
 *
 * Runnable with `node --test` once a TS loader is configured, or by a future vitest
 * setup. It is written as plain assertions with no framework import so it can move
 * to whichever runner this repo settles on — the repo has no unit runner wired yet,
 * and the shape of the assertions is the durable part.
 *
 * THE CASE THAT MATTERS is the third one. Backend v7.0 Phase 1 is not deployed yet,
 * so a live backend still sends the v6.0 `sidebar_sections` vocabulary — which
 * contains `new_review`, `brand_nav`, `explore`, `legal` and a growing family of
 * workspace keys. If any of those leaked into the rail, v6.0 would have removed the
 * navigation from the arrival screen and quietly put it back one state later.
 */
import assert from 'node:assert/strict';
import {
  CONVERSATION_RAIL_SECTIONS,
  isRailSection,
  railSectionsFromContract,
} from '../../src/lib/journey/railSections';

/* 1 · The vocabulary is exactly three keys and never grows with state. */
assert.deepEqual([...CONVERSATION_RAIL_SECTIONS], ['new_chat', 'conversations', 'account']);
assert.equal(isRailSection('new_chat'), true);
assert.equal(isRailSection('workspace_assessment'), false);
assert.equal(isRailSection('explore'), false);
assert.equal(isRailSection('legal'), false);

/* 2 · An empty contract still resolves to all three: they are orientation, not
       entitlement. A visitor with no relationship needs a way to start one. */
assert.deepEqual(railSectionsFromContract(undefined, undefined), [
  'new_chat', 'conversations', 'account',
]);

/* 3 · A v6.0 payload maps `new_review` forward and DROPS everything that became a
       content-pane section. This is the leak-prevention case. */
const legacy = [
  'brand_nav', 'new_review', 'conversations', 'explore', 'legal',
  'documents', 'pathway', 'nda', 'workspace_assessment', 'outcomes', 'support',
];
const resolved = railSectionsFromContract(undefined, legacy);
assert.deepEqual(resolved, ['new_chat', 'conversations', 'account']);
for (const dropped of ['brand_nav', 'explore', 'legal', 'documents', 'workspace_assessment']) {
  assert.equal(resolved.includes(dropped as never), false, `${dropped} must not reach the rail`);
}

/* 4 · The backend's ORDER is preserved where it gave one. */
assert.deepEqual(
  railSectionsFromContract(['conversations', 'new_chat'], undefined),
  ['conversations', 'new_chat', 'account'],
);

/* 5 · A present-but-narrow new key is NOT widened by a stale alias. A backend that
       says "these two" must be believed about those two. */
assert.deepEqual(
  railSectionsFromContract(['conversations'], ['new_review', 'conversations', 'account']),
  ['conversations', 'new_chat', 'account'],
);

/* 6 · Unknown keys are dropped rather than rendered as placeholders. */
assert.deepEqual(
  railSectionsFromContract(['new_chat', 'left_rail', 'right_rail'], undefined),
  ['new_chat', 'conversations', 'account'],
);

console.log('railSections: all assertions passed');
