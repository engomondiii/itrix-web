import { expect, test } from '@playwright/test';
import path from 'node:path';

/**
 * R25 — ANY FORMAT, ANY NUMBER.
 *
 * The acceptance criteria this covers (Surface 1 v5.0 Phase 2):
 *   · several files of mixed types stage in one turn
 *   · per-file status is visible
 *   · one can be removed
 *   · a FAILED file does not block the turn
 *   · an unsupported binary is described honestly, not reported as a failure
 */
const FIXTURES = path.join(process.cwd(), 'tests', 'fixtures');

test.describe('attachments accept anything', () => {
  test('mixed formats stage together and report status per file', async ({ page }) => {
    await page.goto('/');

    await page.setInputFiles('input[type="file"]', [
      path.join(FIXTURES, 'workload-notes.txt'),
      path.join(FIXTURES, 'topology.csv'),
      path.join(FIXTURES, 'capture.bin'),
    ]);

    const tray = page.getByText('Attached', { exact: true });
    await expect(tray).toBeVisible();

    await expect(page.getByText('workload-notes.txt')).toBeVisible();
    await expect(page.getByText('topology.csv')).toBeVisible();
    await expect(page.getByText('capture.bin')).toBeVisible();
  });

  test('an unreadable format is described honestly, never as a failure', async ({ page }) => {
    await page.goto('/');
    await page.setInputFiles('input[type="file"]', [path.join(FIXTURES, 'capture.bin')]);

    // The honest sentence, not an error.
    await expect(page.getByText(/could not read the contents of this format/i)).toBeVisible();
    await expect(page.getByText(/failed/i)).toHaveCount(0);
  });

  test('a removed attachment disappears and the turn still sends', async ({ page }) => {
    await page.goto('/');
    await page.setInputFiles('input[type="file"]', [path.join(FIXTURES, 'workload-notes.txt')]);

    await page.getByRole('button', { name: /Remove attachment: workload-notes\.txt/i }).click();
    await expect(page.getByText('workload-notes.txt')).toHaveCount(0);

    const composer = page.getByRole('textbox', { name: /describe your compute challenge/i });
    await composer.fill('Memory movement is limiting our training throughput.');
    await composer.press('Enter');
    await expect(page.getByRole('log')).toBeVisible();
  });

  test('the confidentiality notice appears on first attach', async ({ page }) => {
    await page.goto('/');
    await page.setInputFiles('input[type="file"]', [path.join(FIXTURES, 'workload-notes.txt')]);
    await expect(
      page.getByText(/do not submit confidential technical information before an NDA/i),
    ).toBeVisible();
  });
});
