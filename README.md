# Postship — Landing Page

The public marketing site for Postship. Pre-launch. Captures waitlist emails via Convex.

**Stack:** Next.js 16 (App Router) + Tailwind v4 + shadcn/ui + Convex + `@opennextjs/cloudflare` for Cloudflare Pages.

## Quick start

```bash
npm install
npm run dev              # Next.js dev server on :3000
# In another terminal:
npx convex dev           # Convex backend on :3210
# Optional: run smoke tests
npm test
```

## Project layout

```
src/
├── app/
│   ├── layout.tsx             # Root layout — fonts, metadata, Convex provider
│   ├── page.tsx               # Landing page composition (TopNav → Hero → ... → Footer)
│   ├── globals.css            # Tailwind v4 + design3 token bridge
│   ├── api/waitlist/route.ts   # POST /api/waitlist (HTTP shim for non-React clients)
│   └── {hero,button,waitlist}-smoke/  # internal Playwright smoke pages (delete at TASK-012)
├── components/
│   ├── ui/                    # shadcn/ui primitives (button.tsx)
│   ├── ConvexClientProvider.tsx
│   └── landing/               # All landing page sections
│       ├── TopNav.tsx
│       ├── Hero.tsx
│       ├── HowItWorks.tsx
│       ├── LayeredCapabilities.tsx
│       ├── StatsNumbers.tsx
│       ├── Pricing.tsx
│       ├── Faq.tsx
│       ├── FinalCta.tsx       # Holds the waitlist form
│       ├── Footer.tsx
│       ├── Waitlist.tsx        # The form (useMutation(api.waitlist.join))
│       └── DemoVideo.tsx       # placeholder stub
├── lib/utils.ts               # shadcn cn() helper
convex/
├── schema.ts                  # waitlist table only — landing app scope
├── waitlist.ts                 # waitlist.join mutation
└── _generated/                # Convex codegen (typed API client)
tests/
├── smoke.spec.ts              # 11 Playwright tests covering Phase 0
└── screenshots/               # One-shot visual artifacts
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js dev server on :3000 |
| `npm run build` | Next.js build (used by OpenNext's CLI) |
| `npm run preview` | OpenNext Cloudflare build + local Workers preview |
| `npm run deploy` | OpenNext Cloudflare build + deploy to Cloudflare |
| `npm run upload` | OpenNext Cloudflare build + upload as a version (no deploy) |
| `npm run cf-typegen` | Generate `cloudflare-env.d.ts` from wrangler config |
| `npm test` | Playwright smoke tests (auto-spawns dev server) |
| `npm run test:headed` | Same tests, visible browser |

## Deploying

The codebase is ready for Cloudflare Pages via **Workers Builds** (the native Cloudflare CI/CD). Steps:

1. Push this repo to GitHub.
2. In Cloudflare dashboard → **Workers & Pages** → **Create application** → **Import a repository**.
3. Select the GitHub repo. Set:
   - Build command: `npm run build`
   - Deploy command: `npm run deploy` (production) / `npm run upload` (preview)
4. **Worker name in the dashboard must match `name: "postship-landing"`** in `wrangler.jsonc` (Cloudflare enforces this).
5. Save and Deploy. Cloudflare auto-detects Next.js + OpenNext, builds on every push, deploys to `postship-landing.<account>.workers.dev`.

### Preview URLs for non-production branches (NOT enabled)

Per https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/, the "Builds for non-production branches" toggle in **Settings → Build → Branch control** controls whether branch builds run on non-production branches.

We are **leaving this OFF** for the limited plan so only pushes to the production branch (`main`) trigger builds. Every push to any other branch will be skipped entirely (no build consumption). If you later want preview URLs for PRs, enable the toggle and configure the non-production branch deploy command to `npm run upload` (not `npm run deploy`). The `npm run upload` script uses `wrangler versions upload` which creates a preview version without promoting it to active deployment — this is what makes preview URLs work without polluting your production traffic.

## Design system

See `docs/design3.md` at the repo root for the design tokens. The `src/app/globals.css` file registers them as Tailwind v4 utilities (`bg-surface-light`, `text-on-surface-muted`, etc.).

## License

UNLICENSED — internal project.
