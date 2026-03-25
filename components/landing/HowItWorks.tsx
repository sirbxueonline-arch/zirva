// FILE: components/landing/HowItWorks.tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Globe, Bot, Download, CheckCircle, Clock } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

const STEPS = [
  {
    icon: Globe,
    iconColor: '#7B6EF6',
    iconBg: 'rgba(123,110,246,0.1)',
    num: '01',
    title: 'URL-i daxil edin',
    desc: 'Saytınızın ünvanını yapışdırın',
  },
  {
    icon: Bot,
    iconColor: '#00C9A7',
    iconBg: 'rgba(0,201,167,0.1)',
    num: '02',
    title: 'AI analiz edir',
    desc: 'Zirva saytı oxuyur, rəqibləri müqayisə edir, 30+ siqnal yoxlayır',
  },
  {
    icon: Download,
    iconColor: '#4285F4',
    iconBg: 'rgba(66,133,244,0.1)',
    num: '03',
    title: 'SEO paketi hazırdır',
    desc: 'Title teq, meta, schema, hreflang — hamısı Azərbaycan dilində',
  },
]

const MOCK_TITLE = 'Gözəllik Salonu Bakıda | Beauty Studio Nəsimi'
const MOCK_META = 'Bakı Nəsimidə peşəkar gözəllik salonu. Saç, dırnaq, makiyaj xidmətləri. Onlayn qeydiyyat mümkündür.'

function OutputCard({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid rgba(123,110,246,0.14)',
        boxShadow: '0 24px 64px rgba(123,110,246,0.14), 0 8px 20px rgba(13,13,26,0.06)',
      }}
      initial={{ x: 50, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : {}}
      transition={{ ...SPRING, delay: 0.3 }}
    >
      {/* Browser chrome */}
      <div
        className="flex items-center gap-1.5 px-4 py-3 border-b"
        style={{ borderColor: 'rgba(123,110,246,0.08)', background: '#F8F7FF' }}
      >
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F25C54' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F5A623' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00C9A7' }} />
        <div
          className="flex-1 mx-3 rounded-md px-3 py-1 text-xs font-mono flex items-center gap-1.5"
          style={{ background: '#EEEEFF', color: '#9B9EBB' }}
        >
          <Globe size={10} strokeWidth={2} />
          beautystudio.az
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* SEO Score */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9B9EBB' }}>
            SEO Balı
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-3xl" style={{ color: '#00C9A7' }}>92</span>
            <span className="text-sm" style={{ color: '#737599' }}>/100</span>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,201,167,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00C9A7, #7B6EF6)' }}
            initial={{ width: 0 }}
            animate={inView ? { width: '92%' } : { width: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: 'easeOut' }}
          />
        </div>

        {/* Title tag field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#737599' }}>
              Title Teq
            </span>
            <span className="text-xs font-mono" style={{ color: '#00C9A7' }}>
              {MOCK_TITLE.length} / 60
            </span>
          </div>
          <div
            className="rounded-xl px-3.5 py-2.5 text-sm"
            style={{
              background: '#F5F5FF',
              border: '1px solid rgba(123,110,246,0.12)',
              color: '#0D0D1A',
              lineHeight: 1.5,
            }}
          >
            {MOCK_TITLE}
          </div>
        </div>

        {/* Meta description field */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#737599' }}>
              Meta Açıqlama
            </span>
            <span className="text-xs font-mono" style={{ color: '#00C9A7' }}>
              {MOCK_META.length} / 160
            </span>
          </div>
          <div
            className="rounded-xl px-3.5 py-2.5 text-sm"
            style={{
              background: '#F5F5FF',
              border: '1px solid rgba(123,110,246,0.12)',
              color: '#0D0D1A',
              lineHeight: 1.5,
            }}
          >
            {MOCK_META}
          </div>
        </div>

        {/* Badge row */}
        <div className="flex flex-wrap items-center gap-2">
          {['hreflang', 'schema', 'og:image', 'canonical'].map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg"
              style={{
                background: 'rgba(0,201,167,0.1)',
                border: '1px solid rgba(0,201,167,0.25)',
                color: '#00C9A7',
              }}
            >
              <CheckCircle size={10} strokeWidth={2.5} />
              {tag}
            </span>
          ))}

          {/* Time badge */}
          <span
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{
              background: 'rgba(123,110,246,0.1)',
              border: '1px solid rgba(123,110,246,0.2)',
              color: '#7B6EF6',
            }}
          >
            <Clock size={10} strokeWidth={2.5} />
            30 saniyə
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="how-it-works" ref={ref} className="py-24" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0 }}
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#0D0D1A' }}>
            3 Addımda Zirvəyə
          </h2>
          <p className="text-lg" style={{ color: '#3D4060' }}>
            URL-dən tam SEO paketinə — 30 saniyədə
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Steps */}
          <div className="relative">
            {/* Vertical dashed line */}
            <div
              className="absolute left-[22px] top-12 bottom-12 w-px pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(to bottom, rgba(123,110,246,0.25) 0px, rgba(123,110,246,0.25) 6px, transparent 6px, transparent 14px)',
              }}
            />

            <div className="space-y-10">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  className="relative flex items-start gap-5"
                  initial={{ x: -30, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ ...SPRING, delay: 0.1 + i * 0.12 }}
                >
                  {/* Icon circle */}
                  <div
                    className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: step.iconBg,
                      border: `1.5px solid ${step.iconColor}30`,
                    }}
                  >
                    <step.icon size={20} style={{ color: step.iconColor }} strokeWidth={2} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-bold font-mono"
                        style={{ color: step.iconColor }}
                      >
                        {step.num}
                      </span>
                      <h3 className="font-display font-semibold text-lg" style={{ color: '#0D0D1A' }}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: '#737599' }}>
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Output card */}
          <OutputCard inView={inView} />
        </div>
      </div>
    </section>
  )
}
