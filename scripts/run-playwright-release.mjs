import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';

const matrix = JSON.parse(readFileSync(new URL('../playwright.release.matrix.json', import.meta.url), 'utf8'));
const failed = [];
// Run every partition without masking any failure. Preserve each one's diagnostics
// before Playwright clears test-results for the next partition.
for (const partition of Object.keys(matrix)) {
  const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', `test:e2e:${partition}`], { stdio: 'inherit' });
  if (existsSync('test-results')) {
    mkdirSync('release-test-results', { recursive: true });
    cpSync('test-results', `release-test-results/${partition}`, { recursive: true });
  }
  if (result.status !== 0) failed.push(partition);
}
if (failed.length) {
  console.error(`Release partitions failed: ${failed.join(', ')}`);
  process.exitCode = 1;
} else {
  console.log('All release partitions passed.');
}
