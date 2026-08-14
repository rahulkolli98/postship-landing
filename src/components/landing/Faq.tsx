"use client";

/**
 * FAQ section (Hanzo premium pattern, per docs/landing-page.md § 7).
 *
 * Layout:
 *  - Header: section label + h2 + lede (left-aligned, not centered)
 *  - Two-column grid below:
 *    - LEFT (360px, sticky on scroll): floating contact card with avatar,
 *      headline, pill CTA, fallback
 *  - RIGHT (1fr): accordion list with native <details>, `+` toggles that
 *    rotate 45deg on open
 *
 * Tone is Postship-direct ("Still stuck?"), NOT literal Hanzo copy.
 */
export function Faq() {
  const items = [
    {
      q: "What is Postship and who is it for?",
      a: "Postship is a single-screen composer for solo creators who post the same idea to multiple platforms. Drop 3 to 6 pre-shot videos, write one description, hit ship. Postship rewrites the description per platform and publishes to all six at once.",
    },
    {
      q: "Does the AI actually adapt the copy, or does it just truncate?",
      a: "It adapts. LinkedIn gets long-form. X gets tight. TikTok gets native. Threads gets conversational. You set a tone preset once and the adapter rewrites within those constraints. The original description is preserved — you can compare side by side before publishing.",
    },
    {
      q: "Which platforms are supported in v1?",
      a: "YouTube, LinkedIn, X, Threads, Instagram, and TikTok. The trial supports 3 platforms, the Creator tier supports 4, and the Pro tier supports all 6.",
    },
    {
      q: "Do my videos get stored on your servers?",
      a: "No. The videos stay on your device. When you hit ship, Postship reads the file path from your device and uploads directly to each platform's API via OAuth. The file is discarded from memory after the upload completes.",
    },
    {
      q: "How long does the trial last, and what happens when it ends?",
      a: "The trial is 7 days and includes 5 posts total. When you hit 5 posts or day 7, whichever comes first, the workspace prompts you to upgrade to Creator or Pro. Nothing is deleted — your draft posts and tone presets stay. You only lose the ability to publish until you upgrade.",
    },
    {
      q: "Can I pause or cancel anytime?",
      a: "Yes. There are no contracts. The trial doesn't require a credit card. If you upgrade and want to downgrade or cancel, you can do so from the workspace settings at any time.",
    },
    {
      q: "Is my data safe?",
      a: "Yes. Postship is SOC 2 Type II compliant. All platform OAuth tokens are encrypted at rest. We don't read your videos, we don't read your descriptions beyond the moment of adaptation, and we never sell or share your data.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-16 border-t border-border bg-background px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-9 border-b border-border pb-7">
          <p className="mb-2 block font-mono text-xs font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
            Questions answered · direct line available
          </p>
          <h2 className="mb-3 max-w-3xl font-newsreader text-5xl leading-[1.05] font-medium tracking-[-0.025em] text-on-surface md:text-[56px]">
            The questions, answered.
          </h2>
          <p className="max-w-2xl font-sans text-[17px] leading-[1.55] text-on-surface-muted">
            If yours isn't here, the line below goes straight to me.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-9 lg:grid-cols-[360px_1fr] lg:items-start">
          {/* LEFT: sticky contact card */}
          <aside
            data-testid="faq-contact-card"
            className="rounded-lg border border-border bg-surface-raised p-7 shadow-[0_2px_8px_rgba(14,14,12,0.04)] lg:sticky lg:top-20"
          >
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-surface-sunken font-newsreader text-[22px] italic text-on-surface">
                L
              </div>
              <div>
                <p className="mb-1 font-sans text-[18px] font-semibold leading-[1.3] text-on-surface">
                  Still stuck?
                </p>
                <p className="m-0 font-sans text-[14px] leading-[1.4] text-on-surface-muted">
                  Founders on it within a day.
                </p>
              </div>
            </div>
            <a
              href="mailto:hello@postship.app"
              className="mb-3 block rounded-full bg-primary px-5 py-3.5 text-center font-sans text-[15px] font-medium text-primary-foreground transition-colors hover:bg-accent hover:text-on-accent"
            >
              Send an email →
            </a>
            <p className="m-0 text-center font-sans text-[13px] text-on-surface-muted">
              Or, read the <a href="#" className="text-on-surface underline underline-offset-2">onboarding docs</a> first.
            </p>
          </aside>

          {/* RIGHT: accordion */}
          <div className="border-t border-t-border">
            {items.map((item) => (
              <details
                key={item.q}
                data-testid="faq-item"
                className="group border-b border-border py-7"
              >
                <summary className="grid cursor-pointer list-none grid-cols-[1fr_32px] items-start gap-5">
                  <p className="m-0 font-sans text-[20px] font-medium leading-[1.3] tracking-[-0.005em] text-on-surface">
                    {item.q}
                  </p>
                  <span className="flex h-8 w-8 select-none items-center justify-center font-mono text-[20px] font-light text-on-surface transition-transform duration-200 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-[640px] font-sans text-[16px] leading-[1.6] text-on-surface-muted">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}