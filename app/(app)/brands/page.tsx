'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Globe, Pencil, Trash2, Loader2 } from 'lucide-react'
import BrandModal from '@/components/app/BrandModal'
import BrandAvatar from '@/components/app/BrandAvatar'
import ConfirmModal from '@/components/shared/ConfirmModal'
import { ToastContainer } from '@/components/shared/Toast'
import type { Brand } from '@/types'
import { BRAND_LIMITS } from '@/types'

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 26 }

interface ToastItem { id: string; message: string; type?: 'success' | 'error' | 'info' }

export default function BrandsPage() {
  const [brands, setBrands]     = useState<Brand[]>([])
  const [loading, setLoading]   = useState(true)
  const [plan, setPlan]         = useState<'free' | 'pro' | 'agency'>('free')
  const [modalOpen, setModalOpen]   = useState(false)
  const [editing, setEditing]       = useState<Brand | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmId, setConfirmId]   = useState<string | null>(null)
  const [toasts, setToasts]         = useState<ToastItem[]>([])

  const brandLimit = BRAND_LIMITS[plan]
  const atLimit    = brands.length >= brandLimit

  function addToast(message: string, type: ToastItem['type'] = 'success') {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
  }

  async function load() {
    const res = await fetch('/api/brands')
    if (res.ok) {
      const data = await res.json()
      setBrands(data.brands ?? [])
      if (data.plan) setPlan(data.plan)
    } else {
      addToast('Brendlər yüklənmədi', 'error')
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete() {
    if (!confirmId) return
    setDeletingId(confirmId)
    const res = await fetch(`/api/brands?id=${confirmId}`, { method: 'DELETE' })
    if (res.ok) {
      setBrands(b => b.filter(x => x.id !== confirmId))
      addToast('Brend silindi')
    } else {
      addToast('Silmə zamanı xəta baş verdi', 'error')
    }
    setDeletingId(null)
    setConfirmId(null)
  }

  function openCreate() { setEditing(null); setModalOpen(true) }
  function openEdit(b: Brand) { setEditing(b); setModalOpen(true) }
  function onSaved(b: Brand) {
    setBrands(prev => {
      const idx = prev.findIndex(x => x.id === b.id)
      if (idx >= 0) {
        const next = [...prev]; next[idx] = b
        addToast('Brend yeniləndi')
        return next
      }
      addToast('Brend yaradıldı')
      return [b, ...prev]
    })
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={id => setToasts(p => p.filter(t => t.id !== id))} />
      <ConfirmModal
        open={!!confirmId}
        title="Brendi sil"
        message="Bu brend və ona aid bütün məlumatlar silinəcək. Bu əməliyyat geri qaytarıla bilməz."
        confirmLabel="Sil"
        loading={!!deletingId}
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
      <BrandModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={onSaved} initial={editing} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-text-primary mb-1">Brendlər</h1>
            <p className="text-text-muted text-sm">
              {loading ? 'Saytlarınız üçün brend profilləri yaradın' : `${brands.length} / ${brandLimit} brend`}
            </p>
          </div>
          <button onClick={atLimit ? undefined : openCreate}
            disabled={atLimit}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: atLimit ? '#9B9EBB' : 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: atLimit ? 'none' : '0 4px 16px rgba(123,110,246,0.3)' }}
            title={atLimit ? `Brend limiti dolub (${brandLimit}/${brandLimit})` : undefined}
          >
            <Plus size={16} strokeWidth={2.5} /> <span className="hidden sm:inline">Yeni </span>Brend
          </button>
        </div>

        {/* Limit reached banner */}
        {atLimit && !loading && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{ background: 'rgba(242,92,84,0.07)', border: '1px solid rgba(242,92,84,0.18)', color: '#B03030' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span><strong>Brend limitinə çatdınız</strong> ({brandLimit}/{brandLimit}). Daha çox brend üçün planı yüksəldin.</span>
            <a href="/settings/billing" className="ml-auto font-bold text-xs px-3 py-1.5 rounded-lg text-white flex-shrink-0"
              style={{ background: '#7B6EF6' }}>
              Yüksəlt
            </a>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          </div>
        ) : brands.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={SPRING}
            className="flex flex-col items-center justify-center py-24 rounded-2xl border text-center"
            style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.12)', borderStyle: 'dashed' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(123,110,246,0.08)' }}>
              <Globe size={28} strokeWidth={1.5} style={{ color: '#7B6EF6' }} />
            </div>
            <h3 className="font-bold text-text-primary mb-2">Hələ brend yoxdur</h3>
            <p className="text-text-muted text-sm mb-6 max-w-xs">Saytınız üçün brend profili yaradın — sayt URL-i, sosial media və kateqoriya əlavə edin.</p>
            <button onClick={openCreate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
              style={{ background: '#7B6EF6' }}
            >
              <Plus size={15} strokeWidth={2.5} /> İlk Brendi Yarat
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {brands.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING, delay: i * 0.04 }}
                className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border bg-white transition-all hover:shadow-sm"
                style={{ borderColor: 'rgba(123,110,246,0.12)' }}
              >
                <BrandAvatar brand={b} size={48} />

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-text-primary truncate">{b.name}</div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    {b.website_url && (
                      <a href={b.website_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors">
                        <Globe size={11} strokeWidth={1.8} /> {b.website_url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                    {b.instagram_url && (
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> Instagram
                      </span>
                    )}
                    {b.tiktok_url && (
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/></svg>
                        TikTok
                      </span>
                    )}
                    {b.facebook_url && (
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> Facebook
                      </span>
                    )}
                    {b.category && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(123,110,246,0.08)', color: '#7B6EF6' }}>{b.category}</span>}
                    {b.city && <span className="text-xs text-text-muted">{b.city}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(b)}
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all hover:bg-gray-100"
                    title="Redaktə et">
                    <Pencil size={14} strokeWidth={1.8} style={{ color: '#9B9EBB' }} />
                  </button>
                  <button onClick={() => setConfirmId(b.id)}
                    className="w-10 h-10 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-50"
                    title="Sil">
                    <Trash2 size={14} strokeWidth={1.8} style={{ color: '#F25C54' }} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
