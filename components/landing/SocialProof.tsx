'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Search, X } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

const CARDS = [
  {
    query: 'arenda avtomobil baki',
    faviconUrl: 'https://icons.duckduckgo.com/ip3/primerentacar.az.ico',
    faviconFallback: 'P',
    faviconBg: '#1A3C8F',
    siteName: 'Prime Rent a Car',
    url: 'https://primerentacar.az',
    rank: 1,
    title: 'Bakıda Avtomobil İcarəsi — Prime Rent a Car',
    description: 'Bakıda ən sərfəli avtomobil icarəsi xidməti. Geniş avtomobil parkı, 24/7 dəstək, sürücüsüz və sürücülü variantlar. Onlayn rezervasiya edin.',
  },
  {
    query: 'estetik stomatoloqiya baki',
    faviconUrl: 'https://icons.duckduckgo.com/ip3/artandsmile.az.ico',
    faviconFallback: 'A',
    faviconBg: '#E84393',
    siteName: 'Art & Smile',
    url: 'https://artandsmile.az',
    rank: 1,
    title: 'Art & Smile — Estetik Stomatoloqiya Klinikası',
    description: 'Bakıda estetik stomatoloqiya, ağartma, implant və ortodontiya. Müasir avadanlıq, peşəkar həkimlər. İlk konsultasiya pulsuz.',
  },
  {
    query: 'arxitektura layihe baki',
    faviconUrl: 'https://icons.duckduckgo.com/ip3/archilink.az.ico',
    faviconFallback: 'A',
    faviconBg: '#2D6A4F',
    siteName: 'ArchiLink',
    url: 'https://archilink.az',
    rank: 1,
    title: 'ArchiLink — Arxitektura və Dizayn Layihələri',
    description: 'Bakıda müasir arxitektura, interyer dizayn və inşaat layihələri. Peşəkar komanda, sertifikatlı memarlar. Pulsuz məsləhət.',
  },
]

function FaviconIcon({ card }: { card: typeof CARDS[0] }) {
  return (
    <img
      src={card.faviconUrl}
      alt={card.siteName}
      width={20}
      height={20}
      className="flex-shrink-0"
      style={{ borderRadius: 4 }}
      onError={(e) => {
        const target = e.currentTarget
        const span = document.createElement('span')
        span.style.cssText = `display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:4px;background:${card.faviconBg};color:white;font-size:11px;font-weight:700`
        span.textContent = card.faviconFallback
        target.parentNode?.replaceChild(span, target)
      }}
    />
  )
}

function GoogleCard({ card }: { card: typeof CARDS[0] }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#FFFFFF', border: '1.5px solid rgba(13,13,26,0.08)', boxShadow: '0 4px 24px rgba(13,13,26,0.07)' }}
    >
      {/* Search bar */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-2 rounded-full px-3 py-2.5" style={{ background: '#F1F3F4', border: '1px solid rgba(0,0,0,0.06)' }}>
          <Search size={14} strokeWidth={2} style={{ color: '#5F6368', flexShrink: 0 }} />
          <span className="text-sm flex-1 truncate" style={{ color: '#202124', fontFamily: 'Arial, sans-serif' }}>{card.query}</span>
          <X size={14} strokeWidth={2} style={{ color: '#5F6368', flexShrink: 0 }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-4 pb-2 border-b" style={{ borderColor: 'rgba(0,0,0,0.08)' }}>
        {['Hamısı', 'Şəkillər', 'Videolar', 'Xəritələr', 'Xəbərlər'].map((t, i) => (
          <span key={t} className="text-xs pb-1.5" style={{ color: i === 0 ? '#1A73E8' : '#5F6368', fontWeight: i === 0 ? 600 : 400, borderBottom: i === 0 ? '2px solid #1A73E8' : '2px solid transparent', fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap' }}>
            {t}
          </span>
        ))}
      </div>

      {/* Result */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FaviconIcon card={card} />
            <div>
              <div className="text-xs font-medium" style={{ color: '#202124', fontFamily: 'Arial, sans-serif' }}>{card.siteName}</div>
              <div className="text-xs truncate max-w-[140px]" style={{ color: '#5F6368', fontFamily: 'Arial, sans-serif' }}>{card.url}</div>
            </div>
          </div>
          {/* Top badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ border: '1px solid #DADCE0' }}>
            <svg width="12" height="12" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs font-bold" style={{ color: '#202124', fontFamily: 'Arial, sans-serif' }}>Top {card.rank}</span>
          </div>
        </div>

        <div className="text-base font-medium mb-1 leading-snug" style={{ color: '#1A0DAB', fontFamily: 'Arial, sans-serif' }}>{card.title}</div>
        <div className="text-sm leading-relaxed line-clamp-3" style={{ color: '#4D5156', fontFamily: 'Arial, sans-serif' }}>{card.description}</div>
      </div>
    </div>
  )
}

export default function SocialProof() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24" style={{ background: '#FFFFFF' }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING }}
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-3" style={{ color: '#0D0D1A' }}>
            Google-da #1 sıralanan saytlar
          </h2>
          <p className="text-lg" style={{ color: '#737599' }}>
            500+ aktiv brend. 50.000+ kredit istifadə edilib. Hər gün böyüyür.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ y: 24, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ ...SPRING, delay: i * 0.08 }}
            >
              <GoogleCard card={card} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
