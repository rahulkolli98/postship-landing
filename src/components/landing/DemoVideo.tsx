/**
 * DemoVideo component (TASK-009).
 *
 * PRD FR-013 originally specified an embedded demo video above the fold.
 * Per founder override (2026-07-31), the editorial-centered hero design in
 * docs/landing-page.md §2 doesn't include a video. Adding a placeholder
 * video would feel like every other AI-generated landing page (the "fake
 * product mockup" anti-pattern taste-skill calls out).
 *
 * This component is a CSS-styled placeholder stub. When the founder has a
 * real 90-second demo, replace the contents below with:
 *   <video autoPlay muted loop playsInline poster="/demo-poster.png"
 *          className="aspect-video w-full rounded-lg border border-border">
 *     <source src="/demo.mp4" type="video/mp4" />
 *   </video>
 *
 * This stub renders nothing (returns null) so it can be imported and mounted
 * without affecting the visual layout — the slot exists for the future
 * real video without polluting the current page with placeholder chrome.
 */
export function DemoVideo() {
  return null;
}