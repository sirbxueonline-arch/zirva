'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, AlertTriangle, ArrowRight } from 'lucide-react'
import type { Profile } from '@/types'

const SPRING = { type: 'spring' as const, stiffness: 280, damping: 28 }

const LOADING_MSGS = [
  'Camera profili yüklənir...',
  'Profil analiz edilir...',
  'SMO paketi hazırlanır...',
  'Hashtag strategiyası yaradılır...',
  'Kaptionlar yazılır...',
  'Tamamlanır...',
]

export default function SMOForm({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [msgIdx, setMsgIdx] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading) return
    const t = setInterval(() => setMsgIdx(i => (i + 1) % LOADING_MSGS.length), 1600)
    return () => clearInterval(t)
  }, [loading])

  async function handleGenerate() {
    const clean = username.replace(/^@/, '').trim()
    if (!clean) { setError('Camera istifadəçi adı daxil edin'); return }

    setLoading(true)
    setError('')
    setMsgIdx(0)

    try {
      // Step 1 — fetch Camera profile
      let profileData = null
      try {
        const crawlRes = await fetch('/api/social-crawl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: clean, platform: 'instagram' }),
        })
        if (crawlRes.ok) profileData = await crawlRes.json()
      } catch { /* profile fetch failed — continue without it */ }

      // Step 2 — generate SMO package
      const res = await fetch('/api/smo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: profileData?.full_name || clean,
          platform:      'instagram',
          category:      profileData?.category || 'Digər',
          city:          'Bakı',
          existing_bio:  profileData?.bio || undefined,
          profile_data:  profileData || undefined,
        }),
      })
      const data = await res.json()
      if (res.status === 403) { router.push('/settings/billing'); return }
      if (!res.ok) throw new Error(data.error)
      router.push(`/smo/result/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xəta baş verdi')
      setLoading(false)
    }
  }

  const used = profile?.generations_used ?? 0
  const limit = profile?.generations_limit ?? 5
  const pct = limit > 0 ? Math.min(Math.round((used / limit) * 100), 100) : 0
  const usageColor = pct >= 90 ? '#F25C54' : pct >= 70 ? '#F5A623' : '#E1306C'

  return (
    <>
      {/* Loading overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            style={{ background: 'rgba(245,245,255,0.95)', backdropFilter: 'blur(12px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="relative w-20 h-20 mb-7">
              <motion.div className="absolute inset-0 rounded-full border-[2.5px] border-transparent border-t-[#E1306C]"
                animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
              <motion.div className="absolute inset-[5px] rounded-full border-[2px] border-transparent border-b-primary"
                animate={{ rotate: -360 }} transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <Camera size={22} strokeWidth={1.8} style={{ color: '#E1306C' }} />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={msgIdx} className="text-text-primary font-bold text-xl"
                initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={SPRING}>
                {LOADING_MSGS[msgIdx]}
              </motion.p>
            </AnimatePresence>
            <p className="text-text-muted text-sm mt-2">@{username.replace(/^@/, '')}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-lg mx-auto px-6 py-16 flex flex-col items-center text-center">

        {/* Header */}
        <motion.div className="mb-10" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={SPRING}>
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, rgba(225,48,108,0.12), rgba(123,110,246,0.08))', border: '1px solid rgba(225,48,108,0.2)' }}>
            <Camera size={28} strokeWidth={1.6} style={{ color: '#E1306C' }} />
          </div>
          <h1 className="font-display font-bold text-4xl text-text-primary mb-2">SMO Paketi</h1>
          <p className="text-text-muted text-base">Camera hesabınızı analiz edib bio, hashtag<br/>və kontent strategiyası yaradırıq</p>
        </motion.div>

        {/* Input */}
        <motion.div className="w-full mb-4"
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.06 }}
        >
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted text-lg font-semibold select-none">@</span>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value.replace(/^@/, '')); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
              placeholder="instagramhesabınız"
              autoFocus
              className="w-full rounded-2xl py-4 text-base text-text-primary outline-none transition-all"
              style={{
                paddingLeft: '2.5rem',
                paddingRight: '1.25rem',
                background: '#FFFFFF',
                border: '1px solid rgba(123,110,246,0.2)',
                boxShadow: '0 2px 12px rgba(13,13,26,0.06)',
                fontSize: '1.05rem',
              }}
              onFocus={e => { e.target.style.borderColor = '#E1306C'; e.target.style.boxShadow = '0 0 0 3px rgba(225,48,108,0.1)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(123,110,246,0.2)'; e.target.style.boxShadow = '0 2px 12px rgba(13,13,26,0.06)' }}
            />
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.p className="text-sm mb-4 flex items-center gap-1.5" style={{ color: '#F25C54' }}
              initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            >
              <AlertTriangle size={14} strokeWidth={2} /> {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          onClick={handleGenerate} disabled={loading || !username.trim()}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #E1306C 0%, #7B6EF6 100%)', boxShadow: '0 4px 20px rgba(225,48,108,0.25)' }}
          initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.1 }}
          whileHover={{ scale: 1.02, boxShadow: '0 6px 28px rgba(225,48,108,0.35)' }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="flex items-center justify-center gap-2">SMO Paketi Yarat <ArrowRight size={16} strokeWidth={2.5} /></span>
        </motion.button>

        {/* Usage */}
        {profile && (
          <motion.div className="mt-5 w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-text-muted">Bu ay</span>
              <span className="text-xs font-medium" style={{ color: usageColor }}>{used} / {limit} paket</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(225,48,108,0.1)' }}>
              <motion.div className="h-full rounded-full" style={{ background: usageColor }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
            </div>
          </motion.div>
        )}

      </div>
    </>
  )
}
