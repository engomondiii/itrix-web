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
      },
    }),
  );
});
for (const prefix of ["", "/en"]) {
  for (const [path, id] of [
    ["poc", "FoGcs7LHhoTbmhtf8"],
    ["contact", "PCW2J9SF4wjDcPtA6"],
    ["partnership", "aACxKK1oggHiA8ueA"],
  ]) {
    test(`${prefix || "ko"} ${path} uses approved Google Form`, async ({
      page,
    }) => {
      await page.goto(`${prefix}/${path}`);
      const apply = page.locator(`section a[href="https://forms.gle/${id}"]`);
      await expect(apply).toHaveCount(1);
      await expect(apply).toHaveAttribute("target", "_blank");
      await expect(apply).toHaveAttribute("rel", /noopener/);
      await expect(
        page.locator("section input, section textarea, section select"),
      ).toHaveCount(0);
      await expect(page.locator(".rq-card")).toHaveCount(2);
    });
  }
}
for (const width of [360, 820, 1440]) {
  test(`layout and completed reduced-motion logs at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en/astop");
    await expect(page.locator('[data-call-count="existing"]')).toHaveText("10");
    await expect(page.locator('[data-call-count="astop"]')).toHaveText("1");
    await expect(page.locator(".ec-note")).toContainText("Example scenario");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    await page.goto("/en");
    await page.keyboard.press("Escape");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    const box = await page.locator("#contact").boundingBox();
    expect(box!.width).toBeLessThanOrEqual(width + 1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    if (width <= 820)
      await expect(page.locator('.nv-m a[lang="ko"]')).toBeVisible();
  });
}
test("notice qualifies savings, applies externally and remembers today", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/en");
  const modal = page.getByRole("dialog");
  await expect(modal).toContainText("in our internal tests");
  const apply = modal.getByRole("link", { name: /Apply now/ });
  await expect(apply).toHaveAttribute(
    "href",
    "https://forms.gle/FoGcs7LHhoTbmhtf8",
  );
  const learn = modal.getByRole("link", { name: "Learn about the program" });
  expect((await apply.boundingBox())!.y).toBeLessThan(
    (await learn.boundingBox())!.y,
  );
  await modal.getByRole("button", { name: "Don’t show today" }).click();
  await page.reload();
  await expect(modal).toHaveCount(0);
});
test("header language reaches the embedded assistant", async ({ page }) => {
  await page.goto("/en");
  await page.keyboard.press("Escape");
  await expect(
    page.locator('iframe[title="Ask itriX AI sales assistant"]'),
  ).toHaveAttribute("src", /lang=en/);
  await page.locator('nav .nv-links a[lang="ko"]').click();
  await page.keyboard.press("Escape");
  await expect(
    page.locator('iframe[title="Ask itriX AI sales assistant"]'),
  ).toHaveAttribute("src", /lang=ko/);
});
