/**
 * Pricing section (TASK-010).
 *
 * Per docs/landing-page.md §6, three tiers with explicit differentiation:
 *  - Trial (baseline, no top accent, ghost CTA, includes "what you'd miss" miss-list)
 *  - Creator (popular-soft: 1px lime top border + popular-mark sticker, boxed CTA)
 *  - Pro (popular: 6px lime top bar + 2px deep-ink surrounding border, popular-mark sticker, boxed CTA)
 *
 * Tier copy is LOCKED from docs/prd.md (Trial / Creator $12 / Pro $19, no permanent free tier).
 *
 * Differentiation is structural (border weights, top bars, stickers), not just color.
 * No motion, no carousels, no toggle in v1.
 */
export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 block font-mono text-xs font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
          Pricing · trial, Creator, Pro. One per shipping cadence.
        </p>

        <h2 className="mb-3 max-w-3xl font-newsreader text-5xl leading-[1.05] font-medium tracking-[-0.025em] text-on-surface md:text-[56px]">
          Three tiers. One for each shipping cadence.
        </h2>

        <p className="mb-8 max-w-2xl font-sans text-[17px] leading-[1.55] text-on-surface-muted">
          If you only post once or twice a week to your main 3 platforms, the 7-day trial is enough to find out if Postship is for you. If you ship every weekday, the Pro tier pays for itself in the first week you stop rewriting.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* ─────── Trial tier (baseline) ─────── */}
          <article
            data-testid="pricing-tier-trial"
            className="flex flex-col rounded-lg border border-border bg-surface-raised p-7"
          >
            <p className="mb-4 font-mono text-xs font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
              Trial
            </p>
            <div className="mb-2 flex items-baseline font-newsreader text-[40px] leading-[1.05] font-medium tracking-[-0.015em] text-on-surface">
              <span>$0</span>
              <span className="ml-1 font-sans text-[13px] font-normal text-on-surface-muted">
                /7 days
              </span>
            </div>
            <p className="mb-4 font-sans text-[13px] leading-[1.5] text-on-surface-muted">
              5 posts · 7 days · no credit card
            </p>
            <p className="mb-4 font-sans text-base font-semibold leading-[1.35] text-on-surface">
              Try Postship on your 3 main platforms before you commit.
            </p>

            <ul className="mb-5 grid gap-2">
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Connect 3 platforms
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                5 posts total (lifetime, not monthly)
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                AI copy adaptation
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Email support
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Trial counter visible in UI
              </li>
            </ul>

            <p className="mb-2 border-b border-dashed border-border pb-2 font-mono text-[10px] font-semibold tracking-[0.18em] text-on-surface uppercase">
              What you&apos;d miss without upgrading:
            </p>
            <ul className="mb-4 grid gap-2">
              <li className="relative pl-[18px] font-sans text-[13px] leading-[1.5] text-on-surface-muted line-through decoration-border-strong">
                <span className="absolute top-0 left-0 font-bold text-on-surface">
                  −
                </span>
                More than 5 posts in your first 7 days
              </li>
              <li className="relative pl-[18px] font-sans text-[13px] leading-[1.5] text-on-surface-muted line-through decoration-border-strong">
                <span className="absolute top-0 left-0 font-bold text-on-surface">
                  −
                </span>
                More than 3 platforms (YouTube, LinkedIn, X, Threads, Instagram, TikTok)
              </li>
              <li className="relative pl-[18px] font-sans text-[13px] leading-[1.5] text-on-surface-muted line-through decoration-border-strong">
                <span className="absolute top-0 left-0 font-bold text-on-surface">
                  −
                </span>
                Custom tone presets
              </li>
              <li className="relative pl-[18px] font-sans text-[13px] leading-[1.5] text-on-surface-muted line-through decoration-border-strong">
                <span className="absolute top-0 left-0 font-bold text-on-surface">
                  −
                </span>
                Best-time-to-post recommendations
              </li>
              <li className="relative pl-[18px] font-sans text-[13px] leading-[1.5] text-on-surface-muted line-through decoration-border-strong">
                <span className="absolute top-0 left-0 font-bold text-on-surface">
                  −
                </span>
                Per-platform engagement summary
              </li>
            </ul>

            <a
              href="#trial"
              data-testid="pricing-cta-trial"
              className="mt-auto inline-flex h-12 w-full items-center justify-center border-2 border-transparent bg-surface-raised text-sm font-normal text-on-surface transition-colors hover:bg-surface-sunken"
            >
              Start the 7-day trial →
            </a>
          </article>

          {/* ─────── Creator tier (popular-soft) ─────── */}
          <article
            data-testid="pricing-tier-creator"
            className="flex flex-col rounded-lg border border-t-accent bg-surface-raised p-7"
          >
            <span className="mb-3 inline-block bg-accent px-2 py-[3px] font-mono text-[10px] font-semibold tracking-[0.18em] text-on-accent uppercase">
              ▸ Most posts hit this
            </span>
            <p className="mb-4 font-mono text-xs font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
              Creator
            </p>
            <div className="mb-2 flex items-baseline font-newsreader text-[40px] leading-[1.05] font-medium tracking-[-0.015em] text-on-surface">
              <span>$12</span>
              <span className="ml-1 font-sans text-[13px] font-normal text-on-surface-muted">
                /mo
              </span>
            </div>
            <p className="mb-4 font-sans text-[13px] leading-[1.5] text-on-surface-muted">
              25 posts · 4 platforms · cancel anytime
            </p>
            <p className="mb-4 font-sans text-base font-semibold leading-[1.35] text-on-surface">
              Ship every weekday to your full audience.
            </p>
            <p className="mb-5 border-t border-border pt-3 font-sans text-[13px] leading-[1.55] text-on-surface-muted">
              Most creators who post more than twice a week end up here. The trial is the test. The Creator tier is the one you stay on.
            </p>

            <ul className="mb-5 grid gap-2">
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Connect 4 platforms
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                25 posts per month
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                AI copy adaptation
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Custom tone presets
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Priority email support
              </li>
            </ul>

            <a
              href="#trial"
              data-testid="pricing-cta-creator"
              className="mt-auto inline-flex h-12 w-full items-center justify-center border-2 border-transparent bg-primary text-sm text-primary-foreground transition-colors hover:bg-accent hover:text-on-accent"
            >
              Get Creator
            </a>
          </article>

          {/* ─────── Pro tier (popular, recommended) ─────── */}
          <article
            data-testid="pricing-tier-pro"
            className="flex flex-col rounded-lg border-t-[6px] border-t-accent border-x border-b border-border-strong bg-surface-raised p-7"
          >
            <span className="mb-3 inline-block bg-accent px-2 py-[3px] font-mono text-[10px] font-semibold tracking-[0.18em] text-on-accent uppercase">
              ▸ Recommended · most value
            </span>
            <p className="mb-4 font-mono text-xs font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
              Pro
            </p>
            <div className="mb-2 flex items-baseline font-newsreader text-[40px] leading-[1.05] font-medium tracking-[-0.015em] text-on-surface">
              <span>$19</span>
              <span className="ml-1 font-sans text-[13px] font-normal text-on-surface-muted">
                /mo
              </span>
            </div>
            <p className="mb-4 font-sans text-[13px] leading-[1.5] text-on-surface-muted">
              Unlimited posts · all 6 platforms
            </p>
            <p className="mb-4 font-sans text-base font-semibold leading-[1.35] text-on-surface">
              Unlimited shipping. Every platform. Every day.
            </p>
            <p className="mb-5 border-t border-border pt-3 font-sans text-[13px] leading-[1.55] text-on-surface-muted">
              If you ship to all 6 platforms every weekday, this plan pays for itself in the first week. You stop rewriting the same idea six times, and you get the analytics to see what&apos;s working.
            </p>

            <ul className="mb-5 grid gap-2">
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Connect all 6 platforms (YouTube, LinkedIn, X, Threads, Instagram, TikTok)
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Unlimited posts
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                AI copy adaptation with custom tone presets
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Best-time-to-post recommendations
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Per-platform engagement summary
              </li>
              <li className="relative pl-[22px] font-sans text-[13px] leading-[1.5] text-on-surface">
                <span className="absolute top-0 left-0 font-semibold text-success">
                  ✓
                </span>
                Priority email support
              </li>
            </ul>

            <a
              href="#trial"
              data-testid="pricing-cta-pro"
              className="mt-auto inline-flex h-12 w-full items-center justify-center border-2 border-transparent bg-primary text-sm text-primary-foreground transition-colors hover:bg-accent hover:text-on-accent"
            >
              Get Pro
            </a>
          </article>
        </div>

        <p className="mt-5 text-center font-mono text-[11px] tracking-[0.08em] text-on-surface-muted uppercase">
          No contracts. The trial doesn&apos;t require a credit card. Cancel anytime from workspace settings.
        </p>
      </div>
    </section>
  );
}