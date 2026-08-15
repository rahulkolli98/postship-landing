import { test, expect, chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Phase 0 smoke tests — landing app.
 *
 * The full landing page (TASK-012) replaces all smoke sub-pages (`/button-smoke`,
 * `/waitlist-smoke`, `/hero-smoke`, `/pricing-smoke`, `/footer-smoke`). Tests
 * now point at `/` (the real landing page) for any UI assertion.
 *
 * Covered:
 *  - TASK-001:   landing app boots on :3000
 *  - TASK-002:   globals.css loads + Tailwind utilities resolve
 *  - TASK-003:   Convex env + codegen + provider wired
 *  - TASK-003b:  /api/waitlist round-trip works (HTTP path)
 *  - TASK-004:   OpenNext config + build artifacts present
 *  - TASK-008:   Hero specifics (highlight not italic, sticker rotation, etc.)
 *  - TASK-012:   Full landing page assembled + every section renders + no pageerror
 *
 * Screenshots land in `tests/screenshots/`.
 *
 * Run from inside `landing/`:
 *   npx playwright test
 */
test.describe("Phase 0 — landing page boots", () => {
  test("TASK-001: landing app boots on :3000", async ({ page }) => {
    const response = await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    // The hero headline is now the visible h1 (not the default Next.js placeholder)
    await expect(page.locator("h1").first()).toBeVisible();
    await page.screenshot({
      path: "tests/screenshots/01-landing-top.png",
      fullPage: false,
    });
  });

  test("TASK-002: globals.css loads with Tailwind utility classes", async ({
    page,
  }) => {
    const response = await page.goto("/", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    const classProbe = await page.evaluate(() => {
      const html = document.documentElement.outerHTML;
      return /class="[^"]*\b(flex|grid|p-\d|m-\d|text-)/.test(html);
    });
    expect(classProbe).toBe(true);
  });

  test("TASK-003: Convex env + codegen + provider wired", async ({ page }) => {
    const envPath = path.resolve(process.cwd(), ".env.local");
    expect(fs.existsSync(envPath)).toBe(true);
    const envContents = fs.readFileSync(envPath, "utf-8");
    expect(envContents).toContain("NEXT_PUBLIC_CONVEX_URL");

    const generatedDir = path.resolve(process.cwd(), "convex/_generated");
    expect(fs.existsSync(generatedDir)).toBe(true);
    expect(fs.existsSync(path.join(generatedDir, "server.d.ts"))).toBe(true);

    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    const response = await page.goto("/", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    expect(errors).toEqual([]);
  });

  test("TASK-003b: /api/waitlist round-trip works", async ({ request }) => {
    const first = await request.post("/api/waitlist", {
      data: {
        email: `founder-${Date.now()}@postship.app`,
        source: "playwright_smoke_test",
        turnstileToken: "test-bypass",
      },
    });
    expect(first.status()).toBe(200);
    const firstBody = await first.json();
    expect(firstBody.ok).toBe(true);
    expect(firstBody.alreadyJoined).toBe(false);
    expect(typeof firstBody.id).toBe("string");

    const dup = await request.post("/api/waitlist", {
      data: {
        email: `founder-${Date.now()}@postship.app`,
        source: "x",
        turnstileToken: "test-bypass",
      },
    });
    expect(dup.status()).toBe(200);

    const bad = await request.post("/api/waitlist", {
      data: { email: "not-an-email", turnstileToken: "test-bypass" },
    });
    expect(bad.status()).toBe(400);
    const badBody = await bad.json();
    expect(badBody.ok).toBe(false);
  });

  test("TASK-004: OpenNext Cloudflare adapter wired + build artifacts exist", async () => {
    expect(fs.existsSync("wrangler.jsonc")).toBe(true);
    expect(fs.existsSync("open-next.config.ts")).toBe(true);
    expect(fs.existsSync(".dev.vars")).toBe(true);
    expect(fs.existsSync("public/_headers")).toBe(true);

    const wranglerRaw = fs.readFileSync("wrangler.jsonc", "utf-8");
    const stripped = wranglerRaw
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    const wranglerConfig = JSON.parse(stripped);
    expect(wranglerConfig.main).toBe(".open-next/worker.js");
    expect(wranglerConfig.compatibility_flags).toContain("nodejs_compat");
    expect(wranglerConfig.name).toBe("postship-landing");

    expect(fs.existsSync(".open-next/worker.js")).toBe(true);
    expect(fs.statSync(".open-next/worker.js").size).toBeGreaterThan(0);
    expect(fs.existsSync(".open-next/assets/_headers")).toBe(true);
    const headersContent = fs.readFileSync(
      ".open-next/assets/_headers",
      "utf-8",
    );
    expect(headersContent).toContain("/_next/static/*");
    expect(headersContent).toContain(
      "Cache-Control: public,max-age=31536000,immutable",
    );

    const nextConfigSrc = fs.readFileSync("next.config.ts", "utf-8");
    expect(nextConfigSrc).toContain("initOpenNextCloudflareForDev");
    expect(nextConfigSrc).toContain("@opennextjs/cloudflare");
  });

  test("TASK-008: Hero specifics — highlight not italic, sticker rotated, CTAs present", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    const response = await page.goto("/", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);
    expect(errors).toEqual([]);

    // Headline + accent word
    const headline = page.locator("h1").first();
    await expect(headline).toContainText(/everywhere/i);
    const accentSpan = headline.locator("span", { hasText: "everywhere" });
    await expect(accentSpan).toBeVisible();
    const accentBg = await accentSpan.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor,
    );
    expect(
      accentBg === "rgb(199, 249, 75)" || accentBg.startsWith("oklch("),
    ).toBe(true);
    // Founder explicitly rejected italic — this guards against that regression
    const accentFontStyle = await accentSpan.evaluate(
      (el) => window.getComputedStyle(el).fontStyle,
    );
    expect(accentFontStyle).toBe("normal");

    // Sticker rotated
    const sticker = page.getByText("NEW · 4 PLATFORMS");
    await expect(sticker).toBeVisible();
    const stickerRotate = await sticker.evaluate(
      (el) => window.getComputedStyle(el).rotate,
    );
    expect(stickerRotate).toBe("-3deg");

    // CTAs
    await expect(
      page.getByRole("link", { name: /join the waitlist/i }).first(),
    ).toBeVisible();

    // Centered (not 2-column)
    const headlineAlign = await headline.evaluate(
      (el) => window.getComputedStyle(el).textAlign,
    );
    expect(headlineAlign).toBe("center");
  });

  test("TASK-014: layout adapts at standard breakpoints (360, 768, 1024, 1440)", async () => {
    const breakpoints = [
      { name: "360", width: 360, height: 800 },
      { name: "768", width: 768, height: 1024 },
      { name: "1024", width: 1024, height: 768 },
      { name: "1440", width: 1440, height: 900 },
    ];
    const browser = await chromium.launch();
    for (const bp of breakpoints) {
      const ctx = await browser.newContext({
        viewport: { width: bp.width, height: bp.height },
      });
      const page = await ctx.newPage();
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      await page.goto("/", { waitUntil: "networkidle" });

      // At every breakpoint the key sections should be visible and the page
      // should not error. Hero CTAs + pricing + FinalCta + Footer all
      // should be present.
      await expect(
        page.getByRole("link", { name: /join the waitlist/i }).first(),
      ).toBeVisible();
      await expect(
        page.getByTestId("pricing-tier-trial"),
      ).toBeVisible();
      await expect(
        page.getByTestId("pricing-tier-creator"),
      ).toBeVisible();
      await expect(
        page.getByTestId("pricing-tier-pro"),
      ).toBeVisible();
      await expect(
        page.getByText(/Stop rewriting\. Start shipping\./),
      ).toBeVisible();
      await expect(page.getByText(/© 2026 POSTSHIP/)).toBeVisible();
      expect(errors).toEqual([]);
      await ctx.close();
    }
    await browser.close();
  });

  test("TASK-013: SEO meta tags render in the head (title, OG, Twitter, canonical)", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const meta = await page.evaluate(() => {
      const get = (selector: string) => {
        const el = document.head.querySelector(selector);
        if (!el) return null;
        return {
          tag: el.tagName,
          content:
            el.getAttribute("content") ||
            el.getAttribute("href") ||
            el.getAttribute("charSet") ||
            el.getAttribute("charset"),
        };
      };
      return {
        title: document.title,
        description: get('meta[name="description"]'),
        keywords: get('meta[name="keywords"]'),
        ogTitle: get('meta[property="og:title"]'),
        ogType: get('meta[property="og:type"]'),
        ogUrl: get('meta[property="og:url"]'),
        ogSiteName: get('meta[property="og:site_name"]'),
        ogImage: get('meta[property="og:image"]'),
        twitterCard: get('meta[name="twitter:card"]'),
        twitterTitle: get('meta[name="twitter:title"]'),
        twitterImage: get('meta[name="twitter:image"]'),
        robots: get('meta[name="robots"]'),
        googleBot: get('meta[name="googlebot"]'),
        canonical: get('link[rel="canonical"]'),
        appleMobile: get('meta[name="mobile-web-app-capable"]'),
        appleTitle: get('meta[name="apple-mobile-web-app-title"]'),
        viewport: get('meta[name="viewport"]'),
        manifest: get('link[rel="manifest"]'),
        charset: get('meta[charset]'),
        lang: document.documentElement.lang,
      };
    });

    expect(meta.title).toBe("Postship — Stop rewriting. Start shipping.");
    expect(meta.lang).toBe("en");
    expect(meta.charset?.content).toBe("utf-8");
    expect(meta.description?.content).toContain("One master description");
    expect(meta.keywords?.content).toContain("Postship");
    expect(meta.ogTitle?.content).toContain("Postship");
    expect(meta.ogType?.content).toBe("website");
    expect(meta.ogUrl?.content).toBe("https://postship.app");
    expect(meta.ogSiteName?.content).toBe("Postship");
    expect(meta.ogImage?.content).toBe("https://postship.app/og-image.png");
    expect(meta.twitterCard?.content).toBe("summary_large_image");
    expect(meta.twitterTitle?.content).toContain("Postship");
    expect(meta.twitterImage?.content).toBe("https://postship.app/og-image.png");
    expect(meta.robots?.content).toContain("index");
    expect(meta.robots?.content).toContain("follow");
    expect(meta.googleBot?.content).toContain("index");
    expect(meta.canonical?.content).toBe("https://postship.app");
    expect(meta.appleMobile?.content).toBe("yes");
    expect(meta.appleTitle?.content).toBe("Postship");
    expect(meta.viewport?.content).toContain("width=device-width");
    expect(meta.manifest?.content).toBe("https://postship.app/site.webmanifest");
  });

  test("TASK-012: nav links scroll to anchor sections", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Each nav link should scroll to its anchor section
    const links = [
      { name: /system/i, anchor: "#system" },
      { name: /workflow/i, anchor: "#workflow" },
      { name: /pricing/i, anchor: "#pricing" },
    ];
    for (const { name, anchor } of links) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(150);
      await page.getByRole("link", { name }).first().click();
      await page.waitForTimeout(400);
      const section = page.locator(anchor);
      await expect(section).toBeInViewport();
    }
  });

  test("TASK-012: full landing page assembles all sections with no pageerror", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto("/", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    // 1. TopNav
    await expect(page.getByRole("link", { name: /Postship/ })).toBeVisible();
    const activeLink = page.locator("nav a[aria-current='page']");
    await expect(activeLink).toHaveText(/system/i);

    // 2. Hero
    await expect(page.locator("h1").first()).toContainText(/everywhere/i);
    await expect(page.getByText(/NEW · 4 PLATFORMS/)).toBeVisible();

    // 3. HowItWorks
    await expect(page.getByText(/Drop your pre-shot videos/)).toBeVisible();
    await expect(page.getByText(/Write the description once/)).toBeVisible();
    await expect(page.getByText(/Hit ship\./)).toBeVisible();

    // 4. LayeredCapabilities
    await expect(page.getByText(/Capture layer\./)).toBeVisible();
    await expect(page.getByText(/Copy adaptation layer\./)).toBeVisible();
    await expect(page.getByText(/Publish layer\./)).toBeVisible();
    await expect(page.getByText(/Insight layer\./)).toBeVisible();

    // 5. StatsNumbers — scope to the section so "6" doesn't match other copy
    const statsSection = page.locator("section").filter({
      has: page.getByText(/the move in mono/i),
    });
    await expect(
      statsSection.locator("div").filter({ hasText: /^6$/ }).first(),
    ).toBeVisible();
    await expect(statsSection.getByText("<5s")).toBeVisible();

    // 6. Pricing
    await expect(page.getByTestId("pricing-tier-trial")).toBeVisible();
    await expect(page.getByTestId("pricing-tier-creator")).toBeVisible();
    await expect(page.getByTestId("pricing-tier-pro")).toBeVisible();
    await expect(page.getByTestId("pricing-cta-trial")).toContainText(
      /7-day trial/,
    );
    await expect(page.getByTestId("pricing-cta-creator")).toContainText(
      /Get Creator/,
    );
    await expect(page.getByTestId("pricing-cta-pro")).toContainText(/Get Pro/);

    // 7. FAQ
    await expect(page.getByTestId("faq-contact-card")).toBeVisible();
    const firstFaq = page.getByTestId("faq-item").first();
    await expect(firstFaq).toBeVisible();
    await firstFaq.locator("summary").click();
    await expect(firstFaq).toHaveJSProperty("open", true);

    // 8. Waitlist form (now embedded in the page footer area)
    await expect(page.getByTestId("waitlist-email").first()).toBeVisible();

    // 9. Final CTA + Footer
    await expect(page.locator("#trial")).toBeVisible();
    await expect(page.getByText(/© 2026 POSTSHIP/)).toBeVisible();

    // No page errors throughout
    expect(errors).toEqual([]);

    // Full-page screenshot for visual review
    await page.screenshot({
      path: "tests/screenshots/07-full-landing-page.png",
      fullPage: true,
    });
  });
});