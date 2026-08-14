/**
 * Footer (TASK-011).
 *
 * 4-column link grid (Product / Resources / Company / Legal) + bottom
 * metadata: copyright + status indicator with green dot + mono label.
 *
 * The footer will eventually host the <Waitlist /> form too (per the
 * landing-page.md footer CTA spec) — that's a TASK-012 wiring concern,
 * not a Footer- component concern.
 */
export function Footer() {
  return (
    <footer className="mt-12 border-t border-border px-6 pt-10 pb-9">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-mono text-[11px] font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
              Product
            </h3>
            <ul className="grid gap-2">
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
              Resources
            </h3>
            <ul className="grid gap-2">
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Docs
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  API reference
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Tone presets
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Help center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
              Company
            </h3>
            <ul className="grid gap-2">
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Twitter / X
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-[11px] font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
              Legal
            </h3>
            <ul className="grid gap-2">
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="font-sans text-[13px] text-on-surface hover:text-on-surface-muted">
                  DPA
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <p className="font-mono text-[11px] tracking-[0.04em] text-on-surface-subtle">
            © 2026 POSTSHIP · REV 1.0.0 · STOP REWRITING, START SHIPPING.
          </p>
          <span className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.08em] text-on-surface-muted">
            <span className="inline-block size-1.5 rounded-full bg-success" />
            DEVELOPMENT BUILD · POSTSHIP NOT LIVE
          </span>
        </div>
      </div>
    </footer>
  );
}