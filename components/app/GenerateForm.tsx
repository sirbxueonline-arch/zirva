'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import UpgradeModal from './UpgradeModal'
import BrandModal from './BrandModal'
import type { Profile, Brand } from '@/types'
import { Globe, AlertTriangle, Check, ArrowRight, ChevronDown, Plus } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 28 }
const LOADING_MESSAGES = ['Sayt analiz edilir...', 'SEO teqləri yaradılır...', 'Açar sözlər seçilir...', 'Tamamlanır...']

export default function GenerateForm({ profile }: { profile: Profile | null }) {
  const router = useRouter()

  const [loading,        setLoading]        = useState(false)
  const [loadingMsgIdx,  setLoadingMsgIdx]  = useState(0)
  const [error,          setError]          = useState('')
  const [showUpgrade,    setShowUpgrade]    = useState(false)
  const [brands,         setBrands]         = useState<Brand[]>([])
  const [selectedBrand,  setSelectedBrand]  = useState<Brand | null>(null)
  const [dropOpen,       setDropOpen]       = useState(false)
  const [url,            setUrl]            = useState('')
  const [crawlResult,    setCrawlResult]    = useState<{ title: string; meta_description: string | null; headings: string[] } | null>(null)
  const [crawling,       setCrawling]       = useState(false)
  const [brandModalOpen, setBrandModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/brands').then(r => r.ok ? r.json() : null).then(d => {
      if (!d?.brands) return
      setBrands(d.brands)
      if (d.brands.length > 0) {
        setSelectedBrand(d.brands[0])
        setUrl(d.brands[0].website_url ?? '')
      }
    })
  }, [])

  useEffect(() => {
    if (!loading) return
    const iv = setInterval(() => setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 1500)
    return () => clearInterval(iv)
  }, [loading])

  function normalizeUrl(raw: string) {
    const t = raw.trim()
    return /^https?:\/\//i.test(t) ? t : `https://${t}`
  }

  function selectBrand(b: Brand) {
    setSelectedBrand(b); setDropOpen(false)
    setUrl(b.website_url ?? ''); setCrawlResult(null); setError('')
  }

  async function handleCrawl() {
    if (!url) return
    setCrawling(true); setCrawlResult(null); setError('')
    const normalized = normalizeUrl(url)
    if (normalized !== url) setUrl(normalized)
    try {
      const res = await fetch('/api/crawl', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: normalized }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCrawlResult(data)
    } catch { setError('Sayt əldə edilə bilmədi. URL-i yoxlayın.') }
    finally { setCrawling(false) }
  }

  async function handleGenerate() {
    if (!url) { setError('URL daxil edin'); return }
    if (profile && profile.generations_used >= profile.generations_limit) { setShowUpgrade(true); return }
    setLoading(true); setLoadingMsgIdx(0); setError('')
    const normalizedUrl = normalizeUrl(url)
    if (normalizedUrl !== url) setUrl(normalizedUrl)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flow_type: 'url', url: normalizedUrl, ...(crawlResult || {}), brand_id: selectedBrand?.id }),
      })
      const data = await res.json()
      if (res.status === 403) { setShowUpgrade(true); setLoading(false); return }
      if (!res.ok) throw new Error(data.error || 'Server xətası')
      router.push(`/result/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta baş verdi.')
      setLoading(false)
    }
  }

  const inputStyle = { background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.18)', boxShadow: '0 1px 3px rgba(13,13,26,0.04)' }

  return (
    <>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />
      <BrandModal open={brandModalOpen} onClose={() => setBrandModalOpen(false)} initial={null}
        onSaved={b => { setBrands(prev => [b, ...prev]); selectBrand(b) }} />

      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(245,245,255,0.94)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="relative w-20 h-20 mb-7">
              <motion.div className="absolute inset-0 rounded-full border-[2.5px] border-transparent border-t-primary"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              <motion.div className="absolute inset-[5px] rounded-full border-[2px] border-transparent border-b-success"
                animate={{ rotate: -360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Globe size={22} strokeWidth={1.6} style={{ color: '#7B6EF6' }} />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={loadingMsgIdx} className="text-text-primary font-bold text-xl"
                initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={SPRING}>
                {LOADING_MESSAGES[loadingMsgIdx]}
              </motion.p>
            </AnimatePresence>
            <p className="text-text-muted text-sm mt-2">AI ilə optimallaşdırılır...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-xl mx-auto px-6 py-16 flex flex-col items-center text-center">

        {/* Header */}
        <motion.div className="mb-10" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.12), rgba(0,201,167,0.08))', border: '1px solid rgba(123,110,246,0.2)' }}>
            <Globe size={28} strokeWidth={1.6} style={{ color: '#7B6EF6' }} />
          </div>
          <h1 className="font-display font-bold text-4xl text-text-primary mb-2">SEO Paketi</h1>
          <p className="text-text-muted text-base">Brendinizi seçin, URL-i analiz edib<br/>Google üçün optimallaşdırılmış teqlər yaradırıq</p>
        </motion.div>

        {/* Brand picker */}
        <motion.div className="w-full mb-5 relative" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.04 }}>
          <label className="block text-xs font-bold uppercase tracking-widest text-left mb-2" style={{ color: '#9B9EBB' }}>Brend</label>

          {brands.length === 0 ? (
            <button onClick={() => setBrandModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-semibold border-2 border-dashed transition-all hover:border-primary hover:text-primary"
              style={{ borderColor: 'rgba(123,110,246,0.25)', color: '#9B9EBB' }}
            >
              <Plus size={16} strokeWidth={2.5} /> İlk brendi yarat
            </button>
          ) : (
            <>
              <button onClick={() => setDropOpen(v => !v)}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium text-left transition-all"
                style={{ ...inputStyle, border: dropOpen ? '1px solid #7B6EF6' : '1px solid rgba(123,110,246,0.18)' }}
              >
                {selectedBrand ? (
                  <>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                      style={{ background: `hsl(${(selectedBrand.name.charCodeAt(0) * 37) % 360}, 60%, 60%)` }}>
                      {selectedBrand.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-text-primary truncate">{selectedBrand.name}</div>
                      {selectedBrand.website_url && <div className="text-xs text-text-muted truncate">{selectedBrand.website_url.replace(/^https?:\/\//, '')}</div>}
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
                    style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.15)', boxShadow: '0 8px 32px rgba(13,13,26,0.12)' }}
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  >
                    {brands.map(b => (
                      <button key={b.id} onClick={() => selectBrand(b)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-all hover:bg-gray-50"
                        style={{ borderBottom: '1px solid rgba(123,110,246,0.06)' }}
                      >
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: `hsl(${(b.name.charCodeAt(0) * 37) % 360}, 60%, 60%)` }}>
                          {b.name[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-text-primary truncate">{b.name}</div>
                          {b.website_url && <div className="text-xs text-text-muted truncate">{b.website_url.replace(/^https?:\/\//, '')}</div>}
                        </div>
                        {selectedBrand?.id === b.id && <Check size={14} strokeWidth={2.5} style={{ color: '#7B6EF6', flexShrink: 0 }} />}
                      </button>
                    ))}
                    <button onClick={() => { setDropOpen(false); setBrandModalOpen(true) }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all hover:bg-gray-50"
                      style={{ color: '#7B6EF6' }}
                    >
                      <div className="w-8 h-8 rounded-xl border-2 border-dashed flex items-center justify-center flex-shrink-0" style={{ borderColor: '#7B6EF6' }}>
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

        {/* URL input */}
        <motion.div className="w-full mb-3" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.07 }}>
          <label className="block text-xs font-bold uppercase tracking-widest text-left mb-2" style={{ color: '#9B9EBB' }}>Sayt URL-i</label>
          <div className="flex gap-2">
            <input type="url" value={url} onChange={e => { setUrl(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleCrawl()}
              placeholder="example.az" autoFocus
              className="w-full rounded-2xl px-5 py-4 text-base text-text-primary outline-none transition-all"
              style={{ ...inputStyle, fontSize: '1rem' }}
              onFocus={e => { e.target.style.borderColor = '#7B6EF6'; e.target.style.boxShadow = '0 0 0 3px rgba(123,110,246,0.1)' }}
              onBlur={e  => { e.target.style.borderColor = 'rgba(123,110,246,0.18)'; e.target.style.boxShadow = '0 1px 3px rgba(13,13,26,0.04)' }}
            />
            <button onClick={handleCrawl} disabled={crawling || !url.trim()}
              className="flex-shrink-0 px-5 py-4 rounded-2xl text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: crawling ? '#9B9EBB' : '#7B6EF6', minWidth: '100px' }}
            >
              {crawling ? '...' : 'Analiz Et'}
            </button>
          </div>

          <AnimatePresence>
            {crawlResult && (
              <motion.div className="mt-2 rounded-xl px-4 py-3 flex items-center gap-2"
                style={{ background: 'rgba(0,201,167,0.06)', border: '1px solid rgba(0,201,167,0.2)' }}
                initial={{ y: 6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ opacity: 0 }} transition={SPRING}
              >
                <span className="w-4 h-4 rounded-full bg-success flex items-center justify-center flex-shrink-0">
                  <Check size={10} strokeWidth={3} className="text-white" />
                </span>
                <span className="text-xs font-semibold" style={{ color: '#00C9A7' }}>Sayt analiz edildi</span>
                <span className="text-xs text-text-muted truncate ml-1">{crawlResult.title || ''}</span>
              </motion.div>
            )}
          </AnimatePresence>
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

        {/* Submit */}
        <motion.button onClick={handleGenerate} disabled={loading || !url.trim()}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-60"
          style={{ background: '#7B6EF6', boxShadow: '0 4px 20px rgba(123,110,246,0.25)' }}
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.12 }}
          whileHover={{ scale: 1.02, boxShadow: '0 6px 28px rgba(123,110,246,0.35)' }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">SEO Paketi Yarat <ArrowRight size={16} strokeWidth={2.5} /></span>
        </motion.button>
      </div>
    </>
  )
}
