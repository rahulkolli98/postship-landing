/**
 * Editorial centered hero — landing page.
 *
 * Pattern from docs/landing-page.md §2 + the founder's favorite from
 * docs/design.html § "Hero demonstration":
 *
 *   - Centered text layout (NOT 2-column — that was tried in design3.html
 *     and rejected for the landing page; centered feels more like a
 *     launch-manifesto)
 *   - Corner sticker badge (rotated -3deg), lime fill, 2px deep-ink border
 *   - Display headline in Newsreader 76px / 500 / -0.035em tracking
 *   - Single accent word gets a LIME BACKGROUND HIGHLIGHT (not italic;
 *     founder explicitly rejected italic)
 *   - Single primary CTA "Join the waitlist" (anchors to #trial) +
 *     single secondary link "See how it works →" (anchors to #workflow).
 *     Pre-launch state — no fake "Try free for 7 days" button.
 *   - Vertical padding: var(--space-11) 0 var(--space-9) — generous but
 *     not extreme
 *   - No hairline rule + mono caption footer (that was design-system
 *     documentation, not user-facing copy — removed 2026-07-31 per
 *     founder correction)
 */
export function Hero() {
  return (
    <section className="relative px-6 pb-9 pt-20 text-center">
      {/* Corner sticker — hidden on mobile (overlaps content), shown md+ */}
      <div className="absolute top-7 left-9 hidden md:top-5 md:left-9 md:block">
        <span className="inline-block rotate-[-3deg] rounded-sm border-2 border-border-strong bg-accent px-3 py-1.5 font-sans text-xs font-semibold tracking-wider text-accent-foreground uppercase">
          NEW · 4 PLATFORMS
        </span>
      </div>

      <p className="mb-6 font-mono text-xs font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
        CONTENT DISTRIBUTION SYSTEM · v1.0
      </p>

      <h1 className="mx-auto mb-5 max-w-4xl font-newsreader text-5xl leading-[1.02] font-medium tracking-[-0.035em] text-on-surface md:text-[76px]">
        Write once. Post{" "}
        <span className="inline-block bg-accent px-2.5 py-0 align-baseline font-medium tracking-[-0.03em] text-accent-foreground">
          everywhere.
        </span>
      </h1>

      <p className="mx-auto mb-8 max-w-[580px] font-sans text-[17px] leading-[1.55] text-on-surface-muted">
        One master description. Six platform-native captions. One click ships to YouTube, LinkedIn, X, Threads, Instagram, and TikTok — without rewriting the same idea six times.
      </p>

      <div className="mb-12 flex flex-col items-center justify-center gap-3">
        <a
          href="#trial"
          className="inline-flex h-12 items-center justify-center rounded-md border-2 border-transparent bg-primary px-6 text-sm text-primary-foreground transition-colors hover:bg-accent hover:text-on-accent"
        >
          Join the waitlist
        </a>
        <a
          href="#workflow"
          className="font-sans text-[15px] text-on-surface-muted underline underline-offset-4 transition-colors hover:text-on-surface"
        >
          See how it works →
        </a>
      </div>
    </section>
  );
}