import { test, expect } from '@playwright/test';
import { EXAMPLE_PROMPT_DEFINITIONS } from '../../src/lib/content/examplePrompts';

/**
 * Optional Question Ideas are user-controlled, localized guidance only. They populate
 * the composer but never submit, classify, or mutate relationship/product state.
 */

const english = EXAMPLE_PROMPT_DEFINITIONS.map((item) => ({
  label: item.label.en,
  prompt: item.prompt.en,
}));
const korean = EXAMPLE_PROMPT_DEFINITIONS.map((item) => ({
  label: item.label.ko,
  prompt: item.prompt.ko,
}));

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
  await expect.poll(async () => card.innerText()).toBe(first);
});

test('Show all five uses the canonical English source', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Show all five' }).click();
  const stage = page.locator('.prompt-carousel__stage');
  await expect(stage.locator('.prompt-card')).toHaveCount(5);
  for (const item of english) {
    await expect(stage).toContainText(item.label);
    await expect(stage).toContainText(item.prompt);
  }
});

test('English selection populates composer but never submits or changes relationship state', async ({ page }) => {
  let threadPosts = 0;
  await page.route('**/api/threads', async (route) => {
    if (route.request().method() === 'POST') threadPosts += 1;
    await route.fallback();
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Show all five' }).click();
  const chosen = english[3];
  await page.locator('.prompt-card', { hasText: chosen.prompt }).click();

  await expect(page.locator('textarea.composer-textarea')).toHaveValue(chosen.prompt);
  await expect(page.locator('textarea.composer-textarea')).toBeFocused();
  await expect(page.locator('.working-shell')).toHaveCount(0);
  expect(threadPosts).toBe(0);
});

test('Korean locale updates all five ideas and Korean selection fills Korean composer', async ({ page }) => {
  let threadPosts = 0;
  await page.route('**/api/threads', async (route) => {
    if (route.request().method() === 'POST') threadPosts += 1;
    await route.fallback();
  });

  await page.goto('/');
  await page.getByRole('button', { name: '한국어로 전환' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.getByRole('heading', { name: '질문 아이디어 (선택)' })).toBeVisible();
  await page.getByRole('button', { name: '다섯 개 모두 보기' }).click();

  const stage = page.locator('.prompt-carousel__stage');
  await expect(stage.locator('.prompt-card')).toHaveCount(5);
  for (const item of korean) {
    await expect(stage).toContainText(item.label);
    await expect(stage).toContainText(item.prompt);
  }

  const chosen = korean[4];
  await stage.locator('.prompt-card', { hasText: chosen.prompt }).click();
  await expect(page.locator('textarea.composer-textarea')).toHaveValue(chosen.prompt);
  await expect(page.locator('textarea.composer-textarea')).toBeFocused();
  await expect(page.locator('.working-shell')).toHaveCount(0);
  expect(threadPosts).toBe(0);

  await page.getByRole('button', { name: '영어로 전환' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(stage).toContainText(english[0].prompt);
  await expect(stage).not.toContainText(korean[0].prompt);
});

test('the controls are named and the carousel has no dwell/progress animation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Previous example' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Next example' })).toBeVisible();
  await expect(page.locator('.prompt-carousel__progress, .prompt-carousel__dwell')).toHaveCount(0);
  expect(await page.locator('.prompt-carousel [aria-live]').count()).toBe(0);
});
