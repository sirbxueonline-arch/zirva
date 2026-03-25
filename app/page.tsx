import Navbar       from '@/components/landing/Navbar'
import Hero          from '@/components/landing/Hero'
import DualVisibility from '@/components/landing/DualVisibility'
import HowItWorks   from '@/components/landing/HowItWorks'
import Features     from '@/components/landing/Features'
import Testimonials from '@/components/landing/Testimonials'
import Pricing      from '@/components/landing/Pricing'
import CTABanner    from '@/components/landing/CTABanner'
import FAQ          from '@/components/landing/FAQ'
import Footer       from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero />
      <DualVisibility />
      <HowItWorks />
      <Features />
      <Testimonials />
      <Pricing />
      <CTABanner />
      <FAQ />
      <Footer />
    </main>
  )
}
