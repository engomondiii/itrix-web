import { test, expect } from '@playwright/test';

/**
 * THE ROTATING PROMPTS (R38, Surface 1 v6.0 §2.3).
 *
 * A carousel is only acceptable here because all five prompts stay reachable
 * WITHOUT WAITING. That is what these tests are really protecting: rotation is a
 * presentation choice, and it must not become the only way to see four fifths of
 * the content.
 */

const PROMPTS = [
  'Our training and inference cost is rising faster than the value it creates.',
  'Memory movement, power, or cooling is limiting capacity.',
  'Our silicon needs a stronger software and runtime path.',
  'Our solver is slow, unstable, or difficult to reproduce.',
  'We are evaluating a technical, licensing, or strategic partnership.',
];

test('one prompt is visible at a time, and rotation advances', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.prompt-carousel__stage .prompt-card');
  await expect(cards).toHaveCount(1);

  const first = await cards.first().innerText();
  /* Dwell is 4.5s. Waiting on the text rather than on a timer keeps this from being
     a flaky sleep. */
  await expect(cards.first()).not.toHaveText(first, { timeout: 12000 });
});

test('Show all five reveals every prompt', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Show all five' }).click();
  const cards = page.locator('.prompt-carousel__stage .prompt-card');
  await expect(cards).toHaveCount(5);
  for (const prompt of PROMPTS) {
    await expect(page.locator('.prompt-carousel__stage')).toContainText(prompt);
  }
});

test('rotation pauses on hover and on focus', async ({ page }) => {
  await page.goto('/');
  const stage = page.locator('.prompt-carousel__stage');
  await page.locator('.prompt-carousel').hover();
  const before = await stage.innerText();
  await page.waitForTimeout(6000);
  expect(await stage.innerText()).toBe(before);

  await page.locator('.prompt-carousel__step').first().focus();
  const focused = await stage.innerText();
  await page.waitForTimeout(6000);
  expect(await stage.innerText()).toBe(focused);
});

test('selecting a prompt populates the composer and does NOT submit', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Show all five' }).click();
  await page.locator('.prompt-card', { hasText: PROMPTS[3] }).click();

  await expect(page.locator('textarea.composer-textarea')).toHaveValue(PROMPTS[3]);
  await expect(page.locator('textarea.composer-textarea')).toBeFocused();
  /* Populating is not sending. The visitor decides when the review begins. */
  await expect(page.locator('.working-shell')).toHaveCount(0);
});

test('the controls exist and are named, not hover-only', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Previous example' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next example' })).toBeVisible();
});

test('the group is not a live region', async ({ page }) => {
  await page.goto('/');
  const live = await page.locator('.prompt-carousel [aria-live]').count();
  expect(live).toBe(0);
});

test.describe('reduced motion', () => {
  test.use({ colorScheme: null, reducedMotion: 'reduce' });

  test('renders all five statically and never auto-advances', async ({ page }) => {
    await page.goto('/');
    const cards = page.locator('.prompt-carousel__stage .prompt-card');
    await expect(cards).toHaveCount(5);
    const before = await page.locator('.prompt-carousel__stage').innerText();
    await page.waitForTimeout(6000);
    expect(await page.locator('.prompt-carousel__stage').innerText()).toBe(before);
    /* With no rotation there is nothing to step through. */
    await expect(page.getByRole('button', { name: 'Next example' })).toHaveCount(0);
  });
});
