'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, Search, BarChart2, Sparkles } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

/* ── Step visual mockups ── */
function MockURL() {
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ background: '#F5F5FF', border: '1.5px solid rgba(123,110,246,0.12)', boxShadow: '0 8px 28px rgba(13,13,26,0.07)' }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: '#EEEEFF', borderBottom: '1px solid rgba(123,110,246,0.1)' }}>
        <div className="w-2 h-2 rounded-full" style={{ background: '#F25C54' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: '#F5A623' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: '#00C9A7' }} />
      </div>
      <div className="p-4 space-y-2">
        <div className="h-2.5 rounded-full w-3/4" style={{ background: 'rgba(123,110,246,0.15)' }} />
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: '#FFFFFF', border: '1.5px solid rgba(123,110,246,0.25)' }}
        >
          <Globe size={12} style={{ color: '#9B9EBB' }} />
          <span className="text-xs font-mono" style={{ color: '#0D0D1A' }}>saytiniz.az</span>
          <span className="ml-auto text-xs animate-pulse" style={{ color: '#7B6EF6' }}>|</span>
        </div>
        <div className="flex justify-end mt-2">
          <div className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white" style={{ background: '#0D0D1A' }}>
            Analiz et →
          </div>
        </div>
      </div>
    </div>
  )
}

function MockTags() {
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ background: '#F5F5FF', border: '1.5px solid rgba(123,110,246,0.12)', boxShadow: '0 8px 28px rgba(13,13,26,0.07)' }}>
      <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: '#EEEEFF', borderBottom: '1px solid rgba(123,110,246,0.1)' }}>
        <div className="w-2 h-2 rounded-full" style={{ background: '#F25C54' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: '#F5A623' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: '#00C9A7' }} />
      </div>
      <div className="p-4 space-y-2">
        {['Title teq', 'Meta açıqlama', 'Schema markup'].map((t, i) => (
          <div key={t} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#7B6EF6' }} />
            <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(123,110,246,0.18)', width: `${80 - i * 14}%` }} />
          </div>
        ))}
        <div className="flex gap-1.5 pt-1 flex-wrap">
          {['hreflang', 'og:image', 'canonical'].map(t => (
            <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded-md" style={{ background: 'rgba(0,201,167,0.1)', color: '#00C9A7', border: '1px solid rgba(0,201,167,0.25)' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function MockScore() {
  return (
    <div className="w-full rounded-2xl overflow-hidden" style={{ background: '#F5F5FF', border: '1.5px solid rgba(123,110,246,0.12)', boxShadow: '0 8px 28px rgba(13,13,26,0.07)' }}>
      <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: '#EEEEFF', borderBottom: '1px solid rgba(123,110,246,0.1)' }}>
        <div className="w-2 h-2 rounded-full" style={{ background: '#F25C54' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: '#F5A623' }} />
        <div className="w-2 h-2 rounded-full" style={{ background: '#00C9A7' }} />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-1">
            {['#', '#', '#'].map((_, i) => (
              <div key={i} className="w-5 h-1.5 rounded-full" style={{ background: i < 2 ? '#00C9A7' : 'rgba(123,110,246,0.2)' }} />
            ))}
          </div>
          <BarChart2 size={14} style={{ color: '#7B6EF6' }} />
        </div>
        {/* mini chart */}
        <svg viewBox="0 0 120 40" className="w-full" style={{ height: 48 }}>
          <polyline
            points="0,38 20,30 40,22 60,28 80,14 100,8 120,4"
            fill="none"
            stroke="#00C9A7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="0,38 20,30 40,22 60,28 80,14 100,8 120,4"
            fill="url(#g)"
            stroke="none"
            opacity="0.15"
          />
          <defs>
            <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00C9A7" />
              <stop offset="100%" stopColor="#00C9A7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex items-center gap-1 mt-1">
          <Search size={10} style={{ color: '#7B6EF6' }} />
          <span className="text-[10px] font-medium" style={{ color: '#737599' }}>Google.az #1 pozisiya</span>
        </div>
      </div>
    </div>
  )
}

const STEPS = [
  {
    num: '1',
    title: 'URL-i daxil edin',
    desc: 'Saytınızın ünvanını yapışdırın — Zirva onu saniyələr içində oxuyur.',
    visual: <MockURL />,
  },
  {
    num: '2',
    title: 'AI teqləri yaradır',
    desc: 'Süni intellekt title, meta, schema, hreflang — hamısını avtomatik hazırlayır.',
    visual: <MockTags />,
  },
  {
    num: '3',
    title: 'Yayımlayın, böyüyün',
    desc: 'Bir kliklə kopyalayın, saytınıza yapışdırın. Google-da yuxarı çıxın.',
    visual: <MockScore />,
  },
]

const FEATURES = [
  {
    icon: Search,
    iconColor: '#7B6EF6',
    title: 'Açar sözləri tapır',
    desc: 'Sadə teq yazmaqdan kənara çıxır. AI saytınızı öyrənib ən effektiv açar sözləri seçir.',
    badge: { label: 'SEO Balı', value: '92', color: '#00C9A7' },
  },
  {
    icon: Globe,
    iconColor: '#4285F4',
    title: 'Saytınızı öyrənir',
    desc: 'Tonu, dili, istiqaməti anlayır — hər teq saytınızın özündən gəlmiş kimi görünür.',
    badge: { label: 'Azərb + Rusca + EN', value: null, color: '#7B6EF6' },
  },
  {
    icon: BarChart2,
    iconColor: '#00C9A7',
    title: 'Auditoriyani tanır',
    desc: 'Müştərilərinizin axtardığını anlayır, onları hədəfləyən teqlər qurur.',
    badge: { label: 'Google · Bing · ChatGPT', value: null, color: '#F5A623' },
  },
]

export default function StepsSection() {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const inView1 = useInView(ref1, { once: true, margin: '-60px' })
  const inView2 = useInView(ref2, { once: true, margin: '-60px' })

  return (
    <>
      {/* ── 3 Steps ── */}
      <section id="how-it-works" ref={ref1} className="py-24" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ y: 24, opacity: 0 }}
            animate={inView1 ? { y: 0, opacity: 1 } : {}}
            transition={{ ...SPRING }}
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-3" style={{ color: '#0D0D1A' }}>
              3 addımda başlayın
            </h2>
            <p className="text-lg" style={{ color: '#737599' }}>
              URL-dən tam SEO paketinə — 30 saniyədə
            </p>
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Desktop connectors between steps */}
            <div className="hidden md:flex absolute top-[72px] left-0 right-0 items-center pointer-events-none" style={{ zIndex: 0 }}>
              <div className="flex-1" />
              <div className="flex items-center gap-1" style={{ width: 'calc(33.33% - 32px)', justifyContent: 'center' }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-px flex-1 rounded-full" style={{ background: 'rgba(123,110,246,0.25)' }} />
                ))}
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0, color: '#7B6EF6' }}>
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-1" style={{ width: 'calc(33.33% - 32px)', justifyContent: 'center' }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-px flex-1 rounded-full" style={{ background: 'rgba(123,110,246,0.25)' }} />
                ))}
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0, color: '#7B6EF6' }}>
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <div className="flex-1" />
            </div>

            {/* Mobile vertical connector */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ top: 220, height: 'calc(100% - 440px)', zIndex: 0 }}>
              <div className="w-px flex-1" style={{ background: 'linear-gradient(to bottom, rgba(123,110,246,0.3), rgba(123,110,246,0.1))' }} />
            </div>

            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                className="relative flex flex-col items-center text-center gap-5"
                style={{ zIndex: 1 }}
                initial={{ y: 28, opacity: 0 }}
                animate={inView1 ? { y: 0, opacity: 1 } : {}}
                transition={{ ...SPRING, delay: 0.08 + i * 0.1 }}
              >
                {/* Step number badge */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mb-1 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 4px 12px rgba(123,110,246,0.3)' }}>
                  {step.num}
                </div>

                {/* Visual */}
                <div className="w-full max-w-[260px]">
                  {step.visual}
                </div>

                {/* Text */}
                <div>
                  <p className="font-display font-bold text-lg mb-1" style={{ color: '#0D0D1A' }}>
                    {step.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#737599' }}>
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ── */}
      <section ref={ref2} className="py-16 pb-24" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto px-6">

          {/* Headline */}
          <motion.div
            className="mb-8"
            initial={{ y: 24, opacity: 0 }}
            animate={inView2 ? { y: 0, opacity: 1 } : {}}
            transition={{ ...SPRING }}
          >
            <p className="text-base mb-2" style={{ color: '#737599' }}>
              Tam avtomatlaşdırılmış SEO
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl leading-tight" style={{ color: '#0D0D1A', maxWidth: '16ch' }}>
              SEO işinin 100%-i avtomatdır
            </h2>
          </motion.div>

          {/* Bottom: single gray card with 3 columns */}
          <motion.div
            className="rounded-3xl grid grid-cols-1 md:grid-cols-3"
            style={{ background: '#F2F2F5' }}
            initial={{ y: 24, opacity: 0 }}
            animate={inView2 ? { y: 0, opacity: 1 } : {}}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            {/* Col 1: Finds Best Keywords */}
            <div
              className="flex flex-col p-8"
              style={{ borderRight: '1px solid rgba(0,0,0,0.07)' }}
            >
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#0D0D1A' }}>
                Açar sözləri tapır
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280' }}>
                Sadə teq yazmaqdan kənara çıxır. AI saytınızı öyrənib ən effektiv açar sözləri seçir.
              </p>
              {/* Segmented speedometer — 240° arc (8→12→4 o'clock), center (60,72) r=48
                   5 segs × 43.2° + 4 gaps × 6° = 240° */}
              <div className="mt-auto">
                <svg viewBox="0 15 120 92" style={{ width: '100%', maxWidth: 180 }}>
                  {/* 5 gray segments, clockwise sweep=1, small-arc=0 */}
                  <path d="M 18.4 96 A 48 48 0 0 1 13.2 61.2"   fill="none" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="butt" />
                  <path d="M 14.7 56.2 A 48 48 0 0 1 37.8 29.5"  fill="none" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="butt" />
                  <path d="M 42.3 27.4 A 48 48 0 0 1 77.7 27.4"  fill="none" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="butt" />
                  <path d="M 82.2 29.5 A 48 48 0 0 1 105.3 56.2" fill="none" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="butt" />
                  <path d="M 106.8 61.2 A 48 48 0 0 1 101.6 96"  fill="none" stroke="#E2E8F0" strokeWidth="14" strokeLinecap="butt" />
                  {/* Green first segment (8 o'clock, bottom-left) */}
                  <path d="M 18.4 96 A 48 48 0 0 1 13.2 61.2"   fill="none" stroke="#22C55E" strokeWidth="14" strokeLinecap="butt" />
                  {/* Score */}
                  <text x="60" y="71" textAnchor="middle" fontSize="22" fontWeight="700" fill="#0D0D1A" fontFamily="inherit">5</text>
                  {/* Label */}
                  <text x="60" y="85" textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily="inherit">Asan</text>
                </svg>
              </div>
            </div>

            {/* Col 2: Learns Your Content */}
            <div
              className="flex flex-col p-8"
              style={{ borderRight: '1px solid rgba(0,0,0,0.07)' }}
            >
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#0D0D1A' }}>
                Saytınızı öyrənir
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280' }}>
                Tonu, dili, istiqaməti anlayır — hər teq saytınızın özündən gəlmiş kimi görünür.
              </p>
              {/* Sparkle */}
              <div className="mt-auto flex items-center gap-2.5">
                <Sparkles size={26} style={{ color: '#F25C54' }} />
                <span className="text-xl font-bold" style={{ color: '#0D0D1A' }}>Abc 123</span>
              </div>
            </div>

            {/* Col 3: Knows Your Audience */}
            <div className="flex flex-col p-8">
              <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#0D0D1A' }}>
                Auditoriyani tanır
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280' }}>
                Müştərilərinizin axtardığını anlayır, onları hədəfləyən teqlər qurur.
              </p>
              {/* Platform logos */}
              <div className="mt-auto flex items-center gap-4">
                <svg width="32" height="32" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/binglogo.png" alt="Bing" width={32} height={32} style={{ objectFit: 'contain' }} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/chatgpticon.png" alt="ChatGPT" width={32} height={32} style={{ objectFit: 'contain' }} />
              </div>
            </div>
          </motion.div>

        </div>
      </section>
    </>
  )
}
