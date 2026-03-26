// FILE: app/pricing/page.tsx
import Navbar    from '@/components/landing/Navbar'
import Pricing   from '@/components/landing/Pricing'
import CTABanner from '@/components/landing/CTABanner'
import Footer    from '@/components/landing/Footer'

export const metadata = {
  title: 'Pricing — Zirva',
  description: 'Simple, transparent pricing. Start free, scale as you grow.',
}

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Pricing />
      <CTABanner />
      <Footer />
    </main>
  )
}
