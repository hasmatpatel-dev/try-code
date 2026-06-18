import Header from "@/components/shadcn-space/blocks/hero/header";
import AgencyHeroSection from "@/components/shadcn-space/blocks/hero/index";
import AboutAndStats01 from "@/components/shadcn-space/blocks/about-us/index";
import Services01 from "@/components/shadcn-space/blocks/services/services";
import Feature01 from "@/components/shadcn-space/blocks/feature/index";
import FeaturedRecipes from "@/components/home/recipes-section";
import Pricing02 from "@/components/shadcn-space/blocks/pricing/pricing";
import Blog from "@/components/shadcn-space/blocks/blog/blog";
import Faq from "@/components/shadcn-space/blocks/faq/faq";
import CTA01 from "@/components/shadcn-space/blocks/cta/cta";
import Footer02 from "@/components/shadcn-space/blocks/footer/footer";
import MarqueeBanner from "@/components/ui/marquee-banner";

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
