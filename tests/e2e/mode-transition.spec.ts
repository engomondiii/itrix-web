import { test, expect } from '@playwright/test';

/**
 * ARRIVAL → WORKING IS A MOUNT, NOT A NAVIGATION (R21, R33, Architecture v2.7 §2.6).
 *
 * The gate sits above the route tree in app/layout.tsx precisely so that submitting
 * mounts two zones AROUND a tree that is already on screen. Three things must
 * survive it, and each has cost this project a bug at some point:
 *
 *   · the composer must not remount — the visitor's focus is in it;
 *   · the transcript node must not unmount — their sentence is in it;
 *   · an in-flight upload must not be cancelled — their file is in it.
 */

test('both zones are absent at State 1 and present at State 2', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.conversation-rail')).toHaveCount(0);

  await page.locator('textarea.composer-textarea').fill(
    'Our inference cost is rising faster than the value it creates.',
  );
  await page.getByRole('button', { name: 'Ask itriX' }).click();

  await expect(page.locator('.working-shell')).toBeVisible();
  await expect(page.locator('.conversation-rail')).toBeVisible();
});

test('submitting fires no route transition and keeps the composer mounted', async ({ page }) => {
  await page.goto('/');

  /* Tag the live node. If the composer remounts, the marker is gone — a check that
     survives any amount of re-rendering, unlike comparing screenshots. */
  await page.evaluate(() => {
    const el = document.querySelector('textarea.composer-textarea');
    if (el) (el as HTMLElement).dataset.probe = 'kept';
  });

  let navigated = false;
  page.on('framenavigated', () => { navigated = true; });

  await page.locator('textarea.composer-textarea').fill('Memory movement is limiting our capacity.');
  await page.locator('textarea.composer-textarea').press('Enter');

  await expect(page.locator('.working-shell')).toBeVisible();
  expect(navigated).toBe(false);
  await expect(page.locator('textarea.composer-textarea[data-probe="kept"]')).toHaveCount(1);
  /* The URL follows via replaceState, which is a rewrite rather than a navigation. */
  expect(page.url()).toContain('/review/');
});

test('the visitor turn is still on screen after the zones mount', async ({ page }) => {
  await page.goto('/');
  const sentence = 'Our solver is slow and difficult to reproduce.';
  await page.locator('textarea.composer-textarea').fill(sentence);
  await page.locator('textarea.composer-textarea').press('Enter');
  await expect(page.locator('.transcript__log')).toContainText(sentence);
});
