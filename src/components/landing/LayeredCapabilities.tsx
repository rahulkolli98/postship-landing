/**
 * 4-layer capability cards (Dispatch-style, per docs/landing-page.md § 4).
 *
 * 2×2 grid of cards. Each card has a 96px ink numeral, a lime bullet + mono
 * label, an h3 title, and a body. Lifted from Dispatch's "Connect Layer /
 * Action Layer / Control Layer / Context Layer" framing.
 *
 * Color note (PRD correction): the bullet glyph `▸` is lime; the LABEL text
 * after the bullet is deep ink (`#0E0E0C`) — NOT full lime, which is
 * invisible on white substrate (caught in landing-page.html v1).
 */
export function LayeredCapabilities() {
  const layers = [
    {
      n: "01",
      label: "Drop layer",
      title: "Capture layer.",
      body: "Bring in the videos. Read the file names. Sort by shot. No metadata form, no template tagging.",
    },
    {
      n: "02",
      label: "Adapt layer",
      title: "Copy adaptation layer.",
      body: "One description becomes six native captions. Per-platform tone presets. Per-platform length budgets. AI rewrites, you approve.",
    },
    {
      n: "03",
      label: "Ship layer",
      title: "Publish layer.",
      body: "OAuth to YouTube, LinkedIn, X, Threads, Instagram, TikTok. One-click publish. Original videos stay on your device.",
    },
    {
      n: "04",
      label: "Track layer",
      title: "Insight layer.",
      body: "See what shipped, where it went, when it posted. Best-time-to-post recommendations. Engagement summary by platform.",
    },
  ];

  return (
    <section id="system" className="scroll-mt-16 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-2 block font-mono text-xs font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
          ▸ The system · four layers · one composer
        </p>
        <h2 className="mb-3 max-w-3xl font-newsreader text-5xl leading-[1.05] font-medium tracking-[-0.025em] text-on-surface md:text-[56px]">
          One composer. Four layers.
        </h2>
        <p className="mb-10 max-w-2xl font-sans text-[17px] leading-[1.55] text-on-surface-muted">
          The system is built as a four-layer stack. Each layer has a single job — drop the videos, generate the captions, hit publish, track the result.
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {layers.map((layer) => (
            <article
              key={layer.n}
              className="rounded-lg border border-border bg-surface-raised p-7"
            >
              <div className="font-mono text-[80px] leading-[0.92] font-medium tracking-[-0.04em] text-on-surface md:text-[96px]">
                {layer.n}
              </div>
              <span className="mt-5 block font-mono text-[11px] font-semibold tracking-[0.18em] text-on-surface uppercase">
                <span className="text-accent mr-1.5">▸</span>
                {layer.label}
              </span>
              <h3 className="mt-3 font-sans text-[22px] leading-[1.3] font-semibold text-on-surface">
                {layer.title}
              </h3>
              <p className="mt-3 font-sans text-[15px] leading-[1.55] text-on-surface-muted">
                {layer.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}