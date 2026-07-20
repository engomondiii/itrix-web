/**
 * The sidebar vocabulary is CLOSED (Surface 1 v5.0 §3.2).
 *
 * These are plain assertion functions rather than a framework suite: the repo
 * has no unit-test runner wired yet, and adding one is not Phase 1's job. Run
 * with `npx tsx tests/unit/sidebarSections.test.ts` (or import it from whatever
 * runner is adopted later) — every check throws on failure, so a non-zero exit
 * is a real failure.
 */

import {
  BASE_SIDEBAR_SECTIONS,
  defaultSectionsForState,
  isSidebarSection,
  resolveSidebarSection,
  sectionsFromContract,
} from '../../src/lib/journey/sidebarSections';

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(`FAIL: ${message}`);
  console.log(`  ok — ${message}`);
}

console.log('sidebarSections');

/* 1. An unknown key renders nothing. It is never guessed at and never throws. */
assert(
  resolveSidebarSection('totally_made_up') === null,
  'an unknown section key resolves to null rather than throwing',
);
assert(!isSidebarSection('totally_made_up'), 'an unknown key is not in the vocabulary');

/* 2. A KNOWN key with no renderer in this build is also null — that is a phase
      boundary, not a fault. */
assert(
  isSidebarSection('workspace_assessment'),
  'workspace_assessment is a known key even though Phase 1 cannot draw it',
);

/* 3. The base sections are always present, at every state and every identity. */
for (const key of BASE_SIDEBAR_SECTIONS) {
  assert(
    defaultSectionsForState(1).includes(key),
    `base section "${key}" is present at State 1`,
  );
  assert(
    defaultSectionsForState(10).includes(key),
    `base section "${key}" is still present at State 10`,
  );
}

/* 4. States 1–3 add nothing beyond the base — the thread carries the memory. */
assert(
  defaultSectionsForState(3).length === BASE_SIDEBAR_SECTIONS.length,
  'States 1-3 add no growth sections',
);

/* 5. The backend's answer wins. A contract that omits a growth section means the
      section does not render, even if the state would otherwise imply it. */
const authorized = sectionsFromContract(['documents'], 10);
assert(
  authorized.includes('documents'),
  'an authorized growth section is included',
);
assert(
  !authorized.includes('outcomes'),
  'a section the backend did NOT authorize is absent even at State 10',
);

/* 6. Base sections are unioned in, because orientation and policy access are not
      entitlements — and duplicates are dropped. */
assert(authorized.includes('legal'), 'the legal section survives a narrow contract');
assert(
  new Set(authorized).size === authorized.length,
  'the resolved list contains no duplicates',
);

console.log('sidebarSections — all checks passed');
