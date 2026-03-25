'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface UsageBarProps {
  used: number
  limit: number
}

export default function UsageBar({ used, limit }: UsageBarProps) {
  const [width, setWidth] = useState(0)
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100)
    return () => clearTimeout(t)
  }, [pct])

  const color = pct >= 90 ? '#F25C54' : pct >= 70 ? '#F5A623' : '#00C9A7'

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-text-secondary">Bu ay istifadə</span>
        <span className="font-mono font-medium" style={{ color }}>
          {used} / {limit === 999999 ? '∞' : limit}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(123,110,246,0.1)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: '0%' }}
          animate={{ width: `${width}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
        />
      </div>
    </div>
  )
}
