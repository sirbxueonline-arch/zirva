'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Globe, Instagram, Facebook, Pencil, Trash2 } from 'lucide-react'
import BrandModal from '@/components/app/BrandModal'
import type { Brand } from '@/types'

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 26 }

export default function BrandsPage() {
  const [brands, setBrands]   = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<Brand | null>(null)

  async function load() {
    const res = await fetch('/api/brands')
    if (res.ok) { const { brands } = await res.json(); setBrands(brands) }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id: string) {
    if (!confirm('Bu brendi silmək istədiyinizə əminsiniz?')) return
    await fetch(`/api/brands?id=${id}`, { method: 'DELETE' })
    setBrands(b => b.filter(x => x.id !== id))
  }

  function openCreate() { setEditing(null); setModalOpen(true) }
  function openEdit(b: Brand) { setEditing(b); setModalOpen(true) }
  function onSaved(b: Brand) {
    setBrands(prev => {
      const idx = prev.findIndex(x => x.id === b.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = b; return next }
      return [b, ...prev]
    })
  }

  return (
    <>
      <BrandModal open={modalOpen} onClose={() => setModalOpen(false)} onSaved={onSaved} initial={editing} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-text-primary mb-1">Brendlər</h1>
            <p className="text-text-muted text-sm">Saytlarınız üçün brend profilləri yaradın</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 4px 16px rgba(123,110,246,0.3)' }}
          >
            <Plus size={16} strokeWidth={2.5} /> Yeni Brend
          </button>
        </div>

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
                className="flex items-center gap-4 p-5 rounded-2xl border bg-white transition-all hover:shadow-sm"
                style={{ borderColor: 'rgba(123,110,246,0.12)' }}
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{ background: `hsl(${(b.name.charCodeAt(0) * 37) % 360}, 60%, 60%)` }}>
                  {b.name[0].toUpperCase()}
                </div>

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
                        <Instagram size={11} strokeWidth={1.8} /> Instagram
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
                        <Facebook size={11} strokeWidth={1.8} /> Facebook
                      </span>
                    )}
                    {b.category && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(123,110,246,0.08)', color: '#7B6EF6' }}>{b.category}</span>}
                    {b.city && <span className="text-xs text-text-muted">{b.city}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(b)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-gray-100"
                    title="Redaktə et">
                    <Pencil size={14} strokeWidth={1.8} style={{ color: '#9B9EBB' }} />
                  </button>
                  <button onClick={() => handleDelete(b.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-50"
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
