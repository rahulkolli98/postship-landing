/**
 * Top navigation bar (Hanzo-style, per docs/landing-page.html § 1).
 *
 * Sticky nav, 64px tall, 1px hairline bottom border.
 * Single-row at lg, collapses on mobile (per responsive spec).
 *
 * - Logo (left): POSTSHIP® in mono uppercase
 * - Links (center): SYSTEM · WORKFLOW · PRICING · FAQ
 *   Active link has a 2px deep-ink underline
 * - Status (right): ● ACTIVE — TRIAL 12D with green dot
 * - CTA (right): GET STARTED button (small mono uppercase)
 */
export function TopNav() {
  return (
    <nav
      className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-9"
      aria-label="Primary"
    >
      <a
        href="#"
        className="font-mono text-[13px] font-semibold tracking-[0.08em] text-on-surface uppercase"
      >
        Postship<sup className="ml-0.5 text-[0.6em] text-accent">®</sup>
      </a>

      <ul className="hidden items-center gap-7 md:flex">
        <li>
          <a
            href="#system"
            className="border-b-2 border-b-on-surface pb-0.5 font-mono text-[11px] font-medium tracking-[0.12em] text-on-surface uppercase"
            aria-current="page"
          >
            System
          </a>
        </li>
        <li>
          <a
            href="#workflow"
            className="border-b-2 border-b-transparent pb-0.5 font-mono text-[11px] font-medium tracking-[0.12em] text-on-surface-muted uppercase transition-colors hover:text-on-surface"
          >
            Workflow
          </a>
        </li>
        <li>
          <a
            href="#pricing"
            className="border-b-2 border-b-transparent pb-0.5 font-mono text-[11px] font-medium tracking-[0.12em] text-on-surface-muted uppercase transition-colors hover:text-on-surface"
          >
            Pricing
          </a>
        </li>
        <li>
          <a
            href="#faq"
            className="border-b-2 border-b-transparent pb-0.5 font-mono text-[11px] font-medium tracking-[0.12em] text-on-surface-muted uppercase transition-colors hover:text-on-surface"
          >
            FAQ
          </a>
        </li>
      </ul>

      <div className="flex items-center gap-5">
        <span className="hidden items-center gap-2 font-mono text-[11px] font-medium tracking-[0.08em] text-on-surface-muted md:flex">
          <span className="inline-block size-1.5 rounded-full bg-warning" />
          NOT LIVE YET
        </span>
        <a
          href="#trial"
          className="rounded-sm border border-primary bg-primary px-3.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.12em] text-primary-foreground uppercase transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
        >
          Get started
        </a>
      </div>
    </nav>
  );
}