// FILE: app/how-it-works/page.tsx
import Navbar      from '@/components/landing/Navbar'
import HowItWorks  from '@/components/landing/HowItWorks'
import CTABanner   from '@/components/landing/CTABanner'
import Footer      from '@/components/landing/Footer'

export const metadata = {
  title: 'Necə işləyir — Zirva',
  description: 'URL daxil edin, AI analiz etsin, 30 saniyədə tam SEO paketi hazır olsun.',
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <HowItWorks />
      <CTABanner />
      <Footer />
    </main>
  )
}
