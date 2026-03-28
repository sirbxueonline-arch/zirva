'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Copy, Check, Globe, Cpu, Mail } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

/* ── Mini SEO score speedometer (same geometry as StepsSection gauge) ── */
function ScoreGauge({ score }: { score: number }) {
  // 240° arc, 5 segs × 43.2° + 4 gaps × 6° = 240°, center (60,72) r=48
  // Segments filled = ceil(score / 20)
  const filled = Math.ceil(score / 20)
  const segs = [
    { d: 'M 18.4 96 A 48 48 0 0 1 13.2 61.2' },
    { d: 'M 14.7 56.2 A 48 48 0 0 1 37.8 29.5' },
    { d: 'M 42.3 27.4 A 48 48 0 0 1 77.7 27.4' },
    { d: 'M 82.2 29.5 A 48 48 0 0 1 105.3 56.2' },
    { d: 'M 106.8 61.2 A 48 48 0 0 1 101.6 96' },
  ]
  return (
    <svg viewBox="0 15 120 88" style={{ width: 140, height: 103 }}>
      {segs.map((s, i) => (
        <path key={i} d={s.d} fill="none"
          stroke={i < filled ? '#22C55E' : '#E2E8F0'}
          strokeWidth="14" strokeLinecap="butt" />
      ))}
      <text x="60" y="72" textAnchor="middle" fontSize="20" fontWeight="700" fill="#0D0D1A" fontFamily="inherit">{score}</text>
      <text x="60" y="86" textAnchor="middle" fontSize="10" fill="#9CA3AF" fontFamily="inherit">/100</text>
    </svg>
  )
}

/* ── Right-side product mockup ── */
function Mockup() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid rgba(13,13,26,0.08)',
        boxShadow: '0 24px 64px rgba(13,13,26,0.10)',
      }}
    >
      {/* Chrome bar */}
      <div className="flex items-center gap-1.5 px-4 py-3" style={{ background: '#F7F7FF', borderBottom: '1px solid rgba(123,110,246,0.1)' }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F25C54' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F5A623' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#00C9A7' }} />
        <div className="ml-3 flex-1 rounded-md px-3 py-1 text-xs font-mono" style={{ background: '#EDEDFF', color: '#7B6EF6' }}>
          app.tryzirva.com
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* URL row */}
        <div className="flex items-center gap-2 text-xs" style={{ color: '#737599' }}>
          <span className="font-mono px-2 py-0.5 rounded" style={{ background: '#F5F5FF' }}>saytiniz.az/blog/post-1</span>
          <span className="ml-auto px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: 'rgba(0,201,167,0.1)', color: '#00C9A7' }}>Analiz edildi ✓</span>
        </div>

        {/* Score card */}
        <div
          className="rounded-xl p-4 flex items-center gap-4"
          style={{ background: '#F8F8FF', border: '1px solid rgba(123,110,246,0.1)' }}
        >
          <ScoreGauge score={95} />
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: '#737599' }}>SEO Balı</p>
            <p className="text-2xl font-bold" style={{ color: '#0D0D1A' }}>95<span className="text-sm font-normal text-gray-400">/100</span></p>
            <p className="text-[11px] mt-0.5" style={{ color: '#22C55E' }}>Əla — Yayımlamağa hazırdır</p>
          </div>
        </div>

        {/* Generated tags */}
        <div className="space-y-2">
          {[
            { label: 'Title teq', value: 'Bakıda Ən Yaxşı Çiçək Mağazası | Gül Bağı', color: '#7B6EF6' },
            { label: 'Meta açıqlama', value: 'Bakıda ən geniş çiçək seçimi. Sürətli çatdırılma, əlverişli qiymət...', color: '#0D0D1A' },
          ].map((tag) => (
            <div key={tag.label} className="rounded-lg p-3" style={{ background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#9CA3AF' }}>{tag.label}</span>
                <Copy size={12} style={{ color: '#C4C4D4' }} />
              </div>
              <p className="text-xs leading-snug" style={{ color: tag.color }}>{tag.value}</p>
            </div>
          ))}
        </div>

        {/* Schema + hreflang pills */}
        <div className="flex flex-wrap gap-1.5">
          {['Schema markup ✓', 'hreflang ✓', 'Open Graph ✓', 'canonical ✓'].map(t => (
            <span key={t} className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,201,167,0.08)', color: '#00C9A7', border: '1px solid rgba(0,201,167,0.2)' }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FeatureSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24" style={{ background: '#F5F5FF' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ x: -24, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ ...SPRING }}
          >
            <h2 className="font-display font-extrabold text-4xl md:text-5xl leading-tight mb-6" style={{ color: '#0D0D1A' }}>
              Etibarla<br />yayımlayın
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: '#737599' }}>
              Zirva arxa planda işləyir — saytınızı öyrənir, mükəmməl SEO teqlərini hazırlayır. Siz yalnız "Kopyala" düyməsini basırsınız.
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-3">
              <div
                className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl"
                style={{ background: '#FFFFFF', border: '1.5px solid rgba(13,13,26,0.07)', boxShadow: '0 4px 16px rgba(13,13,26,0.06)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,201,167,0.1)' }}>
                  <Check size={20} style={{ color: '#00C9A7' }} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#737599' }}>Bir kliklə kopyala</p>
                  <p className="text-sm font-semibold" style={{ color: '#0D0D1A' }}>Teqlər hazırdır — yapışdır, bitdi.</p>
                </div>
              </div>

              <div
                className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl"
                style={{ background: '#FFFFFF', border: '1.5px solid rgba(13,13,26,0.07)', boxShadow: '0 4px 16px rgba(13,13,26,0.06)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(66,133,244,0.1)' }}>
                  <Globe size={20} style={{ color: '#4285F4' }} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#737599' }}>Azərb + Rus + İngilis</p>
                  <p className="text-sm font-semibold" style={{ color: '#0D0D1A' }}>Üç dildə teqlər — hər bazarda görün.</p>
                </div>
              </div>

              <div
                className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl"
                style={{ background: '#FFFFFF', border: '1.5px solid rgba(13,13,26,0.07)', boxShadow: '0 4px 16px rgba(13,13,26,0.06)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(123,110,246,0.1)' }}>
                  <Cpu size={20} style={{ color: '#7B6EF6' }} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#737599' }}>GPT-4o ilə hazırlanır</p>
                  <p className="text-sm font-semibold" style={{ color: '#0D0D1A' }}>Ən güclü AI — hər teq optimal.</p>
                </div>
              </div>

              <div
                className="inline-flex items-center gap-4 px-5 py-4 rounded-2xl"
                style={{ background: '#FFFFFF', border: '1.5px solid rgba(13,13,26,0.07)', boxShadow: '0 4px 16px rgba(13,13,26,0.06)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,166,35,0.1)' }}>
                  <Mail size={20} style={{ color: '#F5A623' }} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: '#737599' }}>Avtopilot hesabatları</p>
                  <p className="text-sm font-semibold" style={{ color: '#0D0D1A' }}>Həftəlik SEO məlumatı emaildə.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — mockup */}
          <motion.div
            initial={{ x: 24, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <Mockup />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
