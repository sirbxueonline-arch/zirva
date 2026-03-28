'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import UpgradeModal from './UpgradeModal'
import type { Profile, Brand } from '@/types'
import { Globe, AlertTriangle, ArrowRight, Tag, KeyRound, Code2, Share2 } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 28 }
const LOADING_MESSAGES = ['Sayt analiz edilir...', 'SEO teqləri yaradılır...', 'Açar sözlər seçilir...', 'Tamamlanır...']

export default function GenerateForm({ profile }: { profile: Profile | null }) {
  const router = useRouter()

  const [loading,       setLoading]       = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [error,         setError]         = useState('')
  const [crawlWarning,  setCrawlWarning]  = useState(false)
  const [showUpgrade,   setShowUpgrade]   = useState(false)
  const [url,           setUrl]           = useState('')
  const [firstBrand,    setFirstBrand]    = useState<Brand | null>(null)

  // Silently load first brand for API context
  useEffect(() => {
    fetch('/api/brands').then(r => r.ok ? r.json() : null).then(d => {
      if (d?.brands?.length > 0) setFirstBrand(d.brands[0])
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

  async function handleGenerate() {
    if (!url.trim()) { setError('Saytın URL-ini daxil edin'); return }
    if (profile && (profile.credits_used + 5 > profile.credits_limit)) { setShowUpgrade(true); return }

    setLoading(true); setLoadingMsgIdx(0); setError(''); setCrawlWarning(false)
    const normalizedUrl = normalizeUrl(url)

    // Auto-crawl first, then generate
    let crawl: { title: string; meta_description: string | null; headings: string[] } | null = null
    try {
      const cr = await fetch('/api/crawl', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: normalizedUrl }) })
      if (cr.ok) crawl = await cr.json()
      else setCrawlWarning(true)
    } catch { setCrawlWarning(true) }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flow_type: 'url', url: normalizedUrl, ...(crawl || {}), brand_id: firstBrand?.id }),
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
  const creditsRemaining = Math.max((profile?.credits_limit ?? 25) - (profile?.credits_used ?? 0), 0)

  return (
    <>
      <UpgradeModal open={showUpgrade} onClose={() => setShowUpgrade(false)} />

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

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-16 flex flex-col items-center text-center">

        {/* Header */}
        <motion.div className="mb-6 sm:mb-10" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.12), rgba(0,201,167,0.08))', border: '1px solid rgba(123,110,246,0.2)' }}>
            <Globe size={28} strokeWidth={1.6} style={{ color: '#7B6EF6' }} />
          </div>
          <h1 className="font-display font-bold text-2xl sm:text-4xl text-text-primary mb-2">SEO Paketi</h1>
          <p className="text-text-muted text-base">Saytınızın URL-ini daxil edin — Google üçün<br/>optimallaşdırılmış teqlər yaradırıq</p>
        </motion.div>

        {/* URL input */}
        <motion.div className="w-full mb-5" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.04 }}>
          <label className="block text-xs font-bold uppercase tracking-widest text-left mb-2" style={{ color: '#9B9EBB' }}>Sayt URL-i</label>
          <input
            type="url"
            value={url}
            onChange={e => { setUrl(e.target.value); setError('') }}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            placeholder="https://example.com"
            style={{
              ...inputStyle,
              width: '100%',
              padding: '14px 18px',
              borderRadius: '16px',
              fontSize: '15px',
              color: '#0D0D1A',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </motion.div>

        {/* What you'll get */}
        <motion.div className="w-full mb-5 rounded-2xl p-4 text-left"
          style={{ background: 'rgba(123,110,246,0.04)', border: '1px solid rgba(123,110,246,0.12)' }}
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.06 }}
        >
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#7B6EF6' }}>SEO Paketi nə verir</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { Icon: Tag,      title: 'Title + Meta teqlər', sub: 'AZ + RU dilləri' },
              { Icon: KeyRound, title: '8 Açar söz',          sub: 'SEO optimized' },
              { Icon: Code2,    title: 'Schema Markup',       sub: 'JSON-LD strukturu' },
              { Icon: Share2,   title: 'OG + Twitter Card',   sub: 'Sosial paylaşım teqləri' },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-2.5 rounded-xl p-2.5"
                style={{ background: 'rgba(123,110,246,0.06)' }}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(123,110,246,0.14)' }}>
                  <Icon size={13} strokeWidth={2} style={{ color: '#7B6EF6' }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold leading-snug" style={{ color: '#0D0D1A' }}>{title}</div>
                  <div className="text-[10px] leading-snug" style={{ color: '#9B9EBB' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Crawl warning (non-blocking) */}
        <AnimatePresence>
          {crawlWarning && (
            <motion.div className="w-full mb-3 text-sm py-3 px-4 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', color: '#B87B00' }}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <AlertTriangle size={15} strokeWidth={2} className="flex-shrink-0" /> Sayt taranmadı — teqlər əl ilə yaradılır
            </motion.div>
          )}
        </AnimatePresence>

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
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.08 }}
        >
          <div className="relative">
            <motion.button onClick={handleGenerate} disabled={loading || !url.trim()}
              className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-60"
              style={{ background: '#7B6EF6', boxShadow: '0 4px 20px rgba(123,110,246,0.25)' }}
              whileHover={{ scale: 1.02, boxShadow: '0 6px 28px rgba(123,110,246,0.35)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">SEO Paketi Yarat <ArrowRight size={16} strokeWidth={2.5} /></span>
            </motion.button>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.18)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/80"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="6" x2="12" y2="8"/><line x1="12" y1="16" x2="12" y2="18"/></svg>
              <span className="text-white/90 text-[11px] font-bold">5</span>
            </div>
          </div>
          <p className="text-xs text-center mt-3" style={{ color: '#9B9EBB' }}>
            <span className="font-semibold" style={{ color: creditsRemaining < 5 ? '#F25C54' : creditsRemaining < 25 ? '#F5A623' : '#7B6EF6' }}>{creditsRemaining}</span> kredit qalıb
          </p>
        </motion.div>
      </div>
    </>
  )
}
