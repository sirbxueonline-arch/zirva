'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X, Building2, User } from 'lucide-react'
import Image from 'next/image'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }
const GRID = { gridTemplateColumns: '2fr 1fr 1fr 1fr' }

const ROWS = [
  { label: 'Saniyələr içində hazır',   zirva: true,  agency: false, diy: false },
  { label: 'Yüksək SEO balı',          zirva: true,  agency: true,  diy: false },
{ label: 'Asan quraşdırma',          zirva: true,  agency: false, diy: false },
  { label: 'Çoxdilli dəstək',          zirva: true,  agency: false, diy: false },
  { label: 'Sərfəli qiymət',           zirva: true,  agency: false, diy: false },
]

function Tick({ yes }: { yes: boolean }) {
  return (
    <span
      className="inline-flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0"
      style={{ background: yes ? '#22C55E' : '#F87171' }}
    >
      {yes
        ? <Check size={18} strokeWidth={3} color="#fff" />
        : <X size={18} strokeWidth={3} color="#fff" />
      }
    </span>
  )
}

export default function PlanComparison() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24" style={{ background: '#FFFFFF' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING }}
        >
          <h2 className="font-display font-extrabold text-4xl md:text-5xl mb-4" style={{ color: '#0D0D1A' }}>
            Niyə Zirva?
          </h2>
          <p className="text-lg" style={{ color: '#9CA3AF' }}>
            Bir alətlə hər şeyi həll edin. Sadəcə Zirva.
          </p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.08 }}
        >
          {/* Zirva column card overlay */}
          <div
            className="absolute pointer-events-none"
            style={{
              left: '40%',
              width: '20%',
              top: 0,
              bottom: 0,
              borderRadius: 20,
              border: '1.5px solid rgba(123,110,246,0.28)',
              background: 'rgba(123,110,246,0.04)',
            }}
          />

          {/* Header row */}
          <div className="relative grid items-end pb-4" style={GRID}>
            <div />

            {/* Zirva */}
            <div className="relative z-10 flex flex-col items-center gap-2 pt-8 pb-1">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  boxShadow: '0 4px 14px rgba(123,110,246,0.2)',
                  border: '1px solid rgba(123,110,246,0.15)',
                }}
              >
                <Image src="/zirva-icon.png" alt="Zirva" width={36} height={36} style={{ objectFit: 'contain' }} />
              </div>
              <span className="font-bold text-sm" style={{ color: '#7B6EF6' }}>Zirva</span>
            </div>

            {/* Agency */}
            <div className="flex flex-col items-center gap-2 pt-8 pb-1">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: '#F3F4F6' }}
              >
                <Building2 size={20} strokeWidth={2} color="#9CA3AF" />
              </div>
              <span className="font-bold text-sm" style={{ color: '#6B7280' }}>Agentlik</span>
            </div>

            {/* DIY */}
            <div className="flex flex-col items-center gap-2 pt-8 pb-1">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: '#F3F4F6' }}
              >
                <User size={20} strokeWidth={2} color="#9CA3AF" />
              </div>
              <span className="font-bold text-sm" style={{ color: '#6B7280' }}>Öz-Özünə</span>
            </div>
          </div>

          {/* Feature rows */}
          {ROWS.map((row, i) => (
            <motion.div
              key={row.label}
              className="relative grid items-center py-5"
              style={{ ...GRID, borderTop: '1px solid #F3F4F6' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ ...SPRING, delay: 0.14 + i * 0.06 }}
            >
              <span className="text-sm md:text-base pr-6" style={{ color: '#374151' }}>
                {row.label}
              </span>
              <div className="relative z-10 flex justify-center">
                <Tick yes={row.zirva} />
              </div>
              <div className="flex justify-center">
                <Tick yes={row.agency} />
              </div>
              <div className="flex justify-center">
                <Tick yes={row.diy} />
              </div>
            </motion.div>
          ))}

          {/* Bottom border to close the card visually */}
          <div style={{ borderTop: '1px solid #F3F4F6' }} />
        </motion.div>

      </div>
    </section>
  )
}
