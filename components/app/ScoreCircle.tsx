'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { scoreColor } from '@/lib/utils'
import type { ScoreBreakdown } from '@/types'

interface ScoreCircleProps {
  score: number
  breakdown?: ScoreBreakdown
}

const SIZE = 160
const STROKE = 8
const R = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * R

function useCountUp(target: number, duration: number = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const raf = requestAnimationFrame(function tick(now) {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return count
}

export default function ScoreCircle({ score, breakdown }: ScoreCircleProps) {
  const count = useCountUp(score)
  const color = scoreColor(score)
  const [offset, setOffset] = useState(CIRCUMFERENCE)

  useEffect(() => {
    const t = setTimeout(() => {
      setOffset(CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE)
    }, 100)
    return () => clearTimeout(t)
  }, [score])

  const breakdownItems = breakdown
    ? [
        { label: 'Başlıq keyfiyyəti', value: breakdown.title_quality, max: 20 },
        { label: 'Meta keyfiyyəti', value: breakdown.meta_quality, max: 20 },
        { label: 'Schema mövcudluğu', value: breakdown.schema_present, max: 20 },
        { label: 'Hreflang düzgünlüyü', value: breakdown.hreflang_correct, max: 20 },
        { label: 'Lokal optimallaşdırma', value: breakdown.local_optimization, max: 20 },
      ]
    : []

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      {/* Circle */}
      <div className="relative flex-shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg width={SIZE} height={SIZE}>
          {/* Background circle */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke="#F0EEFF"
            strokeWidth={STROKE}
          />
          {/* Score arc */}
          <motion.circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={R}
            fill="none"
            stroke={color}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </svg>
        {/* Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-bold text-3xl" style={{ color }}>
            {count}
          </span>
          <span className="text-text-muted text-xs">/100</span>
        </div>
      </div>

      {/* Breakdown bars */}
      {breakdown && (
        <div className="flex-1 w-full space-y-3">
          {breakdownItems.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25, delay: i * 0.1 }}
            >
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">{item.label}</span>
                <span className="font-mono" style={{ color: scoreColor((item.value / item.max) * 100) }}>
                  {item.value}/{item.max}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(123,110,246,0.1)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: scoreColor((item.value / item.max) * 100) }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${(item.value / item.max) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.1 + 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
