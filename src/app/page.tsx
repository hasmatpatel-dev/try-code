import Header from "@/components/shadcn-space/blocks/hero-01/header";
import AboutAndStats01 from '@/components/shadcn-space/blocks/about-us-01/index'
import Bentogrid from '@/components/shadcn-space/blocks/bento-grid-01/bentogrid'
import Blog from '@/components/shadcn-space/blocks/blog-01/blog'
import Contact from '@/components/shadcn-space/blocks/contact-01/index'
import CTA01 from '@/components/shadcn-space/blocks/cta-01/cta'
import Faq from '@/components/shadcn-space/blocks/faq-01/faq'
import Feature01 from '@/components/shadcn-space/blocks/feature-01/index'
import Footer02 from '@/components/shadcn-space/blocks/footer-02/footer'
import AgencyHeroSection from '@/components/shadcn-space/blocks/hero-01/index'
import Newsletter from '@/components/shadcn-space/blocks/newsletter-01/newsletter'
import Pricing02 from '@/components/shadcn-space/blocks/pricing-02/pricing'
import Services01 from '@/components/shadcn-space/blocks/services-01/services'
import Team01 from '@/components/shadcn-space/blocks/team-01/team'
import Testimonial01 from '@/components/shadcn-space/blocks/testimonial-02'

export default function Page() {
  return (
    <div className=''>
      <Header className="hidden md:flex" />
      
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

      <div id="team" className="scroll-mt-20">
        <Team01 />
      </div>

      <div id="pricing" className="scroll-mt-20">
        <Pricing02 />
      </div>

      <CTA01 />
      <Blog />
      <Faq />
      <Contact />
      <Newsletter />
      <Footer02 />
    </div>
  )
}
