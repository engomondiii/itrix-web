import { expect, test } from '@playwright/test';

const configuration = {notice:null,store:{state:'pre_launch',stores:[]},intake_enabled:false,captcha_site_key:''};
test.beforeEach(async ({ page }) => {
  await page.route('**/api/website/config', route=>route.fulfill({json:configuration}));
});
for (const width of [360,390,820,1440]) {
  test(`public website has no horizontal overflow at ${width}`, async ({ page }) => {
    await page.setViewportSize({width,height:900});
    for (const route of ['/en','/en/astop','/en/poc','/en/contact']) {
      await page.goto(route);
      await expect(page.locator('.itrix-reference')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
      await expect(page.locator('a[href*="apps.apple.com"],a[href*="apps.microsoft.com"]')).toHaveCount(0);
    }
  });
}
test('forms validate locally and never show demo success', async ({ page })=>{
  await page.goto('/en/poc');
  await page.getByRole('button',{name:/Submit PoC request/}).click();
  await expect(page.getByText('This field is required.',{exact:true}).first()).toBeVisible();
  await expect(page.getByText('Please complete the spam check.',{exact:true})).toBeVisible();
});
test('same-page language switch and real Ask X embedding',async({page})=>{
  await page.goto('/en');
  await expect(page.locator('iframe[title="Ask X AI sales assistant"]')).toHaveAttribute('src',/\/ask-x\?lang=en/);
  await page.goto('/en/astop');
  await page.getByRole('link',{name:'KO',exact:true}).first().click();
  await expect(page).toHaveURL(/\/astop$/);
  await expect(page.locator('html')).toHaveAttribute('lang','ko');
});
test('real missing pages use the supplied error design',async({page})=>{
  const response=await page.goto('/en/not-a-real-page');
  expect(response?.status()).toBe(404);
  await expect(page.locator('.itrix-reference')).toBeVisible();
});
