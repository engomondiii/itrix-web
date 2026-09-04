import { test, expect } from '@playwright/test';

/**
 * Optional Question Ideas are user-controlled. The reviewer explicitly removed
 * automatic rotation/dwell animation; all ideas remain reachable without waiting.
 */

const PROMPTS = [
  'Our training and inference cost is rising faster than the value it creates.',
  'Memory movement, power, or cooling is limiting capacity.',
  'Our silicon needs a stronger software and runtime path.',
  'Our solver is slow, unstable, or difficult to reproduce.',
  'We are evaluating a technical, licensing, or strategic partnership.',
];

test('one prompt stays stable until the visitor changes it', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.prompt-carousel__stage .prompt-card');
  await expect(cards).toHaveCount(1);
  const first = await cards.first().innerText();
  await page.waitForTimeout(5500);
  expect(await cards.first().innerText()).toBe(first);
});

test('Previous and Next remain available and change the idea manually', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.prompt-carousel__stage .prompt-card').first();
  const first = await card.innerText();
  await page.getByRole('button', { name: 'Next example' }).click();
  await expect(card).not.toHaveText(first);
  await page.getByRole('button', { name: 'Previous example' }).click();
  await expect(card).toHaveText(first);
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

test('selecting a prompt populates the composer and does NOT submit', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Show all five' }).click();
  await page.locator('.prompt-card', { hasText: PROMPTS[3] }).click();

  await expect(page.locator('textarea.composer-textarea')).toHaveValue(PROMPTS[3]);
  await expect(page.locator('textarea.composer-textarea')).toBeFocused();
  await expect(page.locator('.working-shell')).toHaveCount(0);
});

test('the controls are named and the carousel has no dwell/progress animation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Previous example' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next example' })).toBeVisible();
  await expect(page.locator('.prompt-carousel__progress, .prompt-carousel__dwell')).toHaveCount(0);
  expect(await page.locator('.prompt-carousel [aria-live]').count()).toBe(0);
});
