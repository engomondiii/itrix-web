import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const e2eDir = path.join(root, 'tests', 'e2e');
const matrix = JSON.parse(
  fs.readFileSync(path.join(root, 'playwright.release.matrix.json'), 'utf8'),
);

const discovered = fs
  .readdirSync(e2eDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('.spec.ts'))
  .map((entry) => entry.name)
  .sort();

const assignments = Object.entries(matrix).flatMap(([partition, files]) =>
  files.map((file) => ({ partition, file })),
);
const assigned = assignments.map(({ file }) => file).sort();
const counts = new Map();
for (const { file } of assignments) counts.set(file, (counts.get(file) ?? 0) + 1);

const missing = discovered.filter((file) => !counts.has(file));
const stale = assigned.filter((file) => !discovered.includes(file));
const duplicates = [...counts.entries()].filter(([, count]) => count !== 1);

if (missing.length || stale.length || duplicates.length) {
  console.error('Playwright release matrix is incomplete or ambiguous.');
  if (missing.length) console.error(`Unassigned specs: ${missing.join(', ')}`);
  if (stale.length) console.error(`Matrix entries with no spec: ${stale.join(', ')}`);
  if (duplicates.length) {
    console.error(
      `Specs assigned more than once: ${duplicates.map(([file, count]) => `${file} (${count})`).join(', ')}`,
    );
  }
  process.exit(1);
}

console.log(
  `Playwright release matrix covers ${discovered.length} specs exactly once across ${Object.keys(matrix).length} partitions.`,
);
