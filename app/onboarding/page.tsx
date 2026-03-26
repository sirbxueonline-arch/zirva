'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Globe, CheckCircle2 } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 28 }

function normalizeUrl(raw: string): string {
  const s = raw.trim()
  if (!s) return ''
  return /^https?:\/\//i.test(s) ? s : `https://${s}`
}

function StyledInput({
  label, value, onChange, onKeyDown, placeholder, type = 'text', autoFocus = false, error = '',
  hint = '',
}: {
  label?: string; value: string; onChange: (v: string) => void
  onKeyDown?: (e: React.KeyboardEvent) => void; placeholder?: string
  type?: string; autoFocus?: boolean; error?: string; hint?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      {label && (
        <label className="block text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: '#9B9EBB' }}>
          {label}
        </label>
      )}
      <input
        autoFocus={autoFocus}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full rounded-2xl px-5 py-4 text-base outline-none transition-all duration-200"
        style={{
          background: focused ? '#fff' : 'rgba(123,110,246,0.04)',
          border: `2px solid ${error ? '#F25C54' : focused ? '#7B6EF6' : 'rgba(123,110,246,0.14)'}`,
          color: '#0D0D1A',
          boxShadow: focused ? '0 0 0 4px rgba(123,110,246,0.08)' : 'none',
          fontSize: '1rem',
        }}
      />
      {error && <p className="text-xs mt-1.5" style={{ color: '#F25C54' }}>{error}</p>}
      {hint && !error && <p className="text-xs mt-2" style={{ color: '#C0C3D8' }}>{hint}</p>}
    </div>
  )
}

function SocialRow({
  icon, label, prefix, value, onChange,
}: {
  icon: React.ReactNode; label: string; prefix: string; value: string; onChange: (v: string) => void
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-200"
      style={{
        background: focused ? '#fff' : 'rgba(123,110,246,0.03)',
        border: `2px solid ${focused ? '#7B6EF6' : 'rgba(123,110,246,0.12)'}`,
        boxShadow: focused ? '0 0 0 4px rgba(123,110,246,0.07)' : 'none',
      }}>
      <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(123,110,246,0.08)' }}>
        {icon}
      </div>
      <span className="text-xs font-medium flex-shrink-0 select-none" style={{ color: '#B0B3C8' }}>{prefix}</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value.replace(/^@/, '').replace(/^https?:\/\/(www\.)?[^/]+\/@?/, ''))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="handle"
        className="flex-1 text-sm outline-none min-w-0"
        style={{ background: 'transparent', color: '#0D0D1A' }}
      />
      <span className="text-[10px] font-medium flex-shrink-0" style={{ color: '#D0D2E8' }}>istəyə görə</span>
    </div>
  )
}

export default function OnboardingPage() {
  const router   = useRouter()
  const supabase = createClient()

  const [step,      setStep]      = useState(1)
  const [firstName, setFirstName] = useState('')
  const [brandName, setBrandName] = useState('')
  const [url,       setUrl]       = useState('')
  const [instagram, setInstagram] = useState('')
  const [facebook,  setFacebook]  = useState('')
  const [tiktok,    setTiktok]    = useState('')
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      supabase.from('profiles').select('full_name').eq('id', user.id).single()
        .then(({ data }) => { if (data?.full_name) setFirstName(data.full_name.split(' ')[0]) })
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleStep1() {
    if (!brandName.trim()) return
    setStep(2)
  }

  async function handleStep2() {
    if (!url.trim()) { setError('Sayt URL-i daxil edin'); return }
    setError(''); setSaving(true)
    const normalized = normalizeUrl(url)
    try {
      const res = await fetch('/api/brands', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          brandName.trim(),
          website_url:   normalized || null,
          instagram_url: instagram ? `https://instagram.com/${instagram}` : null,
          facebook_url:  facebook  ? `https://facebook.com/${facebook}`  : null,
          tiktok_url:    tiktok    ? `https://tiktok.com/@${tiktok}`     : null,
        }),
      })
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Xəta baş verdi'); setSaving(false); return }
      setStep(3)
    } catch { setError('Xəta baş verdi'); setSaving(false) }
  }

  const steps = ['Brend', 'Sayt & Sosial', 'Hazır!']

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(145deg, #EDEAFF 0%, #F3F2FF 35%, #EBF0FF 70%, #F0EEFF 100%)' }}>

      {/* ── Decorative blobs ── */}
      <div className="absolute pointer-events-none" style={{ top: '-120px', right: '-100px', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(123,110,246,0.22) 0%, transparent 65%)', filter: 'blur(50px)' }} />
      <div className="absolute pointer-events-none" style={{ bottom: '-80px', left: '-80px', width: 420, height: 420,
        background: 'radial-gradient(circle, rgba(155,143,248,0.18) 0%, transparent 65%)', filter: 'blur(50px)' }} />
      <div className="absolute pointer-events-none" style={{ top: '40%', left: '5%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(0,201,167,0.07) 0%, transparent 65%)', filter: 'blur(40px)' }} />

      {/* ── Subtle dot grid ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(123,110,246,0.18) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* ── Top bar ── */}
      <div className="relative z-10 flex items-center justify-between px-8 pt-7 pb-4">
        <motion.span className="font-display font-bold text-xl" style={{ color: '#7B6EF6' }}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={SPRING}>
          Zirva
        </motion.span>

        {/* Step pills */}
        <motion.div className="flex items-center gap-1.5"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300"
                style={{
                  background: step === i + 1 ? '#7B6EF6' : step > i + 1 ? 'rgba(123,110,246,0.12)' : 'rgba(0,0,0,0.05)',
                  color: step === i + 1 ? '#fff' : step > i + 1 ? '#7B6EF6' : '#B0B3C8',
                }}>
                {step > i + 1 ? '✓' : i + 1}. {label}
              </div>
              {i < steps.length - 1 && (
                <div className="w-4 h-px" style={{ background: 'rgba(123,110,246,0.2)' }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">

            {/* ══ STEP 1 ══ */}
            {step === 1 && (
              <motion.div key="s1"
                initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
                transition={SPRING} className="flex flex-col gap-6">

                {/* Question */}
                <div>
                  <motion.div className="flex items-center gap-2 mb-3"
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.04 }}>
                    <span className="text-2xl">✨</span>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(123,110,246,0.6)' }}>
                      Addım 1 / 3
                    </span>
                  </motion.div>
                  <motion.h1 className="font-display font-bold leading-tight mb-2"
                    style={{ fontSize: '2rem', color: '#1A1A3E' }}
                    initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.06 }}>
                    {firstName ? <>Salam, <span style={{ color: '#7B6EF6' }}>{firstName}</span>! 👋<br /></> : null}
                    Brendinizin adı nədir?
                  </motion.h1>
                  <motion.p className="text-sm" style={{ color: '#9B9EBB' }}
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.08 }}>
                    Şirkətin və ya brendin adını daxil edin — ad-soyadınız deyil
                  </motion.p>
                </div>

                {/* Card */}
                <motion.div className="rounded-3xl p-6"
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.1 }}
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.95)',
                    boxShadow: '0 12px 48px rgba(123,110,246,0.14), 0 2px 0 rgba(255,255,255,0.9) inset',
                  }}>
                  <StyledInput
                    autoFocus
                    value={brandName}
                    onChange={setBrandName}
                    onKeyDown={e => e.key === 'Enter' && brandName.trim() && handleStep1()}
                    placeholder="Məsələn: Archilink, CoffeeLab, TechAZ..."
                  />
                </motion.div>

                {/* Action row */}
                <motion.div className="flex items-center justify-between"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}>
                  <div className="flex gap-2">
                    {[1,2,3].map(i => (
                      <motion.div key={i} className="h-2 rounded-full" transition={SPRING}
                        animate={{ width: step === i ? 28 : 8, background: step >= i ? '#7B6EF6' : 'rgba(123,110,246,0.2)' }} />
                    ))}
                  </div>
                  <motion.button onClick={handleStep1} disabled={!brandName.trim()}
                    className="px-7 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center gap-2 disabled:opacity-30 transition-all"
                    style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 6px 20px rgba(123,110,246,0.4)' }}
                    whileHover={{ scale: 1.04, boxShadow: '0 8px 26px rgba(123,110,246,0.5)' }}
                    whileTap={{ scale: 0.97 }}>
                    Davam et <ArrowRight size={15} strokeWidth={2.5} />
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* ══ STEP 2 ══ */}
            {step === 2 && (
              <motion.div key="s2"
                initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }}
                transition={SPRING} className="flex flex-col gap-6">

                {/* Question */}
                <div>
                  <motion.div className="flex items-center gap-2 mb-3"
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.04 }}>
                    <span className="text-2xl">🌐</span>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(123,110,246,0.6)' }}>
                      Addım 2 / 3
                    </span>
                  </motion.div>
                  <motion.h1 className="font-display font-bold leading-tight mb-2"
                    style={{ fontSize: '1.9rem', color: '#1A1A3E' }}
                    initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.06 }}>
                    <span style={{ color: '#7B6EF6' }}>{brandName}</span> harada var?
                  </motion.h1>
                  <motion.p className="text-sm" style={{ color: '#9B9EBB' }}
                    initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.08 }}>
                    Sayt URL-i əlavə edin, sosial media isə istəyə görədir
                  </motion.p>
                </div>

                {/* Card */}
                <motion.div className="rounded-3xl p-6 space-y-4"
                  initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...SPRING, delay: 0.1 }}
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.95)',
                    boxShadow: '0 12px 48px rgba(123,110,246,0.14), 0 2px 0 rgba(255,255,255,0.9) inset',
                  }}>

                  <StyledInput
                    autoFocus
                    label="🌐  Sayt URL-i"
                    type="url"
                    value={url}
                    onChange={v => { setUrl(v); setError('') }}
                    onKeyDown={e => e.key === 'Enter' && handleStep2()}
                    placeholder="example.az"
                    error={error}
                  />

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: 'rgba(123,110,246,0.1)' }} />
                    <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: '#C8CAE0' }}>Sosial Media</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(123,110,246,0.1)' }} />
                  </div>

                  <SocialRow
                    // eslint-disable-next-line @next/next/no-img-element
                    icon={<img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://instagram.com&size=64" width={20} height={20} alt="Instagram" style={{ borderRadius: 5 }} />}
                    label="Instagram" prefix="instagram.com/"
                    value={instagram} onChange={setInstagram} />
                  <SocialRow
                    // eslint-disable-next-line @next/next/no-img-element
                    icon={<img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://facebook.com&size=64" width={20} height={20} alt="Facebook" style={{ borderRadius: 5 }} />}
                    label="Facebook" prefix="facebook.com/"
                    value={facebook} onChange={setFacebook} />
                  <SocialRow
                    // eslint-disable-next-line @next/next/no-img-element
                    icon={<img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://tiktok.com&size=64" width={20} height={20} alt="TikTok" style={{ borderRadius: 5 }} />}
                    label="TikTok" prefix="tiktok.com/@"
                    value={tiktok} onChange={setTiktok} />
                </motion.div>

                {/* Action row */}
                <motion.div className="flex items-center justify-between"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}>
                  <button onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-60"
                    style={{ color: '#B0B3C8' }}>
                    ← Geri
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                      {[1,2,3].map(i => (
                        <motion.div key={i} className="h-2 rounded-full" transition={SPRING}
                          animate={{ width: step === i ? 28 : 8, background: step >= i ? '#7B6EF6' : 'rgba(123,110,246,0.2)' }} />
                      ))}
                    </div>
                    <motion.button onClick={handleStep2} disabled={saving || !url.trim()}
                      className="px-7 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center gap-2 disabled:opacity-40 transition-all"
                      style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 6px 20px rgba(123,110,246,0.4)' }}
                      whileHover={{ scale: 1.04, boxShadow: '0 8px 26px rgba(123,110,246,0.5)' }}
                      whileTap={{ scale: 0.97 }}>
                      {saving ? 'Yaradılır...' : <><span>Brend yarat</span><ArrowRight size={15} strokeWidth={2.5} /></>}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ══ STEP 3 ══ */}
            {step === 3 && (
              <motion.div key="s3"
                initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={SPRING} className="flex flex-col gap-6 text-center">

                <div>
                  <motion.div
                    className="w-24 h-24 rounded-[28px] flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 12px 40px rgba(123,110,246,0.45)' }}
                    animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 0.6, ease: 'easeOut' }}>
                    <CheckCircle2 size={40} strokeWidth={1.6} color="#fff" />
                  </motion.div>
                  <h1 className="font-display font-bold text-3xl mb-2" style={{ color: '#1A1A3E' }}>
                    Brend yaradıldı! 🎉
                  </h1>
                  <p className="text-base" style={{ color: '#9B9EBB' }}>
                    <strong style={{ color: '#7B6EF6' }}>{brandName}</strong> uğurla qeydə alındı
                  </p>
                </div>

                <div className="rounded-3xl p-6"
                  style={{
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.95)',
                    boxShadow: '0 12px 48px rgba(123,110,246,0.12)',
                  }}>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { val: '1', label: 'Brend', emoji: '🏷️' },
                      { val: '∞', label: 'SEO Paketi', emoji: '✍️' },
                      { val: '#1', label: 'Hədəf', emoji: '🎯' },
                    ].map(({ val, label, emoji }) => (
                      <div key={label} className="rounded-2xl py-4 px-2 text-center"
                        style={{ background: 'rgba(123,110,246,0.06)', border: '1px solid rgba(123,110,246,0.1)' }}>
                        <div className="text-xl mb-1">{emoji}</div>
                        <div className="font-display font-bold text-xl" style={{ color: '#7B6EF6' }}>{val}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: '#B0B3C8' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  <motion.button onClick={() => router.push('/dashboard')}
                    className="w-full py-4 rounded-2xl text-white font-bold text-base flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 6px 24px rgba(123,110,246,0.4)' }}
                    whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(123,110,246,0.5)' }}
                    whileTap={{ scale: 0.98 }}>
                    Dashboard-a keç <ArrowRight size={16} strokeWidth={2.5} />
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
