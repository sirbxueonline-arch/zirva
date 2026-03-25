'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, CheckCircle } from 'lucide-react'

/* ── Shared: real ChatGPT (OpenAI) SVG logo ───────── */
function ChatGPTIcon({ size = 16, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd" clipRule="evenodd"
        d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.212-2.972 10.079 10.079 0 0 0-10.4 4.858 9.963 9.963 0 0 0-6.67 4.792 10.079 10.079 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.212 2.972 10.078 10.078 0 0 0 10.4-4.857 9.966 9.966 0 0 0 6.67-4.793 10.079 10.079 0 0 0-1.24-11.816zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103L16.4 33.591a7.504 7.504 0 0 1-10.008-2.585zm-2.455-17.16a7.47 7.47 0 0 1 3.903-3.292A.065.065 0 0 1 7.84 10.6v9.199a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-3.107-10.014zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l7.694 4.443a7.498 7.498 0 0 1-1.158 13.528v-9.199a1.293 1.293 0 0 0-.293-.202zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l7.584-4.38a7.504 7.504 0 0 1 11.6 4.497zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.501 7.501 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.5v4.999l-4.331 2.5-4.331-2.5V18.226z"
        fill={color}
      />
    </svg>
  )
}

/* ── Google SERP panel ────────────────────────────── */
function GooglePanel() {
  return (
    <div className="flex-1 min-w-0 rounded-2xl overflow-hidden" style={{ background: '#fff' }}>
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F25C54]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#F5A623]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#00C9A7]" />
        </div>
        <div className="flex-1 flex items-center gap-1.5 mx-2 rounded-md px-3 py-1.5 text-[11px] font-mono"
          style={{ background: '#F3F4F6', color: '#9CA3AF' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Bakıda ən yaxşı gözəllik salonu
        </div>
      </div>

      <div className="p-4">
        {/* Google logo */}
        <div className="flex items-center gap-1.5 mb-3">
          <svg height="16" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg">
            <path d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#EA4335"/>
            <path d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z" fill="#FBBC05"/>
            <path d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z" fill="#4285F4"/>
            <path d="M225 3v65h-9.5V3h9.5z" fill="#34A853"/>
            <path d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z" fill="#EA4335"/>
            <path d="M35.29 41.41V32h31.sydnel" fill="none"/>
            <path d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.5-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z" fill="#4285F4"/>
          </svg>
        </div>

        {/* #1 highlighted */}
        <div className="relative rounded-xl p-3 mb-2"
          style={{ background: 'rgba(66,133,244,0.05)', border: '1.5px solid rgba(66,133,244,0.28)' }}>
          <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: '#4285F4' }}>1</div>
          <div className="text-[11px] mb-0.5" style={{ color: '#188038' }}>beautystudio.az</div>
          <div className="text-sm font-semibold mb-1 leading-tight" style={{ color: '#1a0dab' }}>
            Beauty Studio Bakı | Peşəkar Gözəllik Salonu
          </div>
          <div className="text-[11px] leading-relaxed mb-1.5" style={{ color: '#4d5156' }}>
            Bakı Nəsimidə peşəkar gözəllik salonu. Saç, dırnaq, makiyaj xidmətləri...
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} fill="#F5A623" strokeWidth={0} style={{ color: '#F5A623' }} />
              ))}
            </div>
            <span className="text-[11px] font-medium" style={{ color: '#3c4043' }}>4.9</span>
            <span className="text-[11px]" style={{ color: '#70757a' }}>(287 rəy)</span>
          </div>
        </div>

        {/* #2 faded */}
        <div className="rounded-xl p-3 opacity-30">
          <div className="text-[11px] mb-0.5" style={{ color: '#188038' }}>guzellik.az</div>
          <div className="text-sm font-medium leading-tight" style={{ color: '#1a0dab' }}>
            Gözəllik Mərkəzi — Bakıda Xidmətlər
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── ChatGPT panel ────────────────────────────────── */
function ChatGPTPanel() {
  return (
    <div className="flex-1 min-w-0 rounded-2xl overflow-hidden" style={{ background: '#0D0D1E', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: '#10A37F' }}>
          <ChatGPTIcon size={16} color="white" />
        </div>
        <span className="text-sm font-semibold text-white">ChatGPT</span>
        <span className="ml-auto text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>GPT-4o</span>
      </div>

      <div className="p-4">
        {/* User message */}
        <div className="flex justify-end mb-4">
          <div className="text-sm px-3.5 py-2.5 rounded-2xl max-w-[75%]"
            style={{ background: 'rgba(255,255,255,0.1)', color: '#E5E7EB' }}>
            Bakıda ən yaxşı gözəllik salonu?
          </div>
        </div>

        {/* AI prelude */}
        <div className="flex items-start gap-2.5 mb-3">
          <div className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5"
            style={{ background: '#10A37F' }} />
          <p className="text-[13px] leading-relaxed pt-0.5" style={{ color: '#9CA3AF' }}>
            Bakıda bir neçə yüksək reytinqli gözəllik salonu var. Müştəri rəylərinə və onlayn məlumatlara əsasən:
          </p>
        </div>

        {/* #1 recommendation */}
        <div className="relative ml-8 rounded-xl p-3 mb-2"
          style={{ background: 'rgba(16,163,127,0.1)', border: '1.5px solid rgba(16,163,127,0.35)' }}>
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: '#10A37F' }}>1</div>
          <div className="text-sm font-bold mb-0.5" style={{ color: '#E5E7EB' }}>Beauty Studio Bakı</div>
          <div className="text-xs mb-2" style={{ color: '#9CA3AF' }}>
            Nəsimi rayonu — saç, dırnaq, makiyaj xidmətləri
          </div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} fill="#F5A623" strokeWidth={0} style={{ color: '#F5A623' }} />
            ))}
            <span className="text-[11px] ml-1" style={{ color: '#9CA3AF' }}>4.9 · 287 rəy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle size={11} style={{ color: '#10A37F' }} />
            <span className="text-[11px] font-semibold" style={{ color: '#10A37F' }}>
              Strukturlu məlumat əsasında tövsiyə edilir
            </span>
          </div>
        </div>

        {/* Others faded */}
        {['guzellik.az', 'beauty-baku.az'].map((site, i) => (
          <div key={i} className="ml-8 flex items-center gap-2.5 py-2 opacity-30">
            <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: 'rgba(255,255,255,0.2)' }}>{i + 2}</div>
            <span className="text-xs" style={{ color: '#9CA3AF' }}>{site}</span>
          </div>
        ))}

        {/* Footer note */}
        <div className="mt-3 rounded-lg px-3 py-2 text-[11px] leading-relaxed"
          style={{ background: 'rgba(123,110,246,0.1)', border: '1px solid rgba(123,110,246,0.2)', color: 'rgba(196,188,255,0.8)' }}>
          Zirva schema markup + structured data ilə həm Google-u, həm ChatGPT-ni eyni anda optimallaşdırır
        </div>
      </div>
    </div>
  )
}

/* ── Main Hero ────────────────────────────────────── */
export default function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const stagger = (i: number) => ({
    initial: { y: 28, opacity: 0 },
    animate: mounted ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 * i },
  })

  return (
    <section className="relative pt-28 pb-0 overflow-hidden" style={{ background: '#07071A' }}>

      {/* Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }}
      />

      {/* Orbs */}
      <div className="absolute pointer-events-none" style={{
        width: 800, height: 800, top: '-30%', left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(circle, rgba(123,110,246,0.15) 0%, transparent 60%)',
      }} />
      <div className="absolute pointer-events-none" style={{
        width: 400, height: 400, bottom: '5%', right: '-5%',
        background: 'radial-gradient(circle, rgba(16,163,127,0.1) 0%, transparent 65%)',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6">

        {/* Platform pills */}
        <motion.div className="flex items-center justify-center gap-2 mb-10" {...stagger(0)}>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(66,133,244,0.12)', border: '1px solid rgba(66,133,244,0.25)', color: '#93B8FB' }}>
            <svg width="11" height="11" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </div>
          <span className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.2)' }}>+</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(16,163,127,0.12)', border: '1px solid rgba(16,163,127,0.28)', color: '#6EE7C7' }}>
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#10A37F', display: 'inline-block' }} />
            ChatGPT
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-center font-display font-bold tracking-tight mb-5"
          style={{ fontSize: 'clamp(40px, 6.5vw, 76px)', lineHeight: 1.1, color: '#fff' }}
          {...stagger(1)}
        >
          Saytınız Google-da da,{' '}
          <br />
          <span style={{
            background: 'linear-gradient(100deg, #A78BFA 0%, #7B6EF6 40%, #10A37F 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            ChatGPT-də də #1
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="text-center mx-auto mb-10"
          style={{ maxWidth: '50ch', fontSize: 17, lineHeight: 1.7, color: 'rgba(255,255,255,0.42)' }}
          {...stagger(2)}
        >
          URL-i daxil edin — 30 saniyə ərzində title teq, meta, schema markup
          və hreflang hər iki platforma uyğun hazır olur.
        </motion.p>

        {/* CTAs */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16" {...stagger(3)}>
          <Link
            href="/signup"
            className="group flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.04]"
            style={{
              background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)',
              boxShadow: '0 0 0 1px rgba(123,110,246,0.5), 0 8px 32px rgba(123,110,246,0.4)',
            }}
          >
            Pulsuz Başla
            <ArrowRight size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
          >
            Necə işləyir?
          </a>
        </motion.div>

        {/* Dual mockup */}
        <motion.div
          className="flex flex-col md:flex-row gap-3"
          initial={{ y: 56, opacity: 0 }}
          animate={mounted ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        >
          <GooglePanel />
          <ChatGPTPanel />
        </motion.div>

        {/* Bottom fade into next section */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
          style={{ background: 'linear-gradient(to bottom, transparent, #07071A)' }} />
      </div>
    </section>
  )
}
