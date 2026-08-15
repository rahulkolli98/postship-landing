# Phase 0 — Landing Page & Waitlist

**Status:** Shipped 2026-08-14 · **Tag:** `v0.1.0-phase0` · **Live URL:** https://postship-landing.rahulkolli0905.workers.dev

The public-facing entry point for Postship. Single page, no auth, one job: capture emails from people who want to be notified when the composer ships. Everything in Phase 1+ is gated behind this sign-up surface.

## What's live

| Surface | Where |
|---|---|
| Marketing page | `landing/` — single route at `/` |
| Footer waitlist form (FinalCta) | Posts to `waitlist.join` Convex mutation |
| Backend | Cloudflare Workers (Workers Builds, single worker) + Convex cloud (`tangible-chameleon-299.convex.cloud`) |
| Repo | `github.com/rahulkolli98/postship-landing` |
| Deploy | Cloudflare dashboard → `postship-landing` → auto-deploys on push to `main` |

## What's on the page

Eleven sections, top to bottom: `TopNav`, `Hero`, `HowItWorks`, `LayeredCapabilities`, `StatsNumbers`, `Pricing`, `Faq`, `FinalCta` (with inline Waitlist form), `Footer`. Static-rendered (Cloudflare's worker serves a pre-rendered HTML, Convex client hydrates for the waitlist form only).

## What was tested

- **11 Playwright tests** in `landing/tests/smoke.spec.ts` all passing locally (`landing/`):
  - All sections render at 360 / 768 / 1024 / 1440 widths
  - Pricing tier test-IDs (`pricing-tier-{trial,creator,pro}`, `pricing-cta-{...}`)
  - Waitlist form happy path + error path (`waitlist-{email,submit,success,error}`)
  - FAQ interaction (`faq-item`, `faq-contact-card`)
- **End-to-end smoke** (live): submitted one email from the deployed site → row landed in cloud Convex `waitlist` table
- **Build pipeline**: `npm run deploy` (i.e. `opennextjs-cloudflare build && opennextjs-cloudflare deploy`) produces a green Workers build; wrangler deploys via the auto-injected API token

## What's deferred (Phase 1+)

- The actual composer app — lives in a separate `webapp/` subfolder, separate Convex project (`webapp-postship`), separate deploy
- Auth / billing / Stripe — none of that ships until the composer exists
- Custom domain (`postship.app`) attached to the worker — currently on the free `*.workers.dev` subdomain
- Real PWA icons (192/512) — manifest is in place but icons are placeholders pointing at `/favicon.ico`
- Custom OG image — currently falls back to Next.js defaults

## Architectural decisions locked in this phase

1. **OpenNext Cloudflare adapter** (not `@cloudflare/next-on-pages`, which is deprecated).
2. **`Workers Builds`** for CI/CD (not GitHub Actions). `Builds for non-production branches: OFF` to save build minutes on the limited plan.
3. **Per-app Convex pattern**: landing app has only the `waitlist` table; the composer app will have its own Convex project (`webapp-postship`) with `users`, `accounts`, `posts`. Each runs its own dev server.
4. **Single-deploy command shape** in `package.json`:
   ```json
   "build": "next build",
   "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
   ```
   Cloudflare dashboard's Build command = `npm run build`, Deploy command = `npm run deploy`. OpenNext transforms the Next build into a Cloudflare Worker bundle before wrangler deploys.

## Founder voice notes (locked copy)

- Tagline: **"Stop rewriting. Start shipping."**
- Pre-launch state: no "Try free for 7 days" / "Read the docs" buttons (would be misleading)
- Pricing tiers: TRIAL $0/7d, CREATOR $12/mo, PRO $19/mo. **No permanent free tier.**
- Hero CTA: "Join the waitlist" (not "Sign up")
- No emoji. No "revolutionize your X" filler.

## How to redeploy

Any push to `main` auto-deploys. To deploy manually:

```bash
cd landing
npx convex deploy                    # pushes schema + functions to cloud Convex (idempotent)
git commit --allow-empty -m "trigger"
git push                             # triggers Workers Builds
```

To run locally:

```bash
cd landing
npx convex dev                       # terminal 1 — local Convex backend on :3210
npm run dev                          # terminal 2 — Next dev server on :3000
```

## Known quirks

- The repo was renamed mid-deploy (`rahulkolli0905/landing` → `rahulkolli98/postship-landing`). Cloudflare integration re-points to the new name; the old URL is a 404.
- `SITE_URL` in `layout.tsx` is hardcoded to `https://postship.app` (canonical, OG images, Twitter cards). This is intentional — pointing these at the `*.workers.dev` preview URL would be wrong. Until the custom domain is attached, social shares will display `postship.app` even though the page itself is served from `workers.dev`. That's correct SEO behavior.
- `convex/_generated/` is committed (per Convex docs — the typed API client lives there).