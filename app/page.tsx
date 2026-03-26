import Navbar          from '@/components/landing/Navbar'
import PageIntro       from '@/components/landing/PageIntro'
import Hero            from '@/components/landing/Hero'
import StepsSection    from '@/components/landing/StepsSection'
import FeatureSpotlight from '@/components/landing/FeatureSpotlight'
import SocialProof     from '@/components/landing/SocialProof'
import Integrations    from '@/components/landing/Integrations'
import Testimonials    from '@/components/landing/Testimonials'
import PlanComparison  from '@/components/landing/PlanComparison'
import CTABanner       from '@/components/landing/CTABanner'
import Footer          from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg">
      <PageIntro />
      <Navbar />
      <Hero />
      <StepsSection />
      <FeatureSpotlight />
      <SocialProof />
      <Integrations />
      <Testimonials />
      <PlanComparison />
      <CTABanner />
      <Footer />
    </main>
  )
}
