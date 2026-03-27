'use client'

import { motion } from 'framer-motion'

interface Props {
  used:  number
  limit: number
}

export default function CreditBar({ used, limit }: Props) {
  const pct       = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const color = pct >= 95 ? '#F25C54' : pct >= 80 ? '#F5A623' : '#00C9A7'

  return (
    <div>
      <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(0,201,167,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20, delay: 0.15 }}
        />
      </div>
    </div>
  )
}
