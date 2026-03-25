import Navbar          from '@/components/landing/Navbar'
import PageIntro       from '@/components/landing/PageIntro'
import Hero            from '@/components/landing/Hero'
import DualVisibility  from '@/components/landing/DualVisibility'
import HowItWorks      from '@/components/landing/HowItWorks'
import Features        from '@/components/landing/Features'
import Integrations    from '@/components/landing/Integrations'
import Testimonials    from '@/components/landing/Testimonials'
import Pricing         from '@/components/landing/Pricing'
import PlanComparison  from '@/components/landing/PlanComparison'
import CTABanner       from '@/components/landing/CTABanner'
import FAQ             from '@/components/landing/FAQ'
import Footer          from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg">
      <PageIntro />
      <Navbar />
      <Hero />
      <DualVisibility />
      <HowItWorks />
      <Features />
      <Integrations />
      <Testimonials />
      <Pricing />
      <PlanComparison />
      <CTABanner />
      <FAQ />
      <Footer />
    </main>
  )
}
