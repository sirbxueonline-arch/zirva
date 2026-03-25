'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }
const FADE_UP = { initial: { y: 24, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -16, opacity: 0 } }

const BUSINESS_TYPES = [
  { id: 'beauty',   icon: '💅', label: 'Gözəllik & Sağlamlıq' },
  { id: 'food',     icon: '🍽️', label: 'Restoran & Kafe' },
  { id: 'fashion',  icon: '👗', label: 'Moda & Geyim' },
  { id: 'tech',     icon: '💻', label: 'Texnologiya' },
  { id: 'realty',   icon: '🏠', label: 'Daşınmaz Əmlak' },
  { id: 'edu',      icon: '📚', label: 'Təhsil' },
  { id: 'auto',     icon: '🚗', label: 'Avtomobil' },
  { id: 'other',    icon: '✨', label: 'Digər' },
]

const FLOWS = [
  {
    id: 'url',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    label: 'Sayt URL-i',
    desc: 'Saytınızın URL-ini daxil edin, biz qalanını edirik',
    badge: 'Ən populyar',
  },
  {
    id: 'social',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    label: 'Sosial Media',
    desc: '@istifadəçi adınızı daxil edin',
    badge: null,
  },
  {
    id: 'manual',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    label: 'Əl ilə daxil et',
    desc: 'Biznes məlumatlarınızı özünüz yazın',
    badge: null,
  },
]

const TOTAL_STEPS = 4

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [selectedBiz, setSelectedBiz] = useState('')
  const [selectedFlow, setSelectedFlow] = useState('url')
  const [saving, setSaving] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      supabase.from('profiles').select('full_name').eq('id', user.id).single().then(({ data }) => {
        if (data?.full_name) { setName(data.full_name); setUserName(data.full_name.split(' ')[0]) }
      })
    })
  }, [])

  async function saveName() {
    if (!name.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').update({ full_name: name.trim(), updated_at: new Date().toISOString() }).eq('id', user.id)
      setUserName(name.trim().split(' ')[0])
    }
    setSaving(false)
    setStep(2)
  }

  function finish() {
    router.push(`/generate?flow=${selectedFlow}`)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F5FF' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5">
        <span className="font-display font-bold text-xl text-primary">Zirva</span>
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          Atla →
        </button>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-center gap-2 py-4">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: step === i + 1 ? 32 : 8,
              background: i + 1 <= step ? '#7B6EF6' : 'rgba(123,110,246,0.2)',
            }}
            transition={{ ...SPRING }}
            className="h-2 rounded-full"
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {/* STEP 1 — Welcome + Name */}
            {step === 1 && (
              <motion.div key="step1" {...FADE_UP} transition={{ ...SPRING }}>
                <div className="text-center mb-10">
                  <motion.div
                    className="text-7xl mb-6 inline-block"
                    animate={{ rotate: [0, 10, -8, 6, 0] }}
                    transition={{ duration: 1.2, delay: 0.3 }}
                  >
                    👋
                  </motion.div>
                  <h1 className="font-display font-bold text-4xl text-text-primary mb-3">
                    Zirva-ya xoş gəldiniz!
                  </h1>
                  <p className="text-text-secondary text-base">
                    Google və ChatGPT-də 1-nci olmağa kömək edək.<br />Əvvəlcə adınızı öyrənək.
                  </p>
                </div>

                <div
                  className="rounded-2xl border p-8"
                  style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.15)', boxShadow: '0 4px 24px rgba(123,110,246,0.07)' }}
                >
                  <label className="block text-text-secondary text-xs font-medium mb-2">Ad Soyad</label>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && name.trim() && saveName()}
                    placeholder="Məsələn: Əli Hüseynov"
                    className="w-full rounded-xl px-4 py-3.5 text-sm text-text-primary outline-none transition-all mb-6"
                    style={{
                      background: '#F5F5FF',
                      border: '1px solid rgba(123,110,246,0.2)',
                    }}
                    onFocus={e => (e.target.style.borderColor = '#7B6EF6')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(123,110,246,0.2)')}
                  />
                  <button
                    onClick={saveName}
                    disabled={!name.trim() || saving}
                    className="w-full py-3.5 rounded-xl text-white font-medium transition-all disabled:opacity-50"
                    style={{ background: '#7B6EF6' }}
                  >
                    {saving ? 'Saxlanır...' : 'Davam et →'}
                  </button>
                  <p className="text-center text-text-muted text-xs mt-4">
                    Bunu daha sonra parametrlərdə dəyişə bilərsiniz
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Business type */}
            {step === 2 && (
              <motion.div key="step2" {...FADE_UP} transition={{ ...SPRING }}>
                <div className="text-center mb-8">
                  <h2 className="font-display font-bold text-3xl text-text-primary mb-2">
                    {userName ? `Salam, ${userName}! 🎉` : 'Növbəti addım 🎉'}
                  </h2>
                  <p className="text-text-secondary text-sm">Biznesiniz hansı sahəyə aiddir?</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {BUSINESS_TYPES.map((biz, i) => (
                    <motion.button
                      key={biz.id}
                      initial={{ y: 16, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ ...SPRING, delay: i * 0.04 }}
                      onClick={() => setSelectedBiz(biz.id)}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center"
                      style={{
                        background: selectedBiz === biz.id ? 'rgba(123,110,246,0.1)' : '#FFFFFF',
                        borderColor: selectedBiz === biz.id ? '#7B6EF6' : 'rgba(123,110,246,0.12)',
                        boxShadow: selectedBiz === biz.id ? '0 0 0 2px rgba(123,110,246,0.2)' : '0 2px 8px rgba(13,13,26,0.04)',
                      }}
                    >
                      <span className="text-3xl">{biz.icon}</span>
                      <span className="text-xs font-medium leading-snug" style={{ color: selectedBiz === biz.id ? '#7B6EF6' : '#5A5D7A' }}>
                        {biz.label}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-medium border transition-all"
                    style={{ borderColor: 'rgba(123,110,246,0.2)', color: '#5A5D7A', background: '#FFFFFF' }}
                  >
                    ← Geri
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedBiz}
                    className="flex-[2] py-3.5 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-40"
                    style={{ background: '#7B6EF6' }}
                  >
                    Davam et →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 — Flow preference */}
            {step === 3 && (
              <motion.div key="step3" {...FADE_UP} transition={{ ...SPRING }}>
                <div className="text-center mb-8">
                  <h2 className="font-display font-bold text-3xl text-text-primary mb-2">
                    Necə başlamaq istərdiniz?
                  </h2>
                  <p className="text-text-secondary text-sm">
                    SEO paketini hansı üsulla yaratmaq istərsiniz?
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {FLOWS.map((flow, i) => (
                    <motion.button
                      key={flow.id}
                      initial={{ x: -12, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ ...SPRING, delay: i * 0.08 }}
                      onClick={() => setSelectedFlow(flow.id)}
                      className="w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all"
                      style={{
                        background: selectedFlow === flow.id ? 'rgba(123,110,246,0.07)' : '#FFFFFF',
                        borderColor: selectedFlow === flow.id ? '#7B6EF6' : 'rgba(123,110,246,0.12)',
                        boxShadow: selectedFlow === flow.id ? '0 0 0 2px rgba(123,110,246,0.18)' : '0 2px 8px rgba(13,13,26,0.04)',
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          background: selectedFlow === flow.id ? 'rgba(123,110,246,0.15)' : 'rgba(123,110,246,0.06)',
                          color: selectedFlow === flow.id ? '#7B6EF6' : '#9B9EBB',
                        }}
                      >
                        {flow.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm" style={{ color: selectedFlow === flow.id ? '#7B6EF6' : '#0D0D1A' }}>
                            {flow.label}
                          </span>
                          {flow.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(0,201,167,0.12)', color: '#00C9A7' }}>
                              {flow.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">{flow.desc}</p>
                      </div>
                      <div
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: selectedFlow === flow.id ? '#7B6EF6' : 'rgba(123,110,246,0.2)',
                          background: selectedFlow === flow.id ? '#7B6EF6' : 'transparent',
                        }}
                      >
                        {selectedFlow === flow.id && (
                          <motion.div
                            className="w-2 h-2 rounded-full bg-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ ...SPRING }}
                          />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3.5 rounded-xl text-sm font-medium border transition-all"
                    style={{ borderColor: 'rgba(123,110,246,0.2)', color: '#5A5D7A', background: '#FFFFFF' }}
                  >
                    ← Geri
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="flex-[2] py-3.5 rounded-xl text-white text-sm font-medium transition-all"
                    style={{ background: '#7B6EF6' }}
                  >
                    Davam et →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4 — Ready! */}
            {step === 4 && (
              <motion.div key="step4" {...FADE_UP} transition={{ ...SPRING }}>
                <div
                  className="rounded-3xl border p-10 text-center"
                  style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.15)', boxShadow: '0 8px 40px rgba(123,110,246,0.1)' }}
                >
                  {/* Animated checkmark */}
                  <motion.div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'rgba(123,110,246,0.1)' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...SPRING, delay: 0.1 }}
                  >
                    <motion.svg
                      width="40" height="40" viewBox="0 0 40 40" fill="none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <motion.path
                        d="M8 20l8 8 16-16"
                        stroke="#7B6EF6"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                      />
                    </motion.svg>
                  </motion.div>

                  <motion.h2
                    className="font-display font-bold text-3xl text-text-primary mb-3"
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ...SPRING, delay: 0.3 }}
                  >
                    Hər şey hazırdır! 🚀
                  </motion.h2>

                  <motion.p
                    className="text-text-secondary text-sm mb-2 leading-relaxed"
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ...SPRING, delay: 0.4 }}
                  >
                    İlk SEO paketinizi yaratmağa hazırsınız.<br />
                    Google və ChatGPT-də 1-nci olmaq üçün bir kliklər yetər.
                  </motion.p>

                  <motion.div
                    className="flex items-center justify-center gap-2 mb-8 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {/* Google */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'rgba(66,133,244,0.2)', background: 'rgba(66,133,244,0.04)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span className="text-xs font-medium" style={{ color: '#4285F4' }}>Google-da 1-nci</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border" style={{ borderColor: 'rgba(16,163,127,0.2)', background: 'rgba(16,163,127,0.04)' }}>
                      <svg width="14" height="14" viewBox="0 0 41 41" fill="none">
                        <path d="M37.532 16.87a9.963 9.963 0 0 0-.856-8.184 10.078 10.078 0 0 0-10.855-4.835 9.964 9.964 0 0 0-6.313-2.635 10.078 10.078 0 0 0-9.614 6.977 9.967 9.967 0 0 0-6.664 4.834 10.08 10.08 0 0 0 1.24 11.817 9.965 9.965 0 0 0 .856 8.185 10.079 10.079 0 0 0 10.855 4.835 9.965 9.965 0 0 0 6.313 2.634 10.079 10.079 0 0 0 9.617-6.981 9.967 9.967 0 0 0 6.663-4.834 10.079 10.079 0 0 0-1.243-11.813zM22.498 37.886a7.474 7.474 0 0 1-4.799-1.735c.061-.033.168-.091.237-.134l7.964-4.6a1.294 1.294 0 0 0 .655-1.134V19.054l3.366 1.944a.12.12 0 0 1 .066.092v9.299a7.505 7.505 0 0 1-7.49 7.496zM6.392 31.006a7.471 7.471 0 0 1-.894-5.023c.06.036.162.099.237.141l7.964 4.6a1.297 1.297 0 0 0 1.308 0l9.724-5.614v3.888a.12.12 0 0 1-.048.103l-8.051 4.649a7.504 7.504 0 0 1-10.24-2.744zM4.297 13.62A7.469 7.469 0 0 1 8.2 10.333c0 .068-.004.19-.004.274v9.201a1.294 1.294 0 0 0 .654 1.132l9.723 5.614-3.366 1.944a.12.12 0 0 1-.114.012L7.044 23.86a7.504 7.504 0 0 1-2.747-10.24zm27.658 6.437l-9.724-5.615 3.367-1.943a.121.121 0 0 1 .114-.012l8.048 4.648a7.498 7.498 0 0 1-1.158 13.528v-9.476a1.293 1.293 0 0 0-.647-1.13zm3.35-5.043c-.059-.037-.162-.099-.236-.141l-7.965-4.6a1.298 1.298 0 0 0-1.308 0l-9.723 5.614v-3.888a.12.12 0 0 1 .048-.103l8.05-4.645a7.497 7.497 0 0 1 11.135 7.763zm-21.063 6.929l-3.367-1.944a.12.12 0 0 1-.065-.092v-9.299a7.497 7.497 0 0 1 12.293-5.756 6.94 6.94 0 0 0-.236.134l-7.965 4.6a1.294 1.294 0 0 0-.654 1.132l-.006 11.225zm1.829-3.943l4.33-2.501 4.332 2.497v4.998l-4.331 2.5-4.331-2.5V18z" fill="#10a37f"/>
                      </svg>
                      <span className="text-xs font-medium" style={{ color: '#10a37f' }}>ChatGPT-də 1-nci</span>
                    </div>
                  </motion.div>

                  <motion.button
                    onClick={finish}
                    className="w-full py-4 rounded-xl text-white font-semibold text-base transition-all"
                    style={{ background: 'linear-gradient(135deg, #7B6EF6 0%, #9B8FF8 100%)', boxShadow: '0 4px 20px rgba(123,110,246,0.35)' }}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ...SPRING, delay: 0.55 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    İlk SEO Paketimi Yarat →
                  </motion.button>

                  <motion.button
                    onClick={() => router.push('/dashboard')}
                    className="mt-3 text-text-muted text-sm hover:text-text-secondary transition-colors w-full py-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Əvvəlcə dashboard-a bax
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom step label */}
      <div className="text-center pb-8">
        <span className="text-text-muted text-xs">Addım {step} / {TOTAL_STEPS}</span>
      </div>
    </div>
  )
}
