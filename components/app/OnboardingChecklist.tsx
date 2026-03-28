'use client'

import Link from 'next/link'
import { CheckCircle, Circle, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  hasBrand: boolean
  hasGeneration: boolean
  autopilotEnabled: boolean
}

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 28 }

export default function OnboardingChecklist({ hasBrand, hasGeneration, autopilotEnabled }: Props) {
  const steps = [
    {
      id: 'brand',
      label: 'Brend profili yarat',
      desc: 'Saytın, sosial media və kateqoriyanı əlavə et',
      href: '/brands',
      done: hasBrand,
    },
    {
      id: 'generate',
      label: 'İlk SEO paketini yarat',
      desc: 'Google üçün optimallaşdırılmış teqlər, açar sözlər al',
      href: '/generate',
      done: hasGeneration,
    },
    {
      id: 'autopilot',
      label: 'Avtopilotu aktiv et',
      desc: 'Həftəlik SEO + SMO hesabatları avtomatik gəlsin',
      href: '/autopilot',
      done: autopilotEnabled,
    },
  ]

  const doneCount = steps.filter(s => s.done).length
  if (doneCount === steps.length) return null

  const remaining = steps.length - doneCount
  const pct = Math.round((doneCount / steps.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={SPRING}
      className="rounded-2xl p-5 sm:p-6 mb-6 sm:mb-8 relative overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(123,110,246,0.16)',
        boxShadow: '0 2px 16px rgba(123,110,246,0.06)',
      }}
    >
      {/* Background glow */}
      <div className="absolute right-0 top-0 w-40 h-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(123,110,246,0.06) 0%, transparent 70%)', transform: 'translate(20%, -20%)' }} />

      <div className="flex items-start justify-between gap-4 mb-5 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Zap size={14} strokeWidth={2.5} style={{ color: '#7B6EF6' }} />
            <h3 className="font-bold text-base" style={{ color: '#0D0D1A' }}>
              {remaining === 1 ? 'Son bir addım qaldı!' : `${remaining} addım qaldı`}
            </h3>
          </div>
          <p className="text-xs" style={{ color: '#9B9EBB' }}>Zirva-nı tam gücüylə istifadə et</p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-sm font-bold" style={{ color: '#7B6EF6' }}>{pct}%</span>
          <div className="h-2 w-24 rounded-full mt-1.5 overflow-hidden" style={{ background: 'rgba(123,110,246,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7B6EF6, #9B8FF8)' }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2 relative z-10">
        {steps.map((step, i) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...SPRING, delay: i * 0.06 }}
          >
            {step.done ? (
              <div
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(0,201,167,0.04)', border: '1px solid rgba(0,201,167,0.12)' }}
              >
                <CheckCircle size={17} strokeWidth={2} style={{ color: '#00C9A7', flexShrink: 0 }} />
                <p className="text-sm font-medium line-through" style={{ color: '#B0B3CC' }}>{step.label}</p>
              </div>
            ) : (
              <Link
                href={step.href}
                className="flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-sm group"
                style={{
                  background: 'rgba(123,110,246,0.04)',
                  border: '1px solid rgba(123,110,246,0.12)',
                }}
              >
                <Circle size={17} strokeWidth={1.8} style={{ color: '#C0C3D8', flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ color: '#0D0D1A' }}>{step.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9B9EBB' }}>{step.desc}</p>
                </div>
                <span
                  className="text-xs font-bold flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: '#7B6EF6' }}
                >
                  Başla →
                </span>
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
