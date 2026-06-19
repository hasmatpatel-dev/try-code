import dynamic from "next/dynamic";
import Header from "@/components/shadcn-space/blocks/hero/header";
import AgencyHeroSection from "@/components/shadcn-space/blocks/hero/index";
import MarqueeBanner from "@/components/ui/marquee-banner";

// Loading Skeleton Placeholder for Layout Stability
const SectionSkeleton = () => (
  <div className="w-full h-96 bg-gray-900/5 animate-pulse border-y border-border" />
);

// Dynamically import below-the-fold components with deferred hydration JS
const AboutAndStats01 = dynamic(
  () => import("@/components/shadcn-space/blocks/about-us/index"),
  { ssr: true, loading: SectionSkeleton }
);
const Services01 = dynamic(
  () => import("@/components/shadcn-space/blocks/services/services"),
  { ssr: true, loading: SectionSkeleton }
);
const Feature01 = dynamic(
  () => import("@/components/shadcn-space/blocks/feature/index"),
  { ssr: true, loading: SectionSkeleton }
);
const FeaturedRecipes = dynamic(
  () => import("@/components/home/recipes-section"),
  { ssr: true, loading: SectionSkeleton }
);
const Pricing02 = dynamic(
  () => import("@/components/shadcn-space/blocks/pricing/pricing"),
  { ssr: true, loading: SectionSkeleton }
);
const Blog = dynamic(
  () => import("@/components/shadcn-space/blocks/blog/blog"),
  { ssr: true, loading: SectionSkeleton }
);
const Faq = dynamic(
  () => import("@/components/shadcn-space/blocks/faq/faq"),
  { ssr: true, loading: SectionSkeleton }
);
const CTA01 = dynamic(
  () => import("@/components/shadcn-space/blocks/cta/cta"),
  { ssr: true, loading: SectionSkeleton }
);
const Footer02 = dynamic(
  () => import("@/components/shadcn-space/blocks/footer/footer"),
  { ssr: true, loading: SectionSkeleton }
);

export default function Page() {
  return (
    <div className="relative">
      <Header className="fixed top-0 z-50 w-full flex" />

      {/* Marquee Banner — mobile only */}
      <div className="md:hidden">
        <MarqueeBanner />
      </div>

      {/* 1. Hero Section */}
      <div id="home" className="scroll-mt-20 pt-0 md:pt-20">
        <AgencyHeroSection />
      </div>

      {/* 2. Trust Stats Section */}
      <div id="about-us" className="scroll-mt-20">
        <AboutAndStats01 />
      </div>

      {/* 3. Featured Roadmaps */}
      <div id="services" className="scroll-mt-20">
        <Services01 />
      </div>

      {/* 4. Learning Categories */}
      <Feature01 />

      {/* 5. Featured Recipes */}
      <FeaturedRecipes />

      {/* 7. Resources & Tools */}
      <div id="pricing" className="scroll-mt-20">
        <Pricing02 />
      </div>

      {/* 8. Latest Blog Articles */}
      <div>
        <Blog />
      </div>

      {/* 10. FAQ */}
      <div>
        <Faq />
      </div>

      {/* 11. Final CTA */}
      <div>
        <CTA01 />
      </div>

      {/* 12. Footer */}
      <div>
        <Footer02 />
      </div>
    </div>
  );
}
