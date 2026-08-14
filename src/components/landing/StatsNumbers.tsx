/**
 * By the numbers section (per docs/landing-page.md § 5).
 *
 * Oversized mono numerals (`display-mono-xl` — 160px in design3) + mono-sm
 * caption. Lifted from Dispatch's big-stat pattern. The numeral is the
 * dominant visual element on this section.
 */
export function StatsNumbers() {
  const stats = [
    { num: "6", cap: "PLATFORMS · ONE CLICK" },
    { num: "<5s", cap: "PER POST · AI ADAPT" },
    { num: "1", cap: "DESCRIPTION · NOT SIX" },
    { num: "0$", cap: "TO TRY POSTSHIP" },
  ];

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl border-t-2 border-t-border-strong pt-12">
        <p className="mb-2 block font-mono text-xs font-semibold tracking-[0.18em] text-on-surface-muted uppercase">
          ✕ By the numbers · the move in mono
        </p>
        <h2 className="mb-3 max-w-3xl font-newsreader text-5xl leading-[1.05] font-medium tracking-[-0.025em] text-on-surface md:text-[56px]">
          The single-number heroes.
        </h2>
        <p className="mb-10 max-w-2xl font-sans text-[17px] leading-[1.55] text-on-surface-muted">
          One master description. Six platform-native posts. One click. The numbers that matter.
        </p>

        <div className="grid grid-cols-2 gap-7 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.num} className="">
              <div className="font-mono text-[80px] leading-[0.92] font-medium tracking-[-0.05em] text-on-surface md:text-[160px]">
                {s.num}
              </div>
              <div className="mt-3 font-mono text-[11px] tracking-[0.08em] text-on-surface-muted uppercase">
                {s.cap}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}