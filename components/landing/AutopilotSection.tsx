'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { Mail, TrendingUp, BarChart2, ArrowRight, Zap, CheckCircle } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

/* ── Mini email mockup ────────────────────────────── */
function EmailMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid rgba(13,13,26,0.08)',
        boxShadow: '0 24px 64px rgba(13,13,26,0.10)',
        maxWidth: 420,
      }}
    >
      {/* Email client chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: '#F7F7FF', borderColor: 'rgba(123,110,246,0.1)' }}>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F25C54' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F5A623' }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00C9A7' }} />
        </div>
        <div className="flex-1 flex items-center gap-2 ml-2">
          <Mail size={12} style={{ color: '#9CA3AF' }} />
          <span className="text-xs" style={{ color: '#9CA3AF' }}>Həftəlik SEO Hesabatı — Zirva Avtopilot</span>
        </div>
      </div>

      {/* Email header */}
      <div className="px-5 py-4" style={{ background: '#5D50E8' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-white text-base">Zirva Avtopilot</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>Həftəlik</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>saytiniz.az — 24–30 Mart 2026</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 p-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        {[
          { label: 'Klik', value: '1,284', change: '+18%', up: true },
          { label: 'Göstəriş', value: '24,910', change: '+11%', up: true },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl p-3" style={{ background: '#F8F8FF', border: '1px solid rgba(123,110,246,0.1)' }}>
            <p className="text-xs mb-1" style={{ color: '#737599' }}>{stat.label}</p>
            <p className="font-bold text-lg" style={{ color: '#0D0D1A' }}>{stat.value}</p>
            <p className="text-xs font-semibold mt-0.5" style={{ color: stat.up ? '#22C55E' : '#F25C54' }}>{stat.change} ↑</p>
          </div>
        ))}
      </div>

      {/* Top keywords */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF' }}>Top açar sözlər</p>
        {[
          { kw: 'bakıda gözəllik salonu', pos: 2, clicks: 312 },
          { kw: 'nail bar baki', pos: 4, clicks: 198 },
          { kw: 'manikür xidmeti', pos: 7, clicks: 143 },
        ].map((row, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0" style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs font-bold w-4" style={{ color: '#7B6EF6' }}>#{row.pos}</span>
              <span className="text-xs truncate" style={{ color: '#3D4060' }}>{row.kw}</span>
            </div>
            <span className="text-xs font-semibold ml-2 flex-shrink-0" style={{ color: '#0D0D1A' }}>{row.clicks} klik</span>
          </div>
        ))}
      </div>

      {/* AI tip */}
      <div className="mx-4 mb-4 rounded-xl p-3" style={{ background: 'rgba(123,110,246,0.06)', border: '1px solid rgba(123,110,246,0.15)' }}>
        <div className="flex items-start gap-2">
          <Zap size={13} style={{ color: '#7B6EF6', flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs leading-relaxed" style={{ color: '#5A5D7A' }}>
            <strong style={{ color: '#0D0D1A' }}>AI tövsiyəsi:</strong> &ldquo;manikür xidmeti&rdquo; açar sözü üçün title teqinizi yeniləyin — pozisiya 3-ə qalxa bilər.
          </p>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  { icon: BarChart2, color: '#7B6EF6', bg: 'rgba(123,110,246,0.1)', text: 'Klik, göstəriş, orta mövqe — hər həftə emaildə' },
  { icon: TrendingUp, color: '#00C9A7', bg: 'rgba(0,201,167,0.1)', text: 'Yüksələn və düşən açar sözlər avtomatik aşkar edilir' },
  { icon: Zap, color: '#F5A623', bg: 'rgba(245,166,35,0.1)', text: 'GPT-4o AI hər hesabat üçün fərdi tövsiyə yazır' },
  { icon: CheckCircle, color: '#4285F4', bg: 'rgba(66,133,244,0.1)', text: 'Bir dəfə qoşun — qalan hər şey avtomatdır' },
]

export default function AutopilotSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="autopilot-section" ref={ref} className="py-24" style={{ background: '#F5F5FF' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ x: -24, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ ...SPRING }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5" style={{ background: 'rgba(123,110,246,0.1)', border: '1px solid rgba(123,110,246,0.2)' }}>
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#7B6EF6' }}>Yeni</span>
              <span className="w-1 h-1 rounded-full" style={{ background: '#7B6EF6' }} />
              <span className="text-xs font-semibold" style={{ color: '#7B6EF6' }}>Avtopilot</span>
            </div>

            <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight mb-5" style={{ color: '#0D0D1A' }}>
              SEO hesabatınız<br />həftəlik emaildə
            </h2>

            <p className="text-lg leading-relaxed mb-8" style={{ color: '#737599' }}>
              Google Search Console-a bir dəfə bağlayın. Zirva hər həftə saytınızın kliklərini, açar sözlərini və AI tövsiyələrini emailə göndərir — siz heç nə etmirsiniz.
            </p>

            {/* Feature list */}
            <div className="space-y-4 mb-8">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ x: -16, opacity: 0 }}
                  animate={inView ? { x: 0, opacity: 1 } : {}}
                  transition={{ ...SPRING, delay: 0.1 + i * 0.07 }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: f.bg }}>
                    <f.icon size={16} style={{ color: f.color }} strokeWidth={2.5} />
                  </div>
                  <p className="text-sm" style={{ color: '#3D4060' }}>{f.text}</p>
                </motion.div>
              ))}
            </div>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)',
                boxShadow: '0 0 0 1px rgba(123,110,246,0.4), 0 8px 24px rgba(123,110,246,0.35)',
              }}
            >
              Avtopilotu aktivləşdir
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          </motion.div>

          {/* Right — email mockup */}
          <motion.div
            className="flex justify-center lg:justify-end"
            initial={{ x: 24, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <EmailMockup />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
