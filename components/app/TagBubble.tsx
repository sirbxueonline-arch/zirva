'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { charCountClass } from '@/lib/utils'
import { Check, Copy } from 'lucide-react'

interface TagBubbleProps {
  label: string
  value: string
  charMin?: number
  charMax?: number
}

export default function TagBubble({ label, value, charMin, charMax }: TagBubbleProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const charClass = charMin && charMax ? charCountClass(value.length, charMin, charMax) : ''

  return (
    <div
      className="rounded-xl border p-4"
      style={{ background: '#F5F5FF', borderColor: 'rgba(123,110,246,0.15)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-muted text-xs uppercase tracking-wider font-medium">
          {label}
        </span>
        <div className="flex items-center gap-3">
          {charMin && charMax && (
            <span className={`text-xs font-mono ${charClass}`}>
              {value.length} / {charMax}
            </span>
          )}
          <motion.button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-lg transition-all duration-200"
            style={{
              background: copied ? 'rgba(0,201,167,0.12)' : 'rgba(123,110,246,0.1)',
              border: `1px solid ${copied ? 'rgba(0,201,167,0.3)' : 'rgba(123,110,246,0.2)'}`,
              color: copied ? '#00C9A7' : '#7B6EF6',
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Kopyala"
          >
            {copied
              ? <><Check size={12} strokeWidth={2.5} /> Kopyalandı</>
              : <><Copy size={12} strokeWidth={2} /> Kopyala</>
            }
          </motion.button>
        </div>
      </div>
      <p className="text-text-primary text-sm leading-relaxed font-body">{value}</p>
    </div>
  )
}
