import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zirva — Google.az-da Birinci Ol',
  description: 'Zirva süni intellekt ilə saytınız üçün mükəmməl Azerbaycanca SEO teqləri yaradır. Başlıq teqi, meta açıqlama, Open Graph, schema markup — hamısı bir kliklə.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://tryzirva.com'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="az">
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-text-primary font-body antialiased">
        {children}
      </body>
    </html>
  )
}
