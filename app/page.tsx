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
      {/*
        Static server-rendered section for search engines and Google OAuth verification.
        Explains the app name and purpose of Google Search Console integration.
        Not visible to users (screen-reader accessible, positioned off-screen via clip).
      */}
      <div style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}>
        <h1>Zirva — AI-powered SEO and SMO tool for Azerbaijani websites</h1>
        <p>
          Zirva is an AI-powered SEO and social media optimization (SMO) platform that helps
          Azerbaijani website owners rank higher on Google. Zirva generates SEO meta tags,
          schema markup, Open Graph tags, hreflang tags, and keyword packages in Azerbaijani
          and Russian languages.
        </p>
        <p>
          Zirva integrates with Google Search Console via the official Google Search Console API
          (webmasters.readonly scope). With the user&apos;s explicit consent, Zirva reads keyword
          performance data from the user&apos;s own Google Search Console property to generate
          automated SEO performance reports delivered by email every 3 days.
          This data is used solely to generate personalized SEO insights for the authenticated user
          and is never shared with third parties or used for advertising purposes.
          Users can disconnect Google Search Console at any time from their account settings.
        </p>
      </div>
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
