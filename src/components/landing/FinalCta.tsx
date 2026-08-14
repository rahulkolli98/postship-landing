import { Waitlist } from "./Waitlist";

/**
 * Final CTA section (per docs/landing-page.html + founder correction).
 *
 * Pre-launch state with the waitlist form as the primary CTA, since
 * "Try free for 7 days" is misleading pre-launch. The hero's
 * "Join the waitlist" button anchors here via #trial.
 *
 * Layout (matching HTML): 2px deep-ink top border, centered display
 * headline, body lede, then an inline Waitlist form as the primary entry.
 */
export function FinalCta() {
  return (
    <section
      id="trial"
      className="scroll-mt-16 border-t-2 border-t-border-strong px-6 py-12 text-center"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="font-newsreader text-5xl leading-[1.05] font-medium tracking-[-0.025em] text-on-surface md:text-[56px]">
          Stop rewriting. Start shipping.
        </h2>
        <p className="mt-5 font-sans text-[17px] leading-[1.55] text-on-surface-muted">
          Postship is almost ready. One short email when we ship.
        </p>

        <div className="mx-auto mt-8 max-w-md">
          <Waitlist />
        </div>
      </div>
    </section>
  );
}