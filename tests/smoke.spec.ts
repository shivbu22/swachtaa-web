import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("desktop journey renders without horizontal overflow", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Make every");
  await expect(page.locator("#the-loop")).toBeVisible();
  await expect(page.locator("#operators")).toContainText("A report is only the beginning");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test("operator sandbox advances and resets a synthetic ticket", async ({ page }) => {
  await page.goto("/#operators");
  const advance = page.getByRole("button", { name: /Advance to Verify/i });
  await expect(advance).toBeVisible();
  await advance.click();
  await expect(page.getByRole("heading", { name: "Verify" })).toBeVisible();
  await page.getByRole("button", { name: /Advance to Route/i }).click();
  await page.getByRole("button", { name: /Advance to Resolve/i }).click();
  await page.getByRole("button", { name: /Advance to Confirm/i }).click();
  await page.getByRole("button", { name: /Reset this example/i }).click();
  await expect(page.getByRole("heading", { name: "Report" })).toBeVisible();
});

test("mobile navigation is keyboard reachable and closes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
  await expect(page.getByRole("link", { name: "The loop" }).last()).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
});

test("reduced motion keeps hero content visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  const preloaderCount = await page.locator(".preloader").count();
  expect(preloaderCount).toBe(0);
});

test("core page has no critical accessibility violations", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze();
  expect(results.violations).toEqual([]);
});
