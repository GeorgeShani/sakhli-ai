import { createFileRoute } from "@tanstack/react-router";
import { MarketingHeader } from "@/components/MarketingHeader";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { MatchExplainer } from "@/components/landing/MatchExplainer";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { AutomationStory } from "@/components/landing/AutomationStory";
import { HostTeaser } from "@/components/landing/HostTeaser";
import { SiteFooter } from "@/components/landing/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SakhliAI — Smart rentals for Georgia" },
      {
        name: "description",
        content:
          "Behavior-based flatmate matching and long-term rentals for students in Georgia.",
      },
      { property: "og:title", content: "SakhliAI — Smart rentals for Georgia" },
      {
        property: "og:description",
        content: "Match with compatible flatmates and long-term homes in Tbilisi, Batumi and beyond.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <Hero />
      <div id="how">
        <ProblemSection />
      </div>
      <MatchExplainer />
      <FeatureShowcase />
      <AutomationStory />
      <HostTeaser />
      <SiteFooter />
    </div>
  );
}
