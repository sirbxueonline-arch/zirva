import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zirva — Google.az-da Birinci Ol',
  description: 'Zirva süni intellekt ilə saytınız üçün mükəmməl Azerbaycanca SEO teqləri yaradır. Başlıq teqi, meta açıqlama, Open Graph, schema markup — hamısı bir kliklə.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tryzirva.com'),
  openGraph: {
    title: 'Zirva — Google.az-da Birinci Ol',
    description: 'AI ilə 30 saniyədə tam SEO paketi. Title teq, meta açıqlama, schema markup, hreflang — Google-da da, ChatGPT-də də #1.',
    url: 'https://tryzirva.com',
    siteName: 'Zirva',
    type: 'website',
    locale: 'az_AZ',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zirva — AI SEO tool for Azerbaijani websites',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zirva — Google.az-da Birinci Ol',
    description: 'AI ilə 30 saniyədə tam SEO paketi. Title teq, meta açıqlama, schema markup, hreflang.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap&subset=latin,latin-ext"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text-primary font-body antialiased overflow-x-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
