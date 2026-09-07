import { expect, test } from '@playwright/test';

const INVITE = 'tok_legal_race';

async function stubJourney(page: import('@playwright/test').Page) {
  await page.route(`**/api/journey/${INVITE}*`, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        state: 'INVITED',
        journeyNumber: 5,
        stateKey: 'INVITED',
        authorizedSurface: 'account_invite',
        reveals: [{ surface: 'account_invite' }],
        valueDelivered: true,
        accountInviteAvailable: true,
      }),
    }),
  );
}

function instruments(version: string) {
  return {
    instruments: [
      { slug: 'terms', version, effective: '2026-09-07' },
      { slug: 'privacy', version, effective: '2026-09-07' },
    ],
  };
}

test('invite stays on form, refreshes N+1 and requires fresh assent after legal race', async ({ page }) => {
  await stubJourney(page);

  let instrumentReads = 0;
  await page.route('**/api/legal/instruments', async (route) => {
    instrumentReads += 1;
    // The development reconciliation read sees the rendered version N. The explicit
    // post-race refresh sees N+1.
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(instruments(instrumentReads === 1 ? '1.2' : '1.3')),
    });
  });

  const claims: Array<{ assent?: Array<{ slug: string; version: string }> }> = [];
  await page.route('**/api/accounts/invite/**/claim', async (route) => {
    const payload = route.request().postDataJSON() as {
      assent?: Array<{ slug: string; version: string }>;
    };
    claims.push(payload);

    if (claims.length === 1) {
      await route.fulfill({
        status: 409,
        contentType: 'application/json',
        body: JSON.stringify({
          code: 'LEGAL_TERMS_CHANGED',
          detail: 'Legal instruments changed while assent was being submitted.',
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        client: { id: 'cli_legal_race' },
        requiresPasswordSet: true,
      }),
    });
  });

  await page.goto(`/c/${INVITE}/create-account`);
  await expect(page.locator('.assent__label')).toContainText('v1.2');

  await page.getByLabel('Full name').fill('Sora Kim');
  await page.getByLabel('Company / organization').fill('Example Corp');
  await page.getByLabel('Email address').fill('sora@example.com');
  await page.getByLabel('New password', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('Confirm new password').fill('a-long-enough-password');
  await page.locator('.assent__label').click();
  await page.getByRole('button', { name: /Create workspace/i }).click();

  await expect.poll(() => claims.length).toBe(1);
  expect(claims[0].assent?.find((row) => row.slug === 'terms')?.version).toBe('1.2');

  // The failed attempt did not navigate or turn into the generic invite fallback.
  await expect(page).toHaveURL(new RegExp(`/c/${INVITE}/create-account$`));
  await expect(page.getByText('The legal terms changed while you were reviewing them.')).toBeVisible();
  await expect(page.locator('.assent__box')).not.toBeChecked();
  await expect.poll(() => instrumentReads).toBeGreaterThanOrEqual(2);
  await expect(page.locator('.assent__label')).toContainText('v1.3');

  // A second submit without a new affirmative act remains blocked client-side.
  await page.getByRole('button', { name: /Create workspace/i }).click();
  await page.waitForTimeout(100);
  expect(claims).toHaveLength(1);

  await page.locator('.assent__label').click();
  await page.getByRole('button', { name: /Create workspace/i }).click();
  await expect.poll(() => claims.length).toBe(2);
  expect(claims[1].assent?.find((row) => row.slug === 'terms')?.version).toBe('1.3');
  expect(claims[1].assent?.find((row) => row.slug === 'privacy')?.version).toBe('1.3');

  // Successful retry follows the existing requires-password-set route.
  await expect(page).toHaveURL(/set-password/);
});

test('Korean invite race warning is localized through the shared legal error copy', async ({ page }) => {
  await stubJourney(page);
  await page.route('**/api/legal/instruments', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(instruments('1.3')) }),
  );
  await page.route('**/api/accounts/invite/**/claim', (route) =>
    route.fulfill({
      status: 409,
      contentType: 'application/json',
      body: JSON.stringify({ code: 'LEGAL_TERMS_CHANGED' }),
    }),
  );

  await page.goto(`/c/${INVITE}/create-account`);
  await page.evaluate(() => localStorage.setItem('itrix-locale', JSON.stringify({ state: { locale: 'ko' }, version: 0 })));
  await page.reload();

  await page.getByLabel('이름').fill('김소라');
  await page.getByLabel('회사 / 조직').fill('예시 회사');
  await page.getByLabel('이메일 주소').fill('sora@example.com');
  await page.getByLabel('새 비밀번호', { exact: true }).fill('a-long-enough-password');
  await page.getByLabel('새 비밀번호 확인').fill('a-long-enough-password');
  await page.locator('.assent__label').click();
  await page.getByRole('button', { name: /워크스페이스 만들기/ }).click();

  await expect(
    page.getByText('검토하시는 동안 법적 약관이 변경되었습니다. 계속하기 전에 최신 버전을 다시 확인해 주세요.'),
  ).toBeVisible();
  await expect(page.locator('.assent__box')).not.toBeChecked();
});
