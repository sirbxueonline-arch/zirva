// FILE: components/landing/DualVisibility.tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star, Code, Globe, Hash } from 'lucide-react'

// eslint-disable-next-line @next/next/no-img-element
function ChatGPTLogo({ size = 16 }: { size?: number }) {
  return <img src="/chatgpticon.png" alt="ChatGPT" width={size} height={size} style={{ objectFit: 'contain' }} />
}

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

const CHIPS = [
  { icon: Code, label: 'Schema Markup → ChatGPT onu tapır' },
  { icon: Hash, label: 'Structured Data → Google rich snippet' },
  { icon: Globe, label: 'Hreflang → Doğru auditoriya' },
]

function GoogleSerpMockup() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: '1px solid #e0e0e0',
        boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
      }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: '#f0f0f0', background: '#f8f9fa' }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F25C54' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F5A623' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00C9A7' }} />
        <div
          className="flex-1 mx-3 rounded px-2 py-1 text-xs font-mono flex items-center gap-1"
          style={{ background: '#FFFFFF', border: '1px solid #ddd', color: '#666' }}
        >
          <span style={{ color: '#188038' }}>google.com</span>
          <span style={{ color: '#999' }}>/search?q=bakıda+gözəllik+salonu</span>
        </div>
      </div>

      <div className="p-4">
        {/* Search bar */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-full mb-4"
          style={{ border: '1px solid #dfe1e5', boxShadow: '0 1px 6px rgba(32,33,36,0.1)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="text-sm" style={{ color: '#202124' }}>bakıda gözəllik salonu</span>
          <div className="ml-auto flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#4285F4" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
              <line x1="12" y1="19" x2="12" y2="23" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div style={{ width: 1, height: 24, background: '#dfe1e5' }} />
            <svg width="24" height="24" viewBox="0 0 92 92">
              <path d="M90 46.1c0-2.9-.2-5.7-.7-8.4H46v16h24.7c-1.1 5.6-4.3 10.3-9.2 13.5v11.2h14.9C85 70.4 90 59 90 46.1z" fill="#4285F4" />
              <path d="M46 92c12.5 0 23-4.1 30.6-11.1L61.8 69.7c-4.1 2.8-9.5 4.5-15.8 4.5-12.1 0-22.4-8.2-26.1-19.2H4.6v11.6C12.1 82.3 28.1 92 46 92z" fill="#34A853" />
              <path d="M19.9 55c-.9-2.8-1.4-5.8-1.4-8.8 0-3 .5-6 1.4-8.8V25.8H4.6A45.9 45.9 0 0 0 0 46.2c0 7.4 1.8 14.5 4.6 20.4L19.9 55z" fill="#FBBC05" />
              <path d="M46 18.3c6.8 0 12.9 2.3 17.7 6.9l13.2-13.2C69 4.5 58.5 0 46 0 28.1 0 12.1 9.7 4.6 25.8l15.3 11.6C23.6 26.4 33.9 18.3 46 18.3z" fill="#EA4335" />
            </svg>
          </div>
        </div>

        {/* Result 1 — highlighted */}
        <div
          className="relative rounded-lg p-3 mb-2"
          style={{
            background: 'rgba(66,133,244,0.05)',
            border: '1.5px solid rgba(66,133,244,0.3)',
          }}
        >
          {/* #1 badge */}
          <div
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: '#4285F4', fontSize: '10px' }}
          >
            1
          </div>
          <div className="text-xs mb-0.5" style={{ color: '#188038' }}>beautystudio.az</div>
          <div className="text-sm font-medium mb-1" style={{ color: '#1a0dab', lineHeight: 1.3 }}>
            Beauty Studio Bakı | Peşəkar Gözəllik Salonu Nəsimi
          </div>
          <div className="text-xs mb-1.5" style={{ color: '#4d5156', lineHeight: 1.5 }}>
            Bakı Nəsimidə peşəkar gözəllik salonu. Saç, dırnaq, makiyaj...
          </div>
          {/* Rich snippet */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} fill="#F5A623" style={{ color: '#F5A623' }} strokeWidth={0} />
              ))}
            </div>
            <span className="text-xs font-medium" style={{ color: '#3c4043' }}>4.9</span>
            <span className="text-xs" style={{ color: '#70757a' }}>(287 rəy)</span>
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(66,133,244,0.1)', color: '#1a0dab' }}>
              Açıqdır
            </span>
          </div>
        </div>

        {/* Result 2 — faded */}
        <div className="rounded-lg p-3 mb-2 opacity-35">
          <div className="text-xs mb-0.5" style={{ color: '#188038' }}>guzellikmerkezi.az</div>
          <div className="text-sm font-medium mb-1" style={{ color: '#1a0dab' }}>
            Gözəllik Mərkəzi — Bakıda Xidmətlər
          </div>
          <div className="text-xs" style={{ color: '#4d5156' }}>
            Saç, dırnaq və makiyaj xidmətləri. Bakı şəhərinin...
          </div>
        </div>

        {/* Result 3 — faded */}
        <div className="rounded-lg p-3 opacity-20">
          <div className="text-xs mb-0.5" style={{ color: '#188038' }}>salon-baku.az</div>
          <div className="text-sm font-medium mb-1" style={{ color: '#1a0dab' }}>
            Salon Bakı | Peşəkar Xidmət
          </div>
          <div className="text-xs" style={{ color: '#4d5156' }}>
            Bakıda keyfiyyətli gözəllik xidmətləri...
          </div>
        </div>

        {/* Label */}
        <div
          className="mt-3 px-3 py-2 rounded-lg text-xs text-center font-medium"
          style={{ background: 'rgba(66,133,244,0.08)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.15)' }}
        >
          Schema markup sayəsində rich snippet
        </div>
      </div>
    </div>
  )
}

function ChatGPTMockup() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: '#1e1e1e',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#171717' }}
      >
        <ChatGPTLogo size={28} />
        <span className="text-sm font-semibold" style={{ color: '#FFFFFF' }}>ChatGPT</span>
        <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.4)' }}>GPT-4o</span>
      </div>

      <div className="p-4 space-y-3">
        {/* User message */}
        <div className="flex justify-end">
          <div
            className="max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm"
            style={{ background: '#2f2f2f', color: 'rgba(255,255,255,0.9)' }}
          >
            Bakıda ən yaxşı gözəllik salonu?
          </div>
        </div>

        {/* ChatGPT response */}
        <div className="flex gap-2.5">
          <ChatGPTLogo size={28} />
          <div className="flex-1 space-y-2">
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              Bakıda bir neçə yüksək reytinqli gözəllik salonu var. Müştəri rəylərinə və onlayn məlumatlara əsasən:
            </p>

            {/* Recommendation box */}
            <div
              className="relative rounded-xl p-3"
              style={{
                background: 'rgba(16,163,127,0.12)',
                border: '1px solid rgba(16,163,127,0.3)',
              }}
            >
              {/* #1 badge */}
              <div
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: '#10a37f', fontSize: '10px' }}
              >
                1
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-0.5" style={{ color: '#10a37f' }}>
                    Beauty Studio Bakı
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                    Nəsimi rayonu — saç, dırnaq, makiyaj xidmətləri
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={10} fill="#F5A623" style={{ color: '#F5A623' }} strokeWidth={0} />
                    ))}
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>4.9 · 287 rəy</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
              beautystudio.az · Strukturlu məlumat əsasında tövsiyə edilir
            </p>
          </div>
        </div>

        {/* Note */}
        <div
          className="rounded-xl px-3 py-2.5 text-xs text-center"
          style={{ background: 'rgba(123,110,246,0.12)', color: 'rgba(155,143,248,0.9)', border: '1px solid rgba(123,110,246,0.2)' }}
        >
          Zirva schema markup + structured data ilə həm Google-u, həm ChatGPT-ni eyni anda optimallaşdırır
        </div>
      </div>
    </div>
  )
}

export default function DualVisibility() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{ background: '#0D0D1A' }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(123,110,246,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background: 'rgba(123,110,246,0.07)',
          top: '-10%',
          right: '-5%',
          filter: 'blur(100px)',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: 'rgba(0,201,167,0.05)',
          bottom: '-5%',
          left: '-5%',
          filter: 'blur(90px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.05 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-semibold mb-6"
            style={{
              background: 'rgba(123,110,246,0.12)',
              borderColor: 'rgba(123,110,246,0.3)',
              color: '#9B8FF8',
            }}
          >
            <Globe size={13} strokeWidth={2.5} />
            İkili görünürlük
          </div>
          <h2
            className="font-display font-bold text-4xl md:text-5xl mb-4"
            style={{ color: '#FFFFFF' }}
          >
            Google-da 1-nci.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ChatGPT-də də.
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>
            AI axtarışı artıq əsas axıma çevrilib. Hər iki platforma strukturlu data siqnallarından istifadə edir — Zirva sizi hər ikisindən tapılır edir.
          </p>
        </motion.div>

        {/* Two mockups */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10 mb-10">
          {/* Left — Google */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ ...SPRING, delay: 0.15 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 92 92">
                <path d="M90 46.1c0-2.9-.2-5.7-.7-8.4H46v16h24.7c-1.1 5.6-4.3 10.3-9.2 13.5v11.2h14.9C85 70.4 90 59 90 46.1z" fill="#4285F4" />
                <path d="M46 92c12.5 0 23-4.1 30.6-11.1L61.8 69.7c-4.1 2.8-9.5 4.5-15.8 4.5-12.1 0-22.4-8.2-26.1-19.2H4.6v11.6C12.1 82.3 28.1 92 46 92z" fill="#34A853" />
                <path d="M19.9 55c-.9-2.8-1.4-5.8-1.4-8.8 0-3 .5-6 1.4-8.8V25.8H4.6A45.9 45.9 0 0 0 0 46.2c0 7.4 1.8 14.5 4.6 20.4L19.9 55z" fill="#FBBC05" />
                <path d="M46 18.3c6.8 0 12.9 2.3 17.7 6.9l13.2-13.2C69 4.5 58.5 0 46 0 28.1 0 12.1 9.7 4.6 25.8l15.3 11.6C23.6 26.4 33.9 18.3 46 18.3z" fill="#EA4335" />
              </svg>
              <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>Google Axtarışı</span>
            </div>
            <GoogleSerpMockup />
          </motion.div>

          {/* Right — ChatGPT */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ ...SPRING, delay: 0.25 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <ChatGPTLogo size={20} />
              <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.7)' }}>ChatGPT Cavabı</span>
            </div>
            <ChatGPTMockup />
          </motion.div>
        </div>

        {/* Feature chips */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.4 }}
        >
          {CHIPS.map((chip, i) => (
            <motion.div
              key={chip.label}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(8px)',
              }}
              initial={{ y: 10, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ ...SPRING, delay: 0.45 + i * 0.08 }}
            >
              <chip.icon size={14} style={{ color: '#7B6EF6', flexShrink: 0 }} strokeWidth={2} />
              {chip.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
