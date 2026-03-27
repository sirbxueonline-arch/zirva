'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import BrandModal from './BrandModal'
import type { Profile, Brand } from '@/types'
import { Sparkles, AlertTriangle, Check, ChevronDown, Plus, ExternalLink } from 'lucide-react'
import BrandAvatar from './BrandAvatar'
import UpgradeModal from './UpgradeModal'

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 28 }
const LOADING_MESSAGES = [
  'Brend analiz edilir...',
  'Hədəf auditoriya müəyyənləşdirilir...',
  'Hashteqlər seçilir...',
  'Kontent planı hazırlanır...',
  'Tamamlanır...',
]

export default function SMOForm({ profile }: { profile: Profile | null }) {
  const router = useRouter()

  const [loading,        setLoading]        = useState(false)
  const [loadingMsgIdx,  setLoadingMsgIdx]  = useState(0)
  const [error,          setError]          = useState('')
  const [showUpgrade,    setShowUpgrade]    = useState(false)
  const [brands,         setBrands]         = useState<Brand[]>([])
  const [selectedBrand,  setSelectedBrand]  = useState<Brand | null>(null)
  const [dropOpen,       setDropOpen]       = useState(false)
  const [brandModalOpen, setBrandModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/brands').then(r => r.ok ? r.json() : null).then(d => {
      if (!d?.brands) return
      setBrands(d.brands)
      if (d.brands.length > 0) {
        const savedId = localStorage.getItem('zirva_active_brand')
        const saved   = savedId ? d.brands.find((b: Brand) => b.id === savedId) : null
        setSelectedBrand(saved ?? d.brands[0])
      }
    })
  }, [])

  useEffect(() => {
    if (!loading) return
    const iv = setInterval(() => setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 1800)
    return () => clearInterval(iv)
  }, [loading])

  function selectBrand(b: Brand) {
    setSelectedBrand(b); setDropOpen(false); setError('')
    localStorage.setItem('zirva_active_brand', b.id)
    window.dispatchEvent(new CustomEvent('zirva-brand-change', { detail: b }))
  }

  async function handleGenerate() {
    if (!selectedBrand) { setError('Brend seçin'); return }
    if (profile && (profile.credits_used + 5 > profile.credits_limit)) { setShowUpgrade(true); return }

    setLoading(true); setLoadingMsgIdx(0); setError('')

    try {
      const res = await fetch('/api/smo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: selectedBrand.id }),
      })
      const data = await res.json()
      if (res.status === 403) { setShowUpgrade(true); setLoading(false); return }
      if (!res.ok) throw new Error(data.error || 'Server xətası')
      router.push(`/smo/result/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta baş verdi.')
      setLoading(false)
    }
  }

  const inputStyle = { background: '#FFFFFF', border: '1px solid rgba(0,201,167,0.18)', boxShadow: '0 1px 3px rgba(13,13,26,0.04)' }
  const creditsRemaining = Math.max((profile?.credits_limit ?? 25) - (profile?.credits_used ?? 0), 0)

  return (
    <>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      <BrandModal open={brandModalOpen} onClose={() => setBrandModalOpen(false)} initial={null}
        onSaved={b => { setBrands(prev => [b, ...prev]); selectBrand(b) }} />

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(245,255,252,0.94)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="relative w-20 h-20 mb-7">
              <motion.div className="absolute inset-0 rounded-full border-[2.5px] border-transparent border-t-[#00C9A7]"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              <motion.div className="absolute inset-[5px] rounded-full border-[2px] border-transparent border-b-[#7B6EF6]"
                animate={{ rotate: -360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={22} strokeWidth={1.6} style={{ color: '#00C9A7' }} />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={loadingMsgIdx} className="text-text-primary font-bold text-xl"
                initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={SPRING}>
                {LOADING_MESSAGES[loadingMsgIdx]}
              </motion.p>
            </AnimatePresence>
            <p className="text-text-muted text-sm mt-2">AI ilə sosial media strategiyası yaradılır...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center text-center">

        {/* Header */}
        <motion.div className="mb-6 sm:mb-10" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, rgba(0,201,167,0.12), rgba(123,110,246,0.08))', border: '1px solid rgba(0,201,167,0.2)' }}>
            <Sparkles size={28} strokeWidth={1.6} style={{ color: '#00C9A7' }} />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-text-primary mb-2">SMO Paketi</h1>
          <p className="text-text-muted text-base">Brendinizi seçin — Instagram, TikTok və<br/>Facebook üçün tam SMO strategiyası yaradırıq</p>
        </motion.div>

        {/* Brand picker */}
        <motion.div className="w-full mb-5 relative" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.04 }}>
          <label className="block text-xs font-bold uppercase tracking-widest text-left mb-2" style={{ color: '#9B9EBB' }}>Brend</label>

          {brands.length === 0 ? (
            <div className="w-full rounded-2xl p-5 text-center" style={{ background: 'rgba(0,201,167,0.04)', border: '2px dashed rgba(0,201,167,0.2)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: '#0D0D1A' }}>Əvvəlcə brend yaradın</p>
              <p className="text-xs mb-4" style={{ color: '#9B9EBB' }}>SMO paketi yaratmaq üçün ən azı bir brend tələb olunur.</p>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <button onClick={() => setBrandModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]"
                  style={{ background: '#00C9A7' }}
                >
                  <Plus size={14} strokeWidth={2.5} /> Brend yarat
                </button>
                <a href="/brands"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
                  style={{ borderColor: 'rgba(0,201,167,0.2)', color: '#00C9A7' }}
                >
                  Brendlər <ExternalLink size={12} strokeWidth={2} />
                </a>
              </div>
            </div>
          ) : (
            <>
              <button onClick={() => setDropOpen(v => !v)}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium text-left transition-all"
                style={{ ...inputStyle, border: dropOpen ? '1px solid #00C9A7' : '1px solid rgba(0,201,167,0.18)' }}
              >
                {selectedBrand ? (
                  <>
                    <BrandAvatar brand={selectedBrand} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-text-primary truncate">{selectedBrand.name}</div>
                      {selectedBrand.website_url
                        ? <div className="text-xs text-text-muted truncate">{selectedBrand.website_url.replace(/^https?:\/\//, '')}</div>
                        : <div className="text-xs" style={{ color: '#9B9EBB' }}>Sayt yoxdur</div>
                      }
                    </div>
                  </>
                ) : (
                  <span className="text-text-muted flex-1">Brend seçin...</span>
                )}
                <ChevronDown size={16} strokeWidth={2} style={{ color: '#9B9EBB', transform: dropOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }} />
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <motion.div className="absolute top-full left-0 right-0 mt-2 rounded-2xl border overflow-hidden z-20"
                    style={{ background: '#FFFFFF', borderColor: 'rgba(0,201,167,0.15)', boxShadow: '0 8px 32px rgba(13,13,26,0.12)' }}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  >
                    {brands.map(b => (
                      <button key={b.id} onClick={() => selectBrand(b)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-all hover:bg-gray-50"
                        style={{ borderBottom: '1px solid rgba(0,201,167,0.06)' }}
                      >
                        <BrandAvatar brand={b} size={32} />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-text-primary truncate">{b.name}</div>
                          {b.website_url
                            ? <div className="text-xs text-text-muted truncate">{b.website_url.replace(/^https?:\/\//, '')}</div>
                            : <div className="text-xs" style={{ color: '#9B9EBB' }}>Sayt yoxdur</div>
                          }
                        </div>
                        {selectedBrand?.id === b.id && <Check size={14} strokeWidth={2.5} style={{ color: '#00C9A7', flexShrink: 0 }} />}
                      </button>
                    ))}
                    <button onClick={() => { setDropOpen(false); setBrandModalOpen(true) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all hover:bg-gray-50"
                      style={{ color: '#00C9A7' }}
                    >
                      <div className="w-8 h-8 rounded-xl border-2 border-dashed flex items-center justify-center flex-shrink-0" style={{ borderColor: '#00C9A7' }}>
                        <Plus size={14} strokeWidth={2.5} />
                      </div>
                      Yeni brend əlavə et
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>

        {/* What you'll get */}
        <motion.div className="w-full mb-5 rounded-2xl p-4 text-left"
          style={{ background: 'rgba(0,201,167,0.04)', border: '1px solid rgba(0,201,167,0.12)' }}
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.06 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#00C9A7' }}>SMO Paketi nə verir</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['🎯', 'Hədəf Auditoriya', 'Reklam hədəfləmə üçün'],
              ['#', 'Hashteq Strategiyası', 'Əsas + Reels + Story'],
              ['📅', 'Kontent Təqvimi', '4 həftəlik plan'],
              ['✍️', 'Kontent Şablonları', '5+ hazır şablon'],
            ].map(([icon, title, sub]) => (
              <div key={title} className="flex items-start gap-2">
                <span className="text-base mt-0.5">{icon}</span>
                <div>
                  <div className="text-xs font-semibold" style={{ color: '#0D0D1A' }}>{title}</div>
                  <div className="text-xs" style={{ color: '#9B9EBB' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div className="w-full mb-3 text-error text-sm py-3 px-4 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(242,92,84,0.08)', border: '1px solid rgba(242,92,84,0.2)' }}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <AlertTriangle size={15} strokeWidth={2} className="flex-shrink-0" /> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit + credit pill */}
        <motion.div className="w-full"
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.1 }}
        >
          <div className="relative">
            <motion.button onClick={handleGenerate} disabled={loading || !selectedBrand}
              className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-60"
              style={{ background: '#00C9A7', boxShadow: '0 4px 20px rgba(0,201,167,0.25)' }}
              whileHover={{ scale: 1.02, boxShadow: '0 6px 28px rgba(0,201,167,0.35)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles size={16} strokeWidth={2} /> SMO Paketi Yarat
              </span>
            </motion.button>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.18)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>
              <span className="text-white/90 text-[11px] font-bold">5</span>
            </div>
          </div>
          <p className="text-xs text-center mt-3" style={{ color: '#9B9EBB' }}>
            <span className="font-semibold" style={{ color: creditsRemaining < 5 ? '#F25C54' : creditsRemaining < 20 ? '#F5A623' : '#00C9A7' }}>{creditsRemaining}</span> kredit qalıb
          </p>
        </motion.div>
      </div>
    </>
  )
}
