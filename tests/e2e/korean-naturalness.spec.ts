import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

const portalCopySource = readFileSync('src/lib/content/portalCopy.ts', 'utf8');
const portalLocaleSource = readFileSync('src/lib/i18n/portalConfigLocale.ts', 'utf8');
const astopSuccessCopySource = readFileSync('src/lib/content/astopSuccessCopy.ts', 'utf8');

test('Korean arrival copy reads naturally and persists into the auth zone', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '한국어로 전환' }).first().click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('컴퓨팅이 무엇을 더 잘해주면 좋을까요?');
  await expect(page.getByText('컴퓨팅 인프라 기업')).toBeVisible();

  await page.goto('/sign-in');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('워크스페이스');
});

test('Korean controlled-workspace copy keeps canonical product names and avoids known literal fallbacks', () => {
  expect(portalCopySource).toContain('`${firstName}님, 다시 오신 것을 환영합니다.`');
  expect(portalCopySource).toContain("body:'관측 오버헤드가 실질적이라면 후보 워크플로와 적합성을 확인하는 통제된 다음 단계로 진행할 수 있습니다.'");
  expect(portalCopySource).toContain("preparing:'itriX가 답변을 준비하고 있습니다…'");
  expect(portalCopySource).not.toContain('다시 오신 것을 환영합니다, ${firstName}.');
  expect(portalCopySource).not.toContain('itriX Specialist와 계속하기');

  expect(portalLocaleSource).toContain("assessment:'ALPHA Compute 평가'");
  expect(portalLocaleSource).not.toContain("assessment:'ALPHA 평가'");
  expect(portalLocaleSource).not.toContain("assessment:'어세스먼트'");

  expect(astopSuccessCopySource).toContain("title: 'ASTOP 고객 성공'");
  expect(astopSuccessCopySource).toContain("astopStage: 'ASTOP 단계'");
  expect(astopSuccessCopySource).not.toContain('ALPHA 평가');
});
