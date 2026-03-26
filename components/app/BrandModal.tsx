'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Loader2, Sparkles, CheckCircle2 } from 'lucide-react'
import type { Brand } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  onSaved: (brand: Brand) => void
  initial?: Brand | null
}

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 28 }

const inputCls = 'w-full rounded-xl px-4 py-3 text-sm outline-none transition-all'
const inputStyle = { background: '#F8F8FF', border: '1px solid rgba(123,110,246,0.15)', color: '#0D0D1A' }

function extractHandle(url: string | null | undefined, base: string): string {
  if (!url) return ''
  return url
    .replace(/^https?:\/\/(www\.)?/, '')
    .replace(base + '/', '')
    .replace(/^@/, '')
    .split('?')[0]
    .trim()
}

export default function BrandModal({ open, onClose, onSaved, initial }: Props) {
  const [form, setForm] = useState({
    name:          initial?.name        ?? '',
    website_url:   initial?.website_url ?? '',
    instagram:     extractHandle(initial?.instagram_url, 'instagram.com'),
    tiktok:        extractHandle(initial?.tiktok_url,    'tiktok.com'),
    facebook:      extractHandle(initial?.facebook_url,  'facebook.com'),
    category:      initial?.category    ?? '',
    city:          initial?.city        ?? '',
    description:   initial?.description ?? '',
  })
  const [saving,    setSaving]   = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzed,  setAnalyzed]  = useState(!!initial)
  const [error,     setError]     = useState('')

  function set(key: string, val: string) {
    setForm(f => ({ ...f, [key]: val }))
    if (['name', 'website_url', 'instagram', 'tiktok', 'facebook'].includes(key)) setAnalyzed(false)
  }

  async function handleAnalyze() {
    if (!form.website_url && !form.name.trim()) {
      setError('Analiz üçün ən azı brend adı daxil edin')
      return
    }
    setAnalyzing(true)
    setError('')
    try {
      const res = await fetch('/api/brands/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ website_url: form.website_url, name: form.name }),
      })
      if (res.ok) {
        const data = await res.json()
        setForm(f => ({
          ...f,
          category:    data.category    || f.category,
          city:        data.city        || f.city,
          description: data.description || f.description,
        }))
        setAnalyzed(true)
      }
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Brend adı tələb olunur'); return }
    setSaving(true); setError('')
    try {
      const payload = {
        name:          form.name,
        website_url:   form.website_url || null,
        instagram_url: form.instagram ? `https://instagram.com/${form.instagram}` : null,
        tiktok_url:    form.tiktok    ? `https://tiktok.com/@${form.tiktok}`      : null,
        facebook_url:  form.facebook  ? `https://facebook.com/${form.facebook}`   : null,
        category:      form.category  || null,
        city:          form.city      || null,
        description:   form.description || null,
      }
      const method = initial ? 'PUT' : 'POST'
      const body   = initial ? { ...payload, id: initial.id } : payload
      const res    = await fetch('/api/brands', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data   = await res.json()
      if (!res.ok) { setError(data.error || 'Xəta baş verdi'); return }
      onSaved(data.brand)
      onClose()
    } finally { setSaving(false) }
  }

  const hasUrls = form.website_url || form.instagram || form.tiktok || form.facebook

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(13,13,26,0.45)', backdropFilter: 'blur(4px)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <motion.div className="w-full max-w-lg rounded-3xl overflow-hidden"
            style={{ background: '#FFFFFF', boxShadow: '0 24px 80px rgba(13,13,26,0.2)' }}
            initial={{ scale: 0.95, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }} transition={SPRING}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b" style={{ borderColor: 'rgba(123,110,246,0.1)' }}>
              <h2 className="font-display font-bold text-xl text-text-primary">{initial ? 'Brendi Redaktə Et' : 'Yeni Brend'}</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100">
                <X size={16} strokeWidth={2} style={{ color: '#9B9EBB' }} />
              </button>
            </div>

            {/* Form */}
            <div className="px-7 py-6 space-y-4 max-h-[70vh] overflow-y-auto">

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>Brend Adı *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Məs: Archilink, Prime Rent a Car"
                  className={inputCls} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
              </div>

              {/* Website */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>Sayt URL-i</label>
                <div className="relative">
                  <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#9B9EBB' }} />
                  <input value={form.website_url} onChange={e => set('website_url', e.target.value)} placeholder="https://saytiniz.az"
                    className={inputCls + ' pl-9'} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                    onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
                </div>
              </div>

              {/* Social media */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>Sosial Media</label>
                <div className="space-y-2">
                  {/* Instagram */}
                  <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(123,110,246,0.15)' }}>
                    <div className="flex items-center gap-2 px-3 flex-shrink-0" style={{ background: '#F0F0FF', borderRight: '1px solid rgba(123,110,246,0.12)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none"/></svg>
                      <span className="text-xs font-medium" style={{ color: '#9B9EBB' }}>instagram.com/</span>
                    </div>
                    <input value={form.instagram} onChange={e => set('instagram', e.target.value.replace(/^@/, ''))}
                      placeholder="brandname" className="flex-1 px-3 py-3 text-sm outline-none" style={{ background: '#F8F8FF', color: '#0D0D1A' }} />
                  </div>
                  {/* TikTok */}
                  <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(123,110,246,0.15)' }}>
                    <div className="flex items-center gap-2 px-3 flex-shrink-0" style={{ background: '#F0F0FF', borderRight: '1px solid rgba(123,110,246,0.12)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#000"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/></svg>
                      <span className="text-xs font-medium" style={{ color: '#9B9EBB' }}>tiktok.com/@</span>
                    </div>
                    <input value={form.tiktok} onChange={e => set('tiktok', e.target.value.replace(/^@/, ''))}
                      placeholder="brandname" className="flex-1 px-3 py-3 text-sm outline-none" style={{ background: '#F8F8FF', color: '#0D0D1A' }} />
                  </div>
                  {/* Facebook */}
                  <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(123,110,246,0.15)' }}>
                    <div className="flex items-center gap-2 px-3 flex-shrink-0" style={{ background: '#F0F0FF', borderRight: '1px solid rgba(123,110,246,0.12)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      <span className="text-xs font-medium" style={{ color: '#9B9EBB' }}>facebook.com/</span>
                    </div>
                    <input value={form.facebook} onChange={e => set('facebook', e.target.value.replace(/^@/, ''))}
                      placeholder="brandname" className="flex-1 px-3 py-3 text-sm outline-none" style={{ background: '#F8F8FF', color: '#0D0D1A' }} />
                  </div>
                </div>
              </div>

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={analyzing || (!form.name.trim() && !hasUrls)}
                className="w-full rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
                style={analyzed
                  ? { background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', color: '#16a34a' }
                  : { background: 'rgba(123,110,246,0.07)', border: '1px solid rgba(123,110,246,0.2)', color: '#7B6EF6' }
                }
              >
                {analyzing ? (
                  <><Loader2 size={14} className="animate-spin" /> Analiz edilir...</>
                ) : analyzed ? (
                  <><CheckCircle2 size={14} /> Analiz tamamlandı — yenidən analiz et</>
                ) : (
                  <><Sparkles size={14} /> AI ilə avtomatik analiz et</>
                )}
              </button>

              {/* Auto-filled fields — always visible but highlighted after analysis */}
              <AnimatePresence>
                {(analyzed || form.category || form.city || form.description) && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 rounded-2xl p-4"
                    style={{ background: 'rgba(123,110,246,0.04)', border: '1px solid rgba(123,110,246,0.1)' }}
                  >
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#9B9EBB' }}>
                      AI tərəfindən dolduruldu — düzəldə bilərsiniz
                    </p>

                    {/* Category + City */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9B9EBB' }}>Kateqoriya</label>
                        <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                          placeholder="Məs: Restoran, Hüquq"
                          className={inputCls} style={inputStyle}
                          onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                          onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9B9EBB' }}>Şəhər</label>
                        <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                          placeholder="Məs: Bakı, İstanbul"
                          className={inputCls} style={inputStyle}
                          onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                          onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: '#9B9EBB' }}>Qısa Açıqlama</label>
                      <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        placeholder="Bizneslə bağlı əlavə məlumat..." rows={3}
                        className={inputCls + ' resize-none'} style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                        onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            {/* Footer */}
            <div className="px-7 py-4 border-t flex justify-end gap-3" style={{ borderColor: 'rgba(123,110,246,0.1)' }}>
              <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:bg-gray-50 transition-all">
                Ləğv et
              </button>
              <button onClick={handleSave} disabled={saving}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center gap-2"
                style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 4px 16px rgba(123,110,246,0.35)' }}
              >
                {saving ? <><Loader2 size={14} className="animate-spin" /> Saxlanır...</> : (initial ? 'Yadda Saxla' : 'Brend Yarat')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
