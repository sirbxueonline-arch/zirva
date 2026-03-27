'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import HistoryTable from '@/components/app/HistoryTable'
import { SkeletonTable } from '@/components/shared/SkeletonCard'
import { ToastContainer } from '@/components/shared/Toast'
import type { Generation } from '@/types'
import { Globe, Smartphone, PenLine, Sparkles, ChevronLeft, ChevronRight, Download, Loader2, FileText } from 'lucide-react'

const FLOW_FILTERS = [
  { id: 'all',    label: 'Hamısı',  Icon: null },
  { id: 'url',    label: 'URL',     Icon: Globe },
  { id: 'social', label: 'Sosial',  Icon: Smartphone },
  { id: 'manual', label: 'Manual',  Icon: PenLine },
]

const PAGE_SIZE = 20

interface ToastItem { id: string; message: string; type?: 'success' | 'error' | 'info' }

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading]   = useState(true)
  const [flowFilter, setFlowFilter] = useState('all')
  const [page, setPage]         = useState(0)
  const [hasMore, setHasMore]   = useState(false)
  const [toasts, setToasts]     = useState<ToastItem[]>([])
  const supabase = createClient()

  function addToast(message: string, type: ToastItem['type'] = 'success') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }

  const fetchGenerations = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('generations')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

    if (flowFilter === 'smo') {
      query = query.eq('tool', 'smo')
    } else if (flowFilter !== 'all') {
      query = query.eq('flow_type', flowFilter)
    }

    const { data, count, error } = await query
    if (error) addToast('Tarixçə yüklənmədi', 'error')
    setGenerations(data as Generation[] || [])
    setHasMore((count ?? 0) > (page + 1) * PAGE_SIZE)
    setLoading(false)
  }, [flowFilter, page])

  useEffect(() => {
    fetchGenerations()
  }, [fetchGenerations])

  async function handleDelete(id: string) {
    const { error } = await supabase.from('generations').delete().eq('id', id)
    if (!error) {
      setGenerations(prev => prev.filter(g => g.id !== id))
      addToast('Paket silindi')
    } else {
      addToast('Silmə zamanı xəta baş verdi', 'error')
    }
  }

  function exportCSV() {
    if (generations.length === 0) { addToast('İxrac üçün məlumat yoxdur', 'info'); return }
    const rows = [
      ['ID', 'Biznes adı', 'Axış növü', 'SEO Balı', 'Tarix'],
      ...generations.map(g => [
        g.id, g.business_name || '', g.flow_type,
        g.seo_score?.toString() || '', g.created_at,
      ]),
    ]
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'zirva-history.csv'; a.click()
    URL.revokeObjectURL(url)
    addToast(`${generations.length} qeyd CSV-ə ixrac edildi`)
  }

  return (
    <div className="px-4 sm:px-6 py-6 sm:py-10 max-w-5xl mx-auto">
      <ToastContainer toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))} />

      <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary mb-1">Tarixçə</h1>
          <p className="text-text-muted text-sm">Bütün generasiyalarınız</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-1.5 text-sm border px-3 sm:px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-all duration-200 flex-shrink-0"
          style={{ borderColor: 'rgba(123,110,246,0.25)' }}
        >
          <Download size={14} strokeWidth={1.8} />
          <span className="hidden sm:inline">CSV ixrac et</span>
          <span className="sm:hidden">CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FLOW_FILTERS.map(f => {
          const isActive = flowFilter === f.id
          return (
            <button
              key={f.id}
              onClick={() => { setFlowFilter(f.id); setPage(0) }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? 'rgba(123,110,246,0.12)' : 'transparent',
                border: `1px solid ${isActive ? '#7B6EF6' : 'rgba(123,110,246,0.15)'}`,
                color: isActive ? '#7B6EF6' : '#5A5D7A',
              }}
            >
              {f.Icon && (isActive && loading
                ? <Loader2 size={13} strokeWidth={2} className="animate-spin" />
                : <f.Icon size={13} strokeWidth={1.8} />
              )}
              {f.label}
            </button>
          )
        })}

        {/* SMO filter */}
        {(() => {
          const isActive = flowFilter === 'smo'
          return (
            <button
              onClick={() => { setFlowFilter('smo'); setPage(0) }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? 'rgba(0,201,167,0.12)' : 'transparent',
                border: `1px solid ${isActive ? '#00C9A7' : 'rgba(0,201,167,0.2)'}`,
                color: isActive ? '#00C9A7' : '#5A5D7A',
              }}
            >
              {isActive && loading
                ? <Loader2 size={13} strokeWidth={2} className="animate-spin" />
                : <Sparkles size={13} strokeWidth={1.8} />
              }
              SMO
            </button>
          )
        })()}
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={PAGE_SIZE} />
      ) : generations.length === 0 ? (
        <div className="rounded-2xl p-10 sm:p-16 text-center"
          style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.1)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(123,110,246,0.08)' }}>
            <FileText size={24} strokeWidth={1.6} style={{ color: '#7B6EF6' }} />
          </div>
          <h3 className="font-bold text-text-primary mb-1">
            {flowFilter === 'all' ? 'Hələ generasiya yoxdur' : `${flowFilter === 'smo' ? 'SMO' : flowFilter === 'url' ? 'URL' : flowFilter === 'social' ? 'Sosial' : 'Manual'} generasiyası tapılmadı`}
          </h3>
          <p className="text-sm text-text-muted mb-5">
            {flowFilter === 'all' ? 'İlk SEO və ya SMO paketinizi yaradın.' : 'Bu filtrdə hələ heç nə yoxdur.'}
          </p>
          {flowFilter === 'all' && (
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link href="/generate"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: '#7B6EF6', boxShadow: '0 4px 12px rgba(123,110,246,0.25)' }}>
                SEO Paketi Yarat
              </Link>
              <Link href="/smo"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                style={{ background: '#00C9A7', boxShadow: '0 4px 12px rgba(0,201,167,0.25)' }}>
                SMO Paketi Yarat
              </Link>
            </div>
          )}
        </div>
      ) : (
        <HistoryTable generations={generations} onDelete={handleDelete} />
      )}

      {/* Pagination */}
      {(page > 0 || hasMore) && (
        <div className="flex justify-center gap-3 mt-8">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border transition-all disabled:opacity-40"
            style={{ borderColor: 'rgba(123,110,246,0.25)', color: '#0D0D1A' }}
          >
            <ChevronLeft size={15} /> Əvvəlki
          </button>
          <span className="flex items-center px-4 text-text-secondary text-sm">
            Səhifə {page + 1}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border transition-all disabled:opacity-40"
            style={{ borderColor: 'rgba(123,110,246,0.25)', color: '#0D0D1A' }}
          >
            Növbəti <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  )
}
