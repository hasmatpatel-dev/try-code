import Header from "@/components/shadcn-space/blocks/hero/header";
import AboutAndStats01 from '@/components/shadcn-space/blocks/about-us/index'
import Bentogrid from '@/components/shadcn-space/blocks/bento-grid/bentogrid'
import Blog from '@/components/shadcn-space/blocks/blog/blog'
import CTA01 from '@/components/shadcn-space/blocks/cta/cta'
import Faq from '@/components/shadcn-space/blocks/faq/faq'
import Feature01 from '@/components/shadcn-space/blocks/feature/index'
import Footer02 from '@/components/shadcn-space/blocks/footer/footer'
import AgencyHeroSection from '@/components/shadcn-space/blocks/hero/index'
import Pricing02 from '@/components/shadcn-space/blocks/pricing/pricing'
import Services01 from '@/components/shadcn-space/blocks/services/services'
import Testimonial01 from '@/components/shadcn-space/blocks/testimonial'

export default function Page() {
  return (
    <div className="relative">
      <Header className="fixed top-0 z-50 w-full hidden md:flex" />

      <div id="home" className="scroll-mt-20">
        <AgencyHeroSection />
      </div>

      <div id="about-us" className="scroll-mt-20">
        <AboutAndStats01 />
      </div>

      <div id="services" className="scroll-mt-20">
        <Services01 />
      </div>

      <Feature01 />
      <Bentogrid />
      <Testimonial01 />

      <div id="pricing" className="scroll-mt-20">
        <Pricing02 />
      </div>

      <CTA01 />
      <Blog />
      <Faq />
      <Footer02 />
    </div>
  )
}
