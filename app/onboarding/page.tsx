'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { Globe, ArrowRight, Sparkles, CheckCircle2, Zap, TrendingUp, PenLine } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }
const FADE_UP = {
  initial: { y: 28, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit:    { y: -16, opacity: 0 },
}

const TOTAL_STEPS = 3

const ANALYSIS_STEPS = [
  { icon: Globe,      text: 'Saytınız yüklənir...',                  ms: 0    },
  { icon: Sparkles,   text: 'Brendinizin tonu öyrənilir...',          ms: 1400 },
  { icon: TrendingUp, text: 'Ən yaxşı açar sözlər tapılır...',        ms: 2800 },
  { icon: PenLine,    text: 'İlk məqaləniz hazırlanır...',            ms: 4200 },
  { icon: CheckCircle2, text: 'Hər şey hazırdır! 🎉',                 ms: 5600 },
]

function normalizeUrl(raw: string): string {
  const s = raw.trim()
  if (!s) return ''
  if (/^https?:\/\//i.test(s)) return s
  return 'https://' + s
}

export default function OnboardingPage() {
  const router  = useRouter()
  const supabase = createClient()

  const [step,      setStep]      = useState(1)
  const [name,      setName]      = useState('')
  const [url,       setUrl]       = useState('')
  const [urlError,  setUrlError]  = useState('')
  const [saving,    setSaving]    = useState(false)
  const [firstName, setFirstName] = useState('')
  const [analysisStep, setAnalysisStep] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      supabase.from('profiles').select('full_name').eq('id', user.id).single()
        .then(({ data }) => {
          if (data?.full_name) {
            setName(data.full_name)
            setFirstName(data.full_name.split(' ')[0])
          }
        })
    })
    return () => timerRef.current.forEach(clearTimeout)
  }, [])

  // Start AI analysis animation on step 3
  useEffect(() => {
    if (step !== 3) return
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []
    ANALYSIS_STEPS.forEach((s, i) => {
      const t = setTimeout(() => setAnalysisStep(i), s.ms)
      timerRef.current.push(t)
    })
  }, [step])

  async function saveName() {
    if (!name.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({
        full_name:  name.trim(),
        updated_at: new Date().toISOString(),
      }).eq('id', user.id)
      setFirstName(name.trim().split(' ')[0])
    }
    setSaving(false)
    setStep(2)
  }

  async function saveUrl() {
    const normalized = normalizeUrl(url)
    if (!normalized) { setUrlError('URL daxil edin'); return }
    try { new URL(normalized) } catch { setUrlError('Düzgün URL daxil edin (məs: saytiniz.az)'); return }
    setUrlError('')
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        website_url: normalized,
        updated_at:  new Date().toISOString(),
      } as any).eq('id', user.id)
    }
    setSaving(false)
    setStep(3)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F5FF' }}>

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5">
        <span className="font-display font-bold text-xl" style={{ color: '#7B6EF6' }}>Zirva</span>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm transition-colors"
          style={{ color: '#9B9EBB' }}
        >
          Atla →
        </button>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 py-3">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width:      step === i + 1 ? 32 : 8,
              background: i + 1 <= step ? '#7B6EF6' : 'rgba(123,110,246,0.2)',
            }}
            transition={{ ...SPRING }}
            className="h-2 rounded-full"
          />
        ))}
      </div>

      {/* Steps */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Welcome + Name ── */}
            {step === 1 && (
              <motion.div key="step1" {...FADE_UP} transition={{ ...SPRING }}>
                <div className="text-center mb-10">
                  <motion.div
                    className="text-6xl mb-5 inline-block"
                    animate={{ rotate: [0, 10, -8, 6, 0] }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                  >
                    👋
                  </motion.div>
                  <h1 className="font-display font-bold text-4xl mb-3" style={{ color: '#0D0D1A' }}>
                    Zirva-ya xoş gəldiniz!
                  </h1>
                  <p className="text-base leading-relaxed" style={{ color: '#737599' }}>
                    Hər gün saytınıza avtomatik məqalə yazır —<br />
                    siz yatarkən Google-da yuxarı çıxırsınız.
                  </p>
                </div>

                <div
                  className="rounded-2xl p-8"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.15)', boxShadow: '0 4px 24px rgba(123,110,246,0.07)' }}
                >
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#9B9EBB' }}>
                    Ad Soyad
                  </label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && name.trim() && saveName()}
                    placeholder="Məsələn: Əli Hüseynov"
                    className="w-full rounded-xl px-4 py-3.5 text-sm outline-none transition-all mb-5"
                    style={{ background: '#F5F5FF', border: '1px solid rgba(123,110,246,0.2)', color: '#0D0D1A' }}
                    onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                    onBlur={e  => (e.target.style.borderColor = 'rgba(123,110,246,0.2)')}
                  />
                  <button
                    onClick={saveName}
                    disabled={!name.trim() || saving}
                    className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ background: '#7B6EF6' }}
                  >
                    {saving ? 'Saxlanır...' : <><span>Davam et</span> <ArrowRight size={15} strokeWidth={2.5} /></>}
                  </button>
                  <p className="text-center text-xs mt-4" style={{ color: '#C0C3D8' }}>
                    Parametrlərdən istənilən vaxt dəyişə bilərsiniz
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: Website URL ── */}
            {step === 2 && (
              <motion.div key="step2" {...FADE_UP} transition={{ ...SPRING }}>
                <div className="text-center mb-8">
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(123,110,246,0.1)' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...SPRING, delay: 0.1 }}
                  >
                    <Globe size={28} strokeWidth={1.8} style={{ color: '#7B6EF6' }} />
                  </motion.div>
                  <h2 className="font-display font-bold text-3xl mb-2" style={{ color: '#0D0D1A' }}>
                    {firstName ? `${firstName}, ` : ''}saytınızı əlavə edin
                  </h2>
                  <p className="text-sm" style={{ color: '#737599' }}>
                    Zirva saytınızı öyrənir, brendinizin sesini anlayır<br />
                    və hər gün mükəmməl məqalələr yazır.
                  </p>
                </div>

                <div
                  className="rounded-2xl p-8 mb-5"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.15)', boxShadow: '0 4px 24px rgba(123,110,246,0.07)' }}
                >
                  <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#9B9EBB' }}>
                    Saytınızın URL-i
                  </label>
                  <div className="relative mb-1.5">
                    <Globe size={16} strokeWidth={2} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#9B9EBB' }} />
                    <input
                      autoFocus
                      type="url"
                      value={url}
                      onChange={e => { setUrl(e.target.value); setUrlError('') }}
                      onKeyDown={e => e.key === 'Enter' && saveUrl()}
                      placeholder="saytiniz.az"
                      className="w-full rounded-xl pl-10 pr-4 py-3.5 text-sm outline-none transition-all"
                      style={{
                        background:   '#F5F5FF',
                        border:       `1px solid ${urlError ? '#F25C54' : 'rgba(123,110,246,0.2)'}`,
                        color:        '#0D0D1A',
                      }}
                      onFocus={e => (e.target.style.borderColor = urlError ? '#F25C54' : '#7B6EF6')}
                      onBlur={e  => (e.target.style.borderColor = urlError ? '#F25C54' : 'rgba(123,110,246,0.2)')}
                    />
                  </div>
                  {urlError && <p className="text-xs mb-4" style={{ color: '#F25C54' }}>{urlError}</p>}

                  {/* What Zirva does */}
                  <div className="mt-5 space-y-2.5">
                    {[
                      { icon: Sparkles,    text: 'Brendinizin tonunu öyrənir' },
                      { icon: TrendingUp,  text: 'Ən gəlirli açar sözləri tapır' },
                      { icon: PenLine,     text: 'Hər gün 1 məqalə yazır və nəşr edir' },
                    ].map(({ icon: Icon, text }, i) => (
                      <motion.div
                        key={text}
                        className="flex items-center gap-3"
                        initial={{ x: -12, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ ...SPRING, delay: 0.1 + i * 0.08 }}
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(123,110,246,0.1)' }}>
                          <Icon size={14} strokeWidth={2} style={{ color: '#7B6EF6' }} />
                        </div>
                        <span className="text-sm" style={{ color: '#3D4060' }}>{text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-semibold border transition-all"
                    style={{ borderColor: 'rgba(123,110,246,0.2)', color: '#737599', background: '#FFFFFF' }}
                  >
                    ← Geri
                  </button>
                  <button
                    onClick={saveUrl}
                    disabled={!url.trim() || saving}
                    className="flex-[2] py-3.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ background: '#7B6EF6', boxShadow: '0 4px 16px rgba(123,110,246,0.3)' }}
                  >
                    {saving ? 'Saxlanır...' : <><span>Zirva-nı işə sal</span> <Zap size={14} strokeWidth={2.5} /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: AI Analysis + Success ── */}
            {step === 3 && (
              <motion.div key="step3" {...FADE_UP} transition={{ ...SPRING }}>
                <div
                  className="rounded-3xl p-10 text-center"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.15)', boxShadow: '0 8px 40px rgba(123,110,246,0.1)' }}
                >
                  {/* Animated orb */}
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ background: 'rgba(123,110,246,0.12)' }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="absolute inset-3 rounded-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)' }}
                      animate={analysisStep === ANALYSIS_STEPS.length - 1 ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={analysisStep}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ ...SPRING }}
                        >
                          {(() => {
                            const Icon = ANALYSIS_STEPS[analysisStep]?.icon ?? Sparkles
                            return <Icon size={28} strokeWidth={1.8} color="#fff" />
                          })()}
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* Current status text */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={analysisStep}
                      className="text-base font-semibold mb-2"
                      style={{ color: '#0D0D1A' }}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -8, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {ANALYSIS_STEPS[analysisStep]?.text}
                    </motion.p>
                  </AnimatePresence>

                  {/* Steps progress */}
                  <div className="flex items-center justify-center gap-2 mb-8">
                    {ANALYSIS_STEPS.map((_, i) => (
                      <motion.div
                        key={i}
                        className="h-1.5 rounded-full"
                        animate={{
                          width:      i === analysisStep ? 20 : 6,
                          background: i <= analysisStep ? '#7B6EF6' : 'rgba(123,110,246,0.15)',
                        }}
                        transition={{ ...SPRING }}
                      />
                    ))}
                  </div>

                  {/* Show CTA only when done */}
                  <AnimatePresence>
                    {analysisStep === ANALYSIS_STEPS.length - 1 && (
                      <motion.div
                        initial={{ y: 16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ ...SPRING, delay: 0.3 }}
                      >
                        <h2 className="font-display font-bold text-2xl mb-2" style={{ color: '#0D0D1A' }}>
                          Zirva işə başladı! 🚀
                        </h2>
                        <p className="text-sm leading-relaxed mb-6" style={{ color: '#737599' }}>
                          İlk məqaləniz artıq hazırlanır.<br />
                          Hər gün saytınıza yeni kontent əlavə ediləcək.
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-6">
                          {[
                            { val: '1',    label: 'Gündəlik məqalə' },
                            { val: '30',   label: 'Aylıq kontent' },
                            { val: '#1',   label: 'Hədəf' },
                          ].map(({ val, label }) => (
                            <div key={label} className="rounded-xl py-3 px-2" style={{ background: 'rgba(123,110,246,0.06)' }}>
                              <div className="font-display font-bold text-xl" style={{ color: '#7B6EF6' }}>{val}</div>
                              <div className="text-[11px]" style={{ color: '#9B9EBB' }}>{label}</div>
                            </div>
                          ))}
                        </div>

                        <motion.button
                          onClick={() => router.push('/dashboard')}
                          className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all flex items-center justify-center gap-2"
                          style={{ background: 'linear-gradient(135deg, #7B6EF6 0%, #9B8FF8 100%)', boxShadow: '0 4px 20px rgba(123,110,246,0.35)' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Dashboard-a keç
                          <ArrowRight size={16} strokeWidth={2.5} />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      <div className="text-center pb-8">
        <span className="text-xs" style={{ color: '#C0C3D8' }}>Addım {step} / {TOTAL_STEPS}</span>
      </div>
    </div>
  )
}
