/**
 * 3-step process section (Deliver-style, per docs/landing-page.md § 3).
 *
 * NOT three identical cards. Each step is a row in a single column
 * wrapped in 2px deep-ink top + bottom borders, with the numeral on the
 * left and the heading + body on the right. Lifted from Deliver's
 * "Kickoff / Execution / Handoff" pattern.
 *
 * Numeral is the mono-display-lg token (96px / -0.04em) in deep ink
 * (NOT lime — design3 uses ink numerals throughout the editorial variant).
 */
export function HowItWorks() {
  const steps = [
    {
      n: "01",
      heading: "Drop your pre-shot videos.",
      body: "Drag 3 to 6 vertical clips into the canvas. Postship reads the file names and shot order — no metadata entry, no template setup, no manual sort.",
    },
    {
      n: "02",
      heading: "Write the description once.",
      body: "One paragraph, in your voice. Postship's adapter rewrites it for each platform's tone and length — LinkedIn long-form, X tight, Threads conversational, TikTok native.",
    },
    {
      n: "03",
      heading: "Hit ship.",
      body: "One click schedules and publishes to all connected accounts. The original videos stay on your device; Postship handles the network calls, the captions, and the metadata.",
    },
  ];

  return (
    <section id="workflow" className="scroll-mt-16 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 block font-mono text-xs font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
          The 3-step move · Drop · Write · Ship
        </p>
        <h2 className="mb-3 max-w-3xl font-newsreader text-5xl leading-[1.05] font-medium tracking-[-0.025em] text-on-surface md:text-[56px]">
          Three steps. One screen.
        </h2>
        <p className="mb-10 max-w-2xl font-sans text-[17px] leading-[1.55] text-on-surface-muted">
          No new tab. No template setup. No twelve-field form to fill in before each post.
        </p>

        <div className="border-t-2 border-t-border-strong">
          {steps.map((step, idx) => (
            <div
              key={step.n}
              className={`grid grid-cols-1 gap-6 py-10 md:grid-cols-[160px_1fr] md:gap-9 ${
                idx === steps.length - 1 ? "border-b-0" : "border-b-2 border-b-border-strong"
              }`}
            >
              <div className="font-mono text-[80px] leading-[0.92] font-medium tracking-[-0.04em] text-on-surface md:text-[96px]">
                {step.n}
              </div>
              <div>
                <h3 className="mb-3 font-sans text-[22px] leading-[1.3] font-semibold text-on-surface">
                  {step.heading}
                </h3>
                <p className="max-w-[600px] font-sans text-[15px] leading-[1.55] text-on-surface-muted">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}