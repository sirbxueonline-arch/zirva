'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

interface Row {
  label:  string
  zirva:  boolean
  agency: boolean
  diy:    boolean
}

const ROWS: Row[] = [
  { label: 'Saniyələr içində hazır', zirva: true,  agency: false, diy: false },
  { label: 'Yüksək SEO balı',        zirva: true,  agency: true,  diy: false },
  { label: 'Azərb. optimallaşdırma', zirva: true,  agency: true,  diy: false },
  { label: 'Asan quraşdırma',        zirva: true,  agency: false, diy: false },
  { label: 'Çoxdilli dəstək',        zirva: true,  agency: false, diy: false },
  { label: 'Sərfəli qiymət',         zirva: true,  agency: false, diy: false },
]

function Tick({ yes }: { yes: boolean }) {
  return yes ? (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{ background: '#00C9A7' }}>
      <Check size={16} strokeWidth={3} color="#fff" />
    </span>
  ) : (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full" style={{ background: '#F25C54' }}>
      <X size={16} strokeWidth={3} color="#fff" />
    </span>
  )
}

export default function PlanComparison() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-20" style={{ background: '#FFFFFF' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING }}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-2" style={{ color: '#0D0D1A' }}>
            Zirva vs digər variantlar
          </h2>
          <p className="text-sm" style={{ color: '#737599' }}>
            Niyə Zirva ən ağıllı seçimdir?
          </p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.08 }}
        >
          {/* Zirva column highlight — full height background + border */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: '25%',
              width: '25%',
              top: 0,
              bottom: 0,
              background: 'rgba(123,110,246,0.04)',
              border: '1.5px solid rgba(123,110,246,0.35)',
              borderRadius: 16,
              zIndex: 0,
            }}
          />

          {/* Header row */}
          <div className="relative grid grid-cols-4 pb-6">
            <div />

            {/* Zirva header */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-8 gap-1">
              <span
                className="font-display font-bold text-lg"
                style={{ color: '#7B6EF6' }}
              >
                Zirva
              </span>
            </div>

            {/* Agency header */}
            <div className="flex items-end justify-center pb-2">
              <span className="font-display font-bold text-base" style={{ color: '#0D0D1A' }}>Agentlik</span>
            </div>

            {/* DIY header */}
            <div className="flex items-end justify-center pb-2">
              <span className="font-display font-bold text-base" style={{ color: '#0D0D1A' }}>Öz-Özünə</span>
            </div>
          </div>

          {/* Feature rows */}
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className="relative grid grid-cols-4 items-center"
              style={{
                borderTop: '1px solid rgba(13,13,26,0.07)',
                paddingTop: 18,
                paddingBottom: 18,
              }}
            >
              {/* Label */}
              <div className="pr-4">
                <span
                  className="text-sm"
                  style={{
                    color: i === 0 ? '#7B6EF6' : '#3D4060',
                    fontWeight: i === 0 ? 600 : 400,
                  }}
                >
                  {row.label}
                </span>
              </div>

              {/* Zirva */}
              <div className="relative z-10 flex justify-center">
                <Tick yes={row.zirva} />
              </div>

              {/* Agency */}
              <div className="flex justify-center">
                <Tick yes={row.agency} />
              </div>

              {/* DIY */}
              <div className="flex justify-center">
                <Tick yes={row.diy} />
              </div>
            </div>
          ))}

          {/* Bottom padding inside the Zirva highlight box */}
          <div style={{ paddingBottom: 8 }} />
        </motion.div>
      </div>
    </section>
  )
}
