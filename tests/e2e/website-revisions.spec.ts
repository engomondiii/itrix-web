import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    localStorage.setItem("itrixCookie", JSON.stringify({ necessary: true })),
  );
  await page.route("**/api/website/config", (r) =>
    r.fulfill({
      json: {
        notice: null,
        store: { state: "pre_launch", stores: [] },
        intake_enabled: false,
        captcha_site_key: "",
      },
    }),
  );
});
for (const prefix of ["", "/en"]) {
  test(`${prefix || "ko"} cross-page links reach sections`, async ({
    page,
  }) => {
    await page.goto(prefix + "/contact", { waitUntil: "domcontentloaded" });
    await page.locator(`nav a[href="${prefix}/#technology"]`).first().click();
    await expect(page.locator("#technology")).toBeInViewport();
    await expect.poll(() => page.locator("#technology").evaluate((e) => e.getBoundingClientRect().top)).toBeGreaterThanOrEqual(70);
    await page.goto(prefix + "/astop", { waitUntil: "domcontentloaded" });
    await page.locator("a.hb2").click();
    await expect(page.locator("#ask")).toBeInViewport();
  });
  test(`${prefix || "ko"} revision copy and partnership route`, async ({
    page,
  }) => {
    await page.goto(prefix + "/terms", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByText(
        prefix
          ? "These terms take effect on October 24, 2026."
          : "이 약관은 2026년 10월 24일부터 적용됩니다.",
        { exact: true },
      ),
    ).toBeVisible();
    await page.goto(prefix + "/partnership", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1:visible")).toHaveText(
      prefix
        ? "Partnership / Large-scale deployment"
        : "파트너십 / 대규모 도입",
    );
    await page.goto(prefix || "/", { waitUntil: "domcontentloaded" });
    await expect(page.locator(".ceo-msg p")).toHaveCount(14);
    await expect(page.locator(".ceo-msg p").first()).toHaveText(
      prefix
        ? "Redesigning the future of AI through mathematical innovation."
        : "수학적 혁신으로 AI의 미래를 새롭게 설계합니다.",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /og-image-v31-20261027.png/,
    );
  });
}
for (const width of [360, 820, 1440]) {
  test(`embedded assistant responsive at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/en#ask", { waitUntil: "domcontentloaded" });
    const frame = page.frameLocator(
      'iframe[title="Ask itriX AI sales assistant"]',
    );
    await expect(frame.locator(".embedded-chat")).toBeVisible();
    await expect(frame.locator(".arrival-bar")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    const bounds = await page.locator("#ask-chat").boundingBox();
    if (width === 1440) expect(bounds!.width).toBeGreaterThan(1000);
    await frame.locator("textarea").fill("Tell me about ASTOP");
    await frame.locator("textarea").press("Shift+Enter");
    await expect(frame.locator("textarea")).toHaveValue(
      "Tell me about ASTOP\n",
    );
    await frame.locator("textarea").press("Enter");
    await expect(frame.locator('.working-shell.embedded-chat')).toBeVisible();
      await expect(frame.locator('.transcript__log')).toContainText('Tell me about ASTOP');
      await expect(frame.locator('.conversation-rail__brand, .conversation-rail__foot, .working-shell__locale')).toHaveCount(0);
    expect(page.url()).not.toContain("/astop");
    expect(page.url()).toContain("/en");
  });
}
