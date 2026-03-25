'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X } from 'lucide-react'
import Link from 'next/link'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

interface Row {
  label:  string
  zirva:  boolean
  agency: boolean
  diy:    boolean
}

const ROWS: Row[] = [
  { label: 'Saniyələr içində hazır',  zirva: true,  agency: false, diy: false },
  { label: 'Yüksək SEO balı',         zirva: true,  agency: true,  diy: false },
  { label: 'Azərb. optimallaşdırma',  zirva: true,  agency: true,  diy: false },
  { label: 'Asan quraşdırma',         zirva: true,  agency: false, diy: false },
  { label: 'Çoxdilli dəstək',         zirva: true,  agency: false, diy: false },
  { label: 'Sərfəli qiymət',          zirva: true,  agency: false, diy: false },
]

function Tick({ yes }: { yes: boolean }) {
  return yes ? (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full"
      style={{ background: '#00C9A7' }}
    >
      <Check size={16} strokeWidth={3} color="#fff" />
    </span>
  ) : (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full"
      style={{ background: '#F25C54' }}
    >
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
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.08 }}
        >
          {/* Table */}
          <div className="relative">

            {/* Zirva column highlight — full-height outline */}
            <div
              className="absolute rounded-2xl pointer-events-none"
              style={{
                left: 'calc(25% + 8px)',
                width: 'calc(25% - 0px)',
                top: 0,
                bottom: 0,
                border: '2px solid rgba(123,110,246,0.4)',
                background: 'rgba(123,110,246,0.03)',
                zIndex: 1,
              }}
            />

            {/* Header row */}
            <div className="grid grid-cols-4 mb-2">
              <div />
              {/* Zirva */}
              <div className="relative z-10 flex flex-col items-center gap-2 py-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-white text-sm"
                  style={{ background: 'linear-gradient(135deg,#7B6EF6,#9B8FF8)' }}
                >
                  Z
                </div>
                <span className="text-xs font-bold" style={{ color: '#7B6EF6' }}>Zirva</span>
              </div>
              {/* Agency */}
              <div className="flex flex-col items-center justify-center py-5">
                <span className="text-sm font-bold" style={{ color: '#0D0D1A' }}>Agentlik</span>
              </div>
              {/* DIY */}
              <div className="flex flex-col items-center justify-center py-5">
                <span className="text-sm font-bold" style={{ color: '#0D0D1A' }}>Öz-Özünə</span>
              </div>
            </div>

            {/* Feature rows */}
            {ROWS.map((row, i) => (
              <div
                key={row.label}
                className="grid grid-cols-4 items-center"
                style={{
                  borderTop: '1px solid rgba(13,13,26,0.06)',
                  paddingTop: 14,
                  paddingBottom: 14,
                }}
              >
                {/* Label */}
                <div className="pr-4">
                  <span className="text-sm" style={{ color: i === 0 ? '#7B6EF6' : '#3D4060', fontWeight: i === 0 ? 600 : 400 }}>
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

            {/* CTA row */}
            <div
              className="grid grid-cols-4 items-center pt-5"
              style={{ borderTop: '1px solid rgba(13,13,26,0.06)' }}
            >
              <div />
              <div className="relative z-10 flex justify-center px-2">
                <Link
                  href="/signup"
                  className="w-full text-center py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:scale-[1.03]"
                  style={{ background: 'linear-gradient(135deg,#7B6EF6,#9B8FF8)' }}
                >
                  Başla
                </Link>
              </div>
              <div className="flex justify-center">
                <span className="text-xs font-medium" style={{ color: '#9B9EBB' }}>Min. 500 AZN/ay</span>
              </div>
              <div className="flex justify-center">
                <span className="text-xs font-medium" style={{ color: '#9B9EBB' }}>Vaxt + Bilik</span>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
