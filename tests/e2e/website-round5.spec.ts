import { test, expect } from "@playwright/test";
import { FORM_LINKS } from "../../src/components/website/formLinks";

for (const lang of ["ko", "en"] as const) {
  const prefix = lang === "ko" ? "" : "/en";
  test(`${lang}: removed PoC URL returns an exact 301`, async ({ request }) => {
    const response = await request.get(`${prefix}/poc`, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe(`${prefix}/astop`);
  });
  test(`${lang}: privacy publication details`, async ({ page }) => {
    await page.goto(`${prefix}/privacy`);
    await expect(page).not.toHaveTitle(/draft|초안/i);
    await expect(page.locator("#s11")).toContainText(
      lang === "ko" ? "2026년 11월 2일" : "November 2, 2026",
    );
  });
  test(`${lang}: notice, cookie spacing and skip target`, async ({ page }) => {
    await page.goto(prefix || "/");
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.locator(".ck-bar")).toHaveCount(0);
    await expect(page.locator(".r3nt-btn.pri")).toHaveAttribute(
      "href",
      FORM_LINKS[lang].poc,
    );
    await expect(page.locator(".r3nt-btn.sub")).toHaveAttribute(
      "href",
      `${prefix}/astop`,
    );
    await page
      .getByRole("button", {
        name: lang === "ko" ? "닫기 ✕" : "Close ✕",
        exact: true,
      })
      .click();
    await expect(page.locator(".ck-bar")).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const root = document.querySelector(".itrix-reference")!;
          const height = document
            .querySelector(".ck-bar")!
            .getBoundingClientRect().height;
          return (
            Math.abs(
              parseFloat(getComputedStyle(root).paddingBottom) - height,
            ) < 1
          );
        }),
      )
      .toBe(true);
    await page.locator(".skip-link").first().focus();
    await expect(page.locator(".skip-link").first()).toBeVisible();
    await page.locator(".skip-link").first().press("Enter");
    await expect(page.locator("main#content")).toBeFocused();
  });
  for (const path of [
    "",
    "/astop",
    "/contact",
    "/partnership",
    "/privacy",
    "/terms",
  ]) {
    test(`${lang}${path}: localized forms and accessible content`, async ({
      page,
    }) => {
      await page.goto(`${prefix}${path}` || "/");
      await expect(page.locator("main#content")).toHaveCount(1);
      await expect(
        page.locator('a[href$="/poc"], a[href*="topic=interest"]'),
      ).toHaveCount(0);
      const forms = page.locator('a[href*="forms.gle/"]');
      expect(await forms.count()).toBeGreaterThan(0);
      for (const link of await forms.all()) {
        expect(Object.values(FORM_LINKS[lang])).toContain(
          await link.getAttribute("href"),
        );
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", "noopener");
      }
    });
  }
  for (const width of [360, 390, 768, 1024, 1280, 1440, 1920]) {
    test(`${lang}: layout at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(prefix || "/");
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      const sizes = await page.evaluate(() => {
        const rects = (selector: string) =>
          [...document.querySelectorAll(selector)].map((e) => {
            const { x, y, width, height } = e.getBoundingClientRect();
            return { x, y, width, height };
          });
        return {
          viewport: innerWidth,
          scroll: document.documentElement.scrollWidth,
          cards: rects(".pf-grid > :not(.tbc-group)"),
          columns: rects(".ft-cols > div"),
          stats: rects(".astop-figures > div:not([aria-hidden])"),
          contact: rects("#contact")[0],
        };
      });
      expect(sizes.scroll).toBeLessThanOrEqual(width + 1);
      expect(sizes.cards).toHaveLength(4);
      for (const card of sizes.cards) {
        expect(Math.abs(card.y - sizes.cards[0].y)).toBeLessThan(1);
        expect(Math.abs(card.height - sizes.cards[0].height)).toBeLessThan(1);
      }
      expect(Math.abs(sizes.columns[0].y - sizes.columns[1].y)).toBeLessThan(1);
      expect(Math.abs(sizes.contact.width - width)).toBeLessThan(1);
      for (const stat of sizes.stats)
        expect(
          Math.abs(
            (width <= 600 ? stat.x : stat.y) -
              (width <= 600 ? sizes.stats[0].x : sizes.stats[0].y),
          ),
        ).toBeLessThan(1);
    });
  }
}
