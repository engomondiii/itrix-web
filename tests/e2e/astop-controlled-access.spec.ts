import { expect, test } from '@playwright/test';

test('ASTOP public page explains controlled access without purchase or download CTAs', async ({ page }) => {
  await page.goto('/astop');
  await expect(page.getByRole('heading', { name: 'A System Trans-Observation Projector' })).toBeVisible();
  await expect(page.getByText(/not offered as an anonymous executable, public checkout or self-service subscription/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /buy astop|checkout|download astop/i })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /buy astop|checkout|download astop/i })).toHaveCount(0);
});

test('public language control has text identity, flags, and pressed state', async ({ page }) => {
  await page.goto('/astop');
  const english = page.getByRole('button', { name: 'Switch to English' }).first();
  const korean = page.getByRole('button', { name: '한국어로 전환' }).first();
  await expect(english).toBeVisible();
  await expect(korean).toBeVisible();
  await expect(english).toHaveAttribute('aria-pressed', 'true');
  await korean.click();
  await expect(page.getByRole('button', { name: '한국어 사용 중' }).first()).toHaveAttribute('aria-pressed', 'true');
});
