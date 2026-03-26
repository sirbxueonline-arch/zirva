'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import UpgradeModal from './UpgradeModal'
import type { Profile } from '@/types'
import { Globe, AlertTriangle, Check, ArrowRight } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 28 }
const LOADING_MESSAGES = ['Sayt analiz edilir...', 'SEO teqləri yaradılır...', 'Açar sözlər seçilir...', 'Tamamlanır...']

interface GenerateFormProps {
  profile: Profile | null
}

export default function GenerateForm({ profile }: GenerateFormProps) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0)
  const [error, setError] = useState('')
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [url, setUrl] = useState(profile?.website_url ?? '')
  const [crawlResult, setCrawlResult] = useState<{ title: string; meta_description: string | null; headings: string[] } | null>(null)
  const [crawling, setCrawling] = useState(false)

  const isPaidPlan = profile?.plan === 'pro' || profile?.plan === 'agency'
  const domainLocked = !isPaidPlan && !!profile?.website_url

  useEffect(() => {
    if (!loading) return
    const interval = setInterval(() => setLoadingMsgIdx(i => (i + 1) % LOADING_MESSAGES.length), 1500)
    return () => clearInterval(interval)
  }, [loading])

  function normalizeUrl(raw: string): string {
    const trimmed = raw.trim()
    if (!trimmed) return trimmed
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  }

  async function handleCrawl() {
    if (!url) return
    setCrawling(true)
    setCrawlResult(null)
    setError('')
    const normalized = normalizeUrl(url)
    if (normalized !== url) setUrl(normalized)
    try {
      const res = await fetch('/api/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCrawlResult(data)
    } catch {
      setError('Sayt əldə edilə bilmədi. URL-i yoxlayın.')
    } finally {
      setCrawling(false)
    }
  }

  async function handleGenerate() {
    if (profile && profile.generations_used >= profile.generations_limit) {
      setShowUpgrade(true)
      return
    }
    if (!url) { setError('URL daxil edin'); return }

    setLoading(true)
    setLoadingMsgIdx(0)
    setError('')

    const normalizedUrl = normalizeUrl(url)
    if (normalizedUrl !== url) setUrl(normalizedUrl)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flow_type: 'url',
          url: normalizedUrl,
          ...(crawlResult || {}),
        }),
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

  const inputStyle = {
    background: '#FFFFFF',
    border: '1px solid rgba(123,110,246,0.18)',
    boxShadow: '0 1px 3px rgba(13,13,26,0.04)',
  }

  const used = profile?.generations_used ?? 0
  const limit = profile?.generations_limit ?? 5
  const pct = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const usageColor = pct >= 90 ? '#F25C54' : pct >= 70 ? '#F5A623' : '#7B6EF6'

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

      <div className="max-w-xl mx-auto px-6 py-16 flex flex-col items-center text-center">

        {/* Header */}
        <motion.div className="mb-10" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, rgba(123,110,246,0.12), rgba(0,201,167,0.08))', border: '1px solid rgba(123,110,246,0.2)' }}>
            <Globe size={28} strokeWidth={1.6} style={{ color: '#7B6EF6' }} />
          </div>
          <h1 className="font-display font-bold text-4xl text-text-primary mb-2">SEO Paketi</h1>
          <p className="text-text-muted text-base">Saytınızı analiz edib Google.az üçün<br/>optimallaşdırılmış teqlər yaradırıq</p>
          {profile && (
            <div className="mt-5 w-48 mx-auto">
              <div className="flex justify-between text-xs text-text-muted mb-1.5">
                <span>Bu ay</span>
                <span style={{ color: usageColor }}>{used} / {limit === 999999 ? '∞' : limit}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(123,110,246,0.1)' }}>
                <motion.div className="h-full rounded-full" style={{ background: usageColor }}
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
              </div>
            </div>
          )}
        </motion.div>

        {/* URL input */}
        <motion.div className="w-full mb-3"
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.06 }}
        >
          {/* Free plan: no domain saved yet */}
          {!isPaidPlan && !profile?.website_url && (
            <div className="mb-3 px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
              style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)', color: '#D97706' }}
            >
              <Globe size={14} strokeWidth={2} className="flex-shrink-0" />
              Pulsuz planda yalnız 1 domen istifadə edə bilərsiniz.{' '}
              <a href="/settings" className="font-bold underline underline-offset-2">Parametrlərdə domeninizi əlavə edin.</a>
            </div>
          )}

          {/* Locked domain badge for free users */}
          {domainLocked && (
            <div className="mb-2 flex items-center gap-2 px-1">
              <Globe size={13} strokeWidth={2} style={{ color: '#9B9EBB' }} />
              <span className="text-xs text-text-muted">Pulsuz plan — 1 domen:</span>
              <span className="text-xs font-bold" style={{ color: '#7B6EF6' }}>{profile?.website_url}</span>
              <a href="/settings/billing" className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-lg"
                style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}>
                Pro → çox domen
              </a>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={e => { if (!domainLocked) { setUrl(e.target.value); setError('') } }}
              onKeyDown={e => e.key === 'Enter' && handleCrawl()}
              placeholder="example.az"
              autoFocus={!domainLocked}
              readOnly={domainLocked}
              className="w-full rounded-2xl px-5 py-4 text-base text-text-primary outline-none transition-all"
              style={{ ...inputStyle, fontSize: '1rem', cursor: domainLocked ? 'default' : 'text', opacity: domainLocked ? 0.75 : 1 }}
              onFocus={e => { if (!domainLocked) { e.target.style.borderColor = '#7B6EF6'; e.target.style.boxShadow = '0 0 0 3px rgba(123,110,246,0.1)' } }}
              onBlur={e => { e.target.style.borderColor = 'rgba(123,110,246,0.18)'; e.target.style.boxShadow = '0 1px 3px rgba(13,13,26,0.04)' }}
            />
            <button
              onClick={handleCrawl}
              disabled={crawling || !url.trim()}
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
        <motion.button
          onClick={handleGenerate} disabled={loading || !url.trim()}
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
