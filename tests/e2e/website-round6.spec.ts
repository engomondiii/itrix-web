import { test, expect } from "@playwright/test";

for (const language of ["ko", "en"]) {
  const prefix = language === "ko" ? "" : "/en";
  const company =
    language === "ko"
      ? ["Leadership", "문의하기", "파트너십 문의", "PoC 신청 ↗"]
      : ["Leadership", "General Inquiry", "Partnership", "Request PoC ↗"];
  const legal =
    language === "ko"
      ? ["개인정보처리방침", "이용약관", "쿠키 설정"]
      : ["Privacy Policy", "Terms of Use", "Cookie settings"];
  for (const width of [390, 1440]) {
    test(`${language} footer and Leadership at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(() =>
        localStorage.setItem(
          "itrixCookie",
          JSON.stringify({ necessary: true }),
        ),
      );
      await page.goto(`${prefix}/partnership`);
      const footer = page.locator("footer .ft-cols");
      await expect(footer.locator("div").nth(0).locator("a")).toHaveText(
        company,
      );
      await expect(footer.locator("div").nth(1).locator("a,button")).toHaveText(
        legal,
      );
      await footer
        .getByRole("link", { name: "Leadership", exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`${prefix}/?#why$`));
      await expect(page.locator("#why")).toBeInViewport();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.locator("footer .ft-cols div").nth(0).locator("a"),
      ).toHaveText(company);
      // The fix must not disable the notice on an ordinary fresh home visit.
      await page.goto(prefix || "/");
      await expect(page.getByRole("dialog")).toBeVisible();
    });
  }
  for (const path of ["contact", "partnership"]) {
    test(`${language} ${path} uses shortened instructions`, async ({
      page,
    }) => {
      await page.goto(`${prefix}/${path}`);
      await expect(page.locator("main")).not.toContainText(
        /business days|영업일|로그인 없이|does not require sign-in|It takes about/,
      );
      await expect(
        page.getByText("Google Forms opens in a new tab", { exact: true }),
      ).toHaveCount(0);
      await expect(
        page.getByText("새 창에서 Google Forms가 열립니다", { exact: true }),
      ).toHaveCount(0);
      await expect(page.locator("main")).toContainText(
        language === "ko"
          ? "아래 버튼을 누르면 새 창에서 문의서가 열립니다."
          : "The button below opens the form in a new tab.",
      );
    });
  }
}
