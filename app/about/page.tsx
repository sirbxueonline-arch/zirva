import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Zirva — AI SEO Platform',
  description: 'Zirva is an AI-powered SEO and SMO platform for Azerbaijani websites. Learn how Zirva uses Google Search Console to generate automated SEO reports.',
}

export default function AboutPage() {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#ffffff', color: '#111' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px' }}>

          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>Zirva</h1>
          <p style={{ fontSize: 18, color: '#555', marginBottom: 40 }}>
            AI-powered SEO &amp; SMO platform for Azerbaijani websites
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>What is Zirva?</h2>
          <p style={{ lineHeight: 1.8, marginBottom: 24 }}>
            Zirva (tryzirva.com) is an AI-powered search engine optimization platform designed for
            Azerbaijani website owners. Zirva generates complete SEO packages including title tags,
            meta descriptions, schema markup (JSON-LD), Open Graph tags, hreflang tags, and keyword
            packages in Azerbaijani and Russian — helping websites rank higher on Google.az and
            appear in ChatGPT search results.
          </p>

          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Google Search Console Integration</h2>
          <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
            Zirva integrates with the Google Search Console API (<code>webmasters.readonly</code> scope)
            through an optional Autopilot feature. When a user chooses to connect their Google Search
            Console account, Zirva:
          </p>
          <ul style={{ lineHeight: 2, paddingLeft: 24, marginBottom: 24 }}>
            <li>Reads keyword performance data (clicks, impressions, average position) from the user&apos;s own verified GSC property</li>
            <li>Analyzes keyword trends over 3-day periods to detect position changes, declining keywords, and quick-win opportunities</li>
            <li>Uses this data to generate a personalized Azerbaijani-language SEO performance report</li>
            <li>Delivers the report to the user&apos;s email every 3 days via the Resend email service</li>
          </ul>

          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Data Usage &amp; Privacy</h2>
          <ul style={{ lineHeight: 2, paddingLeft: 24, marginBottom: 24 }}>
            <li><strong>Consent:</strong> GSC access is entirely optional and requires explicit user authorization via Google OAuth 2.0</li>
            <li><strong>Scope:</strong> Read-only access only — Zirva never modifies or submits data to Search Console</li>
            <li><strong>Ownership:</strong> Data is fetched only from the user&apos;s own verified GSC property</li>
            <li><strong>No sharing:</strong> GSC data is never shared with third parties, sold, or used for advertising</li>
            <li><strong>Deletion:</strong> Users can disconnect GSC and delete their data at any time from account settings</li>
          </ul>

          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Contact</h2>
          <p style={{ lineHeight: 1.8, marginBottom: 40 }}>
            Questions about data usage or privacy: <a href="mailto:support@tryzirva.com" style={{ color: '#4285F4' }}>support@tryzirva.com</a>
          </p>

          <div style={{ borderTop: '1px solid #eee', paddingTop: 24, display: 'flex', gap: 24 }}>
            <Link href="/" style={{ color: '#4285F4', textDecoration: 'none' }}>Home</Link>
            <Link href="/privacy" style={{ color: '#4285F4', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#4285F4', textDecoration: 'none' }}>Terms of Service</Link>
          </div>
        </div>
      </body>
    </html>
  )
}
