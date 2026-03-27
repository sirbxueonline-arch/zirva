'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { scoreColor, flowLabel, flowBadgeColor, timeAgo } from '@/lib/utils'
import type { Generation } from '@/types'
import { FileText, Plus, Trash2, ChevronRight, Sparkles } from 'lucide-react'

function resultHref(gen: Generation) {
  return `/result/${gen.id}`
}

interface HistoryTableProps {
  generations: Generation[]
  onDelete?: (id: string) => void
}

export default function HistoryTable({ generations, onDelete }: HistoryTableProps) {

  /* #25 — designed empty state, not just blank space */
  if (generations.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-24 rounded-2xl border text-center"
        style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', borderStyle: 'dashed' }}
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'rgba(123,110,246,0.07)', border: '1px solid rgba(123,110,246,0.12)' }}>
          <FileText size={24} strokeWidth={1.5} style={{ color: '#7B6EF6' }} />
        </div>
        {/* #3 — bold heading, muted supporting text */}
        <h3 className="font-semibold text-text-primary text-base mb-2">Hələ heç bir paket yoxdur</h3>
        {/* #26 — tells user what to do next */}
        <p className="text-text-muted text-sm mb-6 leading-relaxed" style={{ maxWidth: '30ch' }}>
          İlk SEO paketinizi yaradın — dəqiqələr içində hazır olacaq.
        </p>
        <Link
          href="/generate"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
          style={{ background: '#7B6EF6', boxShadow: '0 4px 14px rgba(123,110,246,0.25)' }}
        >
          <Plus size={15} strokeWidth={2.5} />
          İlk paketi yarat
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="space-y-2">
      {generations.map((gen, i) => (
        <motion.div
          key={gen.id}
          className="rounded-xl border flex items-center gap-3 group"
          style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.1)', transition: 'all 200ms ease' }}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          /* #29 — stagger capped so list doesn't feel slow */
          transition={{ type: 'spring', stiffness: 320, damping: 28, delay: Math.min(i * 0.04, 0.24) }}
          /* #16 — unmistakable hover state */
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#F5F3FF'
            el.style.borderColor = 'rgba(123,110,246,0.2)'
            el.style.boxShadow = '0 2px 12px rgba(123,110,246,0.07)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLElement
            el.style.background = '#FFFFFF'
            el.style.borderColor = 'rgba(123,110,246,0.1)'
            el.style.boxShadow = 'none'
          }}
        >
          {/* Main clickable area */}
          <Link href={resultHref(gen)} className="flex items-center gap-3 flex-1 min-w-0 px-4 py-3.5">
            {/* Tool / flow badge */}
            {gen.tool === 'smo' ? (
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap"
                style={{ background: 'rgba(0,201,167,0.1)', color: '#00C9A7', border: '1px solid rgba(0,201,167,0.2)' }}>
                <Sparkles size={10} strokeWidth={2} /> SMO
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap"
                style={{
                  background: `${flowBadgeColor(gen.flow_type)}18`,
                  color:      flowBadgeColor(gen.flow_type),
                  border:     `1px solid ${flowBadgeColor(gen.flow_type)}30`,
                }}>
                {flowLabel(gen.flow_type)}
              </span>
            )}

            {/* #3 — strong/muted weight contrast */}
            <div className="flex-1 min-w-0">
              <div className="text-text-primary text-sm font-semibold truncate leading-snug">
                {gen.business_name || gen.title_tag_az || 'Adsız paket'}
              </div>
              <div className="text-text-muted text-xs mt-0.5 truncate">
                {gen.title_tag_az || '—'}
              </div>
            </div>

            {/* #12 — score colour = quality signal */}
            {gen.seo_score !== null && (
              <span className="text-xs font-mono font-bold flex-shrink-0 tabular-nums"
                style={{ color: scoreColor(gen.seo_score) }}>
                {gen.seo_score}/100
              </span>
            )}

            <span className="text-text-muted text-xs flex-shrink-0 hidden sm:block tabular-nums">
              {timeAgo(gen.created_at)}
            </span>

            {/* #16 — chevron signals this row is navigable */}
            <ChevronRight size={14} strokeWidth={2} className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              style={{ color: '#C0C3D8' }} />
          </Link>

          {/* Delete — isolated so it can't be accidentally triggered by row click */}
          {onDelete && (
            <button
              onClick={e => {
                e.stopPropagation()
                if (confirm('Bu paketi silmək istədiyinizə əminsiniz?')) onDelete(gen.id)
              }}
              aria-label="Sil"
              className="flex-shrink-0 mr-3 p-2 rounded-lg transition-all duration-150"
              style={{ color: '#C0C3D8' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#F25C54'; e.currentTarget.style.background = 'rgba(242,92,84,0.07)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#C0C3D8'; e.currentTarget.style.background = 'transparent' }}
            >
              <Trash2 size={14} strokeWidth={1.8} />
            </button>
          )}
        </motion.div>
      ))}
    </div>
  )
}
