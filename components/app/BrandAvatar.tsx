'use client'

import { useState } from 'react'

interface Props {
  brand: { name: string; website_url?: string | null }
  size?: number
  style?: React.CSSProperties
}

function getDomain(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = /^https?:\/\//i.test(url) ? url : `https://${url}`
    return new URL(u).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

// Try multiple favicon sources in order.
// NOTE: gstatic faviconV2 is intentionally excluded — it returns a globe image
// instead of erroring out, which prevents onError from firing.
function getFaviconSources(domain: string): string[] {
  return [
    `https://${domain}/favicon.ico`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
  ]
}

export default function BrandAvatar({ brand, size = 32, style }: Props) {
  const domain   = getDomain(brand.website_url)
  const sources  = domain ? getFaviconSources(domain) : []
  const [idx, setIdx] = useState(0)

  const hue      = (brand.name.charCodeAt(0) * 37) % 360
  const radius   = Math.round(size * 0.3)
  const fontSize = Math.round(size * 0.44)

  const currentSrc = sources[idx] ?? null

  if (currentSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={currentSrc}
        alt={brand.name}
        width={size}
        height={size}
        onError={() => {
          if (idx + 1 < sources.length) setIdx(i => i + 1)
          else setIdx(sources.length) // exhausted — fall through to letter
        }}
        style={{
          width: size, height: size,
          borderRadius: radius,
          objectFit: 'contain',
          flexShrink: 0,
          ...style,
        }}
      />
    )
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: `hsl(${hue}, 60%, 60%)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontWeight: 700, fontSize, flexShrink: 0,
      ...style,
    }}>
      {brand.name[0].toUpperCase()}
    </div>
  )
}
