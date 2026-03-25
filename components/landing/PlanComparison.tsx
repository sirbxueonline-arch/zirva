'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Check, X } from 'lucide-react'
import Link from 'next/link'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

type CellValue = true | false | string

interface Row {
  label: string
  free:   CellValue
  pro:    CellValue
  agency: CellValue
}

const ROWS: Row[] = [
  { label: 'Aylıq SEO + SMO paketi',   free: '5',   pro: '50',  agency: 'Limitsiz' },
  { label: 'Azerbaycanca + Rusca teq', free: true,  pro: true,  agency: true       },
  { label: 'Bütün teq növləri',        free: true,  pro: true,  agency: true       },
  { label: 'URL axışı',                free: true,  pro: true,  agency: true       },
  { label: 'Rəqib analizi',            free: false, pro: true,  agency: true       },
  { label: 'JSON / HTML ixracı',       free: false, pro: true,  agency: true       },
  { label: 'Prioritet dəstək',         free: false, pro: true,  agency: true       },
  { label: 'Çoxlu sayt dəstəyi',       free: false, pro: false, agency: true       },
  { label: 'API girişi',               free: false, pro: false, agency: true       },
  { label: 'Xüsusi hesabat',           free: false, pro: false, agency: true       },
  { label: 'Fərdi onboarding',         free: false, pro: false, agency: true       },
]

function Cell({ value, isPro }: { value: CellValue; isPro?: boolean }) {
  if (value === true)
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: '#00C9A7' }}>
        <Check size={11} strokeWidth={3} color="#fff" />
      </span>
    )
  if (value === false)
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full" style={{ background: '#F25C54' }}>
        <X size={11} strokeWidth={3} color="#fff" />
      </span>
    )
  return (
    <span
      className="inline-block text-xs font-bold px-2 py-0.5 rounded-md"
      style={{
        background: isPro ? 'rgba(123,110,246,0.12)' : 'rgba(13,13,26,0.06)',
        color: isPro ? '#7B6EF6' : '#0D0D1A',
      }}
    >
      {value}
    </span>
  )
}

export default function PlanComparison() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-16" style={{ background: '#FFFFFF' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING }}
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-1.5" style={{ color: '#0D0D1A' }}>
            Planları müqayisə et
          </h2>
          <p className="text-sm" style={{ color: '#737599' }}>
            Sizin üçün ən uyğun planı seçin
          </p>
        </motion.div>

        <motion.div
          className="rounded-xl overflow-hidden"
          style={{ border: '1.5px solid rgba(123,110,246,0.12)', boxShadow: '0 6px 28px rgba(13,13,26,0.06)' }}
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.08 }}
        >
          {/* Header */}
          <div
            className="grid grid-cols-4 text-center"
            style={{ background: '#F5F5FF', borderBottom: '1.5px solid rgba(123,110,246,0.1)' }}
          >
            <div className="py-3 px-3" />

            {/* Free */}
            <div className="py-3 px-3 border-l" style={{ borderColor: 'rgba(123,110,246,0.1)' }}>
              <p className="font-display font-bold text-sm" style={{ color: '#0D0D1A' }}>Pulsuz</p>
              <p className="text-xs" style={{ color: '#737599' }}>0 AZN/ay</p>
            </div>

            {/* Pro */}
            <div
              className="py-3 px-3 border-l border-r relative"
              style={{ background: 'linear-gradient(160deg,#7B6EF6,#9B8FF8)', borderColor: 'rgba(123,110,246,0.2)' }}
            >
              <div
                className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
                style={{ background: '#0D0D1A', color: '#fff' }}
              >
                Populyar
              </div>
              <p className="font-display font-bold text-sm text-white">Pro</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>79 AZN/ay</p>
            </div>

            {/* Agency */}
            <div className="py-3 px-3 border-l" style={{ borderColor: 'rgba(123,110,246,0.1)' }}>
              <p className="font-display font-bold text-sm" style={{ color: '#0D0D1A' }}>Agency</p>
              <p className="text-xs" style={{ color: '#737599' }}>199 AZN/ay</p>
            </div>
          </div>

          {/* Rows */}
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              className="grid grid-cols-4 text-center items-center"
              style={{
                borderBottom: i < ROWS.length - 1 ? '1px solid rgba(123,110,246,0.06)' : 'none',
                background: i % 2 === 0 ? '#FFFFFF' : 'rgba(245,245,255,0.45)',
              }}
            >
              <div className="py-2.5 px-3 text-left">
                <span className="text-xs font-medium" style={{ color: '#3D4060' }}>{row.label}</span>
              </div>

              <div className="py-2.5 px-3 flex justify-center border-l" style={{ borderColor: 'rgba(123,110,246,0.06)' }}>
                <Cell value={row.free} />
              </div>

              <div
                className="py-2.5 px-3 flex justify-center border-l border-r"
                style={{ background: 'rgba(123,110,246,0.04)', borderColor: 'rgba(123,110,246,0.1)' }}
              >
                <Cell value={row.pro} isPro />
              </div>

              <div className="py-2.5 px-3 flex justify-center border-l" style={{ borderColor: 'rgba(123,110,246,0.06)' }}>
                <Cell value={row.agency} />
              </div>
            </div>
          ))}

          {/* CTA footer */}
          <div
            className="grid grid-cols-4 text-center"
            style={{ background: '#F5F5FF', borderTop: '1.5px solid rgba(123,110,246,0.1)' }}
          >
            <div className="py-3 px-3" />

            <div className="py-3 px-3 border-l" style={{ borderColor: 'rgba(123,110,246,0.1)' }}>
              <Link
                href="/signup"
                className="inline-block w-full py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]"
                style={{ border: '1.5px solid rgba(123,110,246,0.3)', color: '#7B6EF6' }}
              >
                Başla
              </Link>
            </div>

            <div
              className="py-3 px-3 border-l border-r"
              style={{ background: 'rgba(123,110,246,0.04)', borderColor: 'rgba(123,110,246,0.12)' }}
            >
              <Link
                href="/signup?plan=pro"
                className="inline-block w-full py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg,#7B6EF6,#9B8FF8)' }}
              >
                Pro-ya Keç
              </Link>
            </div>

            <div className="py-3 px-3 border-l" style={{ borderColor: 'rgba(123,110,246,0.1)' }}>
              <Link
                href="/signup?plan=agency"
                className="inline-block w-full py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]"
                style={{ border: '1.5px solid rgba(123,110,246,0.3)', color: '#7B6EF6' }}
              >
                Agency
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
