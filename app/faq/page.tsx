// FILE: app/faq/page.tsx
import Navbar    from '@/components/landing/Navbar'
import FAQ       from '@/components/landing/FAQ'
import CTABanner from '@/components/landing/CTABanner'
import Footer    from '@/components/landing/Footer'

export const metadata = {
  title: 'FAQ — Zirva',
  description: 'Zirva haqqında tez-tez verilən suallara cavablar.',
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <FAQ />
      <CTABanner />
      <Footer />
    </main>
  )
}
