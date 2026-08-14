import { TopNav } from "@/components/landing/TopNav";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LayeredCapabilities } from "@/components/landing/LayeredCapabilities";
import { StatsNumbers } from "@/components/landing/StatsNumbers";
import { Pricing } from "@/components/landing/Pricing";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

/**
 * The landing page (TASK-012).
 *
 * Composition (top to bottom, per docs/landing-page.md § Page Structure):
 *   1. TopNav              (Hanzo-style sticky nav)
 *   2. Hero                (editorial centered with lime-highlight accent word)
 *   3. HowItWorks          (3-step process, Deliver-style)
 *   4. LayeredCapabilities (4-layer grid, Dispatch-style)
 *   5. StatsNumbers        (160px mono numerals)
 *   6. Pricing             (3-tier with differentiation)
 *   7. Faq                 (Hanzo premium: sticky contact card + accordion)
 *   8. FinalCta            (centered display + Waitlist form combined)
 *   9. Footer              (4-col links + metadata row)
 *
 * The hero's "Try free for 7 days" CTA anchors to #trial which is now the
 * FinalCta section. The Waitlist form lives in that section as an alternative
 * entry for visitors who aren't ready to sign up yet.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <LayeredCapabilities />
        <StatsNumbers />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}