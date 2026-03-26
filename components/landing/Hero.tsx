'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Star, CheckCircle } from 'lucide-react'

/* ── Shared: ChatGPT icon PNG ─────────────────────── */
function ChatGPTIcon({ size = 16 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/chatgpticon.png" alt="ChatGPT" width={size} height={size} style={{ objectFit: 'contain' }} />
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
    <div className="flex-1 min-w-0 rounded-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
        <ChatGPTIcon size={28} />
        <span className="text-sm font-semibold" style={{ color: '#0D0D1A' }}>ChatGPT</span>
        <span className="ml-auto text-xs" style={{ color: '#9CA3AF' }}>GPT-4o</span>
      </div>

      <div className="p-4">
        {/* User message */}
        <div className="flex justify-end mb-4">
          <div className="text-sm px-3.5 py-2.5 rounded-2xl max-w-[75%]"
            style={{ background: '#F3F4F6', color: '#374151' }}>
            Bakıda ən yaxşı gözəllik salonu?
          </div>
        </div>

        {/* AI prelude */}
        <div className="flex items-start gap-2.5 mb-3">
          <ChatGPTIcon size={24} />
          <p className="text-[13px] leading-relaxed pt-0.5" style={{ color: '#6B7280' }}>
            Bakıda bir neçə yüksək reytinqli gözəllik salonu var. Müştəri rəylərinə və onlayn məlumatlara əsasən:
          </p>
        </div>

        {/* #1 recommendation */}
        <div className="relative ml-8 rounded-xl p-3 mb-2"
          style={{ background: 'rgba(16,163,127,0.06)', border: '1.5px solid rgba(16,163,127,0.25)' }}>
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: '#10A37F' }}>1</div>
          <div className="text-sm font-bold mb-0.5" style={{ color: '#0D0D1A' }}>Beauty Studio Bakı</div>
          <div className="text-xs mb-2" style={{ color: '#6B7280' }}>
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
          <div key={i} className="ml-8 flex items-center gap-2.5 py-2 opacity-40">
            <div className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white"
              style={{ background: '#D1D5DB' }}>{i + 2}</div>
            <span className="text-xs" style={{ color: '#9CA3AF' }}>{site}</span>
          </div>
        ))}

        {/* Footer note */}
        <div className="mt-3 rounded-lg px-3 py-2 text-[11px] leading-relaxed"
          style={{ background: 'rgba(123,110,246,0.06)', border: '1px solid rgba(123,110,246,0.15)', color: '#7B6EF6' }}>
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
    <section className="relative pt-24 sm:pt-28 pb-0 overflow-hidden" style={{ background: '#FFFFFF' }}>

      {/* Soft orbs */}
      <div className="absolute pointer-events-none" style={{
        width: 700, height: 700, top: '-25%', left: '50%', transform: 'translateX(-50%)',
        background: 'radial-gradient(circle, rgba(123,110,246,0.07) 0%, transparent 60%)',
      }} />
      <div className="absolute pointer-events-none hidden sm:block" style={{
        width: 400, height: 400, bottom: '5%', right: '-5%',
        background: 'radial-gradient(circle, rgba(16,163,127,0.06) 0%, transparent 65%)',
      }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">

        {/* Headline */}
        <motion.h1
          className="text-center font-display font-bold tracking-tight mb-4 sm:mb-5 px-2"
          style={{ fontSize: 'clamp(34px, 7vw, 76px)', lineHeight: 1.15, color: '#0D0D1A' }}
          {...stagger(0)}
        >
          {/* Line 1: Saytınız [Google] -da da, */}
          <span>
            Saytınız{' '}
            {/* Google with per-letter brand colors */}
            <span style={{ whiteSpace: 'nowrap' }}>
              <span style={{ color: '#4285F4' }}>G</span>
              <span style={{ color: '#EA4335' }}>o</span>
              <span style={{ color: '#FBBC05' }}>o</span>
              <span style={{ color: '#4285F4' }}>g</span>
              <span style={{ color: '#34A853' }}>l</span>
              <span style={{ color: '#EA4335' }}>e</span>
            </span>
            -da da,
          </span>
          <br />
          {/* Line 2: [ChatGPT] -də də [#1] */}
          <span>
            <span style={{ color: '#10A37F' }}>ChatGPT</span>
            <span style={{ color: '#0D0D1A' }}>-də də </span>
            <span style={{
              background: 'linear-gradient(135deg, #7B6EF6 0%, #9B8FF8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 12px rgba(123,110,246,0.3))',
            }}>#1</span>
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          className="text-center mx-auto mb-8 sm:mb-10 px-2"
          style={{ maxWidth: '46ch', fontSize: 'clamp(14px, 2.5vw, 17px)', lineHeight: 1.7, color: '#737599' }}
          {...stagger(1)}
        >
          Saytınızın URL-ini daxil edin. 30 saniyə ərzində title teq, meta açıqlama,
          schema markup və hreflang — Google-da da, ChatGPT-də də sizi <strong style={{ color: '#0D0D1A', fontWeight: 700 }}>birinci sıraya</strong> çıxaracaq tam paket hazırdır.
        </motion.p>

        {/* CTAs */}
        <motion.div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-12 sm:mb-16 px-4 sm:px-0" {...stagger(2)}>
          <Link
            href="/signup"
            className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03]"
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
            className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.01]"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)', color: '#3D4060' }}
          >
            Necə işləyir?
          </a>
        </motion.div>

        {/* Dual mockup — stacks on mobile */}
        <motion.div
          className="flex flex-col md:flex-row gap-3"
          initial={{ y: 56, opacity: 0 }}
          animate={mounted ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
        >
          <GooglePanel />
          <ChatGPTPanel />
        </motion.div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20"
          style={{ background: 'linear-gradient(to bottom, transparent, #FFFFFF)' }} />
      </div>
    </section>
  )
}
