// Throwaway one-off screenshot. Deleted after each task.
import { test } from "@playwright/test";

test("capture fresh diff", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.screenshot({
    path: "tests/screenshots/diff/LIVE-full.png",
    fullPage: true,
  });
});