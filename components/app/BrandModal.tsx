'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Loader2 } from 'lucide-react'
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

export default function BrandModal({ open, onClose, onSaved, initial }: Props) {
  const [form, setForm] = useState({
    name:          initial?.name          ?? '',
    website_url:   initial?.website_url   ?? '',
    instagram_url: initial?.instagram_url ?? '',
    tiktok_url:    initial?.tiktok_url    ?? '',
    facebook_url:  initial?.facebook_url  ?? '',
    category:      initial?.category      ?? '',
    city:          initial?.city          ?? '',
    description:   initial?.description   ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSave() {
    if (!form.name.trim()) { setError('Brend adı tələb olunur'); return }
    setSaving(true); setError('')
    try {
      const method = initial ? 'PUT' : 'POST'
      const body   = initial ? { ...form, id: initial.id } : form
      const res    = await fetch('/api/brands', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data   = await res.json()
      if (!res.ok) { setError(data.error || 'Xəta baş verdi'); return }
      onSaved(data.brand)
      onClose()
    } finally { setSaving(false) }
  }

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

              {/* Category + City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>Kateqoriya</label>
                  <input value={form.category} onChange={e => set('category', e.target.value)} placeholder="Məs: Restoran, Hüquq"
                    className={inputCls} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                    onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>Şəhər</label>
                  <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="Məs: Bakı, İstanbul"
                    className={inputCls} style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                    onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
                </div>
              </div>

              {/* Social media */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>Sosial Media</label>
                <div className="space-y-2">
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E1306C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#E1306C" stroke="none"/></svg>
                    <input value={form.instagram_url} onChange={e => set('instagram_url', e.target.value)} placeholder="instagram.com/brandname"
                      className={inputCls + ' pl-9'} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                      onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
                  </div>
                  <div className="relative">
                    {/* TikTok icon */}
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="#000"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z"/></svg>
                    <input value={form.tiktok_url} onChange={e => set('tiktok_url', e.target.value)} placeholder="tiktok.com/@brandname"
                      className={inputCls + ' pl-9'} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                      onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
                  </div>
                  <div className="relative">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="#1877F2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    <input value={form.facebook_url} onChange={e => set('facebook_url', e.target.value)} placeholder="facebook.com/brandname"
                      className={inputCls + ' pl-9'} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                      onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>Qısa Açıqlama</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Bizneslə bağlı əlavə məlumat..." rows={3}
                  className={inputCls + ' resize-none'} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.15)')} />
              </div>

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
