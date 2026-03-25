'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Globe, ArrowRight, CheckCircle, Star, Search } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

/* ── Rotating phrases in the headline ── */
const ROTATING = ['title teqlər', 'meta açıqlama', 'schema markup', 'hreflang teqlər']

/* ── Simulated output fields for the product mockup ── */
const PREVIEW_FIELDS = [
  { label: 'Title Tag AZ', value: 'Bakı Restoran | Ən Yaxşı Azərbaycanlı Mətbəxi' },
  { label: 'Meta Description', value: 'Bakıda ən yaxşı restoran. Autentik milli yemək...' },
  { label: 'Schema Markup', value: 'Restaurant · LocalBusiness · Menu' },
]

/* ── Helper ── */
function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

function useCountUp(target: number, duration = 1500, start = true) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    const t0 = performance.now()
    const raf = requestAnimationFrame(function tick(now) {
      const p = Math.min((now - t0) / duration, 1)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])
  return count
}

/* ════════════════════════════════════════
   Animated product mockup card
   ════════════════════════════════════════ */
function ProductCard() {
  const [phase, setPhase] = useState<'typing' | 'scanning' | 'done'>('typing')
  const [progress, setProgress] = useState(0)
  const [shown, setShown] = useState(0)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    const run = async () => {
      while (mounted.current) {
        setPhase('typing'); setProgress(0); setShown(0)
        await delay(1200)

        if (!mounted.current) break
        setPhase('scanning')
        for (let p = 0; p <= 100; p += 3) {
          if (!mounted.current) break
          setProgress(p)
          await delay(40)
        }

        if (!mounted.current) break
        setPhase('done')
        for (let i = 1; i <= PREVIEW_FIELDS.length; i++) {
          if (!mounted.current) break
          setShown(i)
          await delay(380)
        }
        await delay(3200)
      }
    }
    run()
    return () => { mounted.current = false }
  }, [])

  return (
    <motion.div
      className="relative w-full max-w-[420px] rounded-2xl overflow-hidden"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(123,110,246,0.14)',
        boxShadow: '0 32px 80px rgba(123,110,246,0.18), 0 8px 24px rgba(13,13,26,0.07)',
      }}
      initial={{ y: 40, opacity: 0, rotateX: 4 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      transition={{ ...SPRING, delay: 0.55 }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b"
        style={{ borderColor: 'rgba(123,110,246,0.08)', background: '#F8F7FF' }}>
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#F25C54' }} />
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#F5A623' }} />
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#00C9A7' }} />
        <div className="flex-1 mx-3 rounded-md px-3 py-1 text-xs font-mono flex items-center gap-1.5"
          style={{ background: '#EEEEFF', color: '#9B9EBB' }}>
          <Globe size={10} strokeWidth={2} />
          meybistro.az
        </div>
      </div>

      <div className="p-5">
        {/* URL row */}
        <div className="flex items-center gap-2 rounded-xl p-3 mb-4"
          style={{ background: '#F5F5FF', border: '1px solid rgba(123,110,246,0.14)' }}>
          <Search size={13} style={{ color: '#7B6EF6', flexShrink: 0 }} />
          <span className="flex-1 text-xs font-mono truncate" style={{ color: '#3D4060' }}>
            https://meybistro.az
          </span>
          <motion.div
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)' }}
            animate={phase === 'scanning' ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
            transition={{ duration: 0.6, repeat: phase === 'scanning' ? Infinity : 0 }}
          >
            <Zap size={9} strokeWidth={2.5} />
            Analiz
          </motion.div>
        </div>

        {/* Dynamic content area */}
        <div className="min-h-[160px]">
          <AnimatePresence mode="wait">

            {/* Scanning phase */}
            {phase === 'scanning' && (
              <motion.div key="scanning"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
                  <motion.span
                    className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: '#7B6EF6' }}
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity }}
                  />
                  Sayt analiz edilir...
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mb-4"
                  style={{ background: 'rgba(123,110,246,0.1)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #7B6EF6, #9B8FF8)', width: `${progress}%` }}
                  />
                </div>
                {/* Skeleton rows */}
                {[80, 60, 72].map((w, i) => (
                  <div key={i} className="skeleton h-8 rounded-lg mb-2" style={{ width: `${w}%` }} />
                ))}
              </motion.div>
            )}

            {/* Done phase */}
            {phase === 'done' && (
              <motion.div key="done"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Score */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9B9EBB' }}>SEO Balı</span>
                  <motion.div
                    className="flex items-baseline gap-1"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >
                    <span className="font-display font-bold text-2xl" style={{ color: '#00C9A7' }}>87</span>
                    <span className="text-xs text-text-muted">/100</span>
                  </motion.div>
                </div>

                {/* Output fields */}
                <div className="space-y-2">
                  {PREVIEW_FIELDS.map((f, i) => (
                    <AnimatePresence key={f.label}>
                      {i < shown && (
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={SPRING}
                          className="rounded-lg p-2.5"
                          style={{ background: '#F5F5FF', border: '1px solid rgba(123,110,246,0.1)' }}
                        >
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs font-semibold" style={{ color: '#7B6EF6' }}>{f.label}</span>
                            <CheckCircle size={11} strokeWidth={2.5} style={{ color: '#00C9A7' }} />
                          </div>
                          <p className="text-xs truncate" style={{ color: '#3D4060' }}>{f.value}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

/* ════════════════════════════════════════
   Floating badge chips beside the card
   ════════════════════════════════════════ */
function FloatingBadge({ children, style, delay: d }: {
  children: React.ReactNode
  style: React.CSSProperties
  delay: number
}) {
  return (
    <motion.div
      className="absolute text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none hidden xl:flex items-center gap-1.5"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(123,110,246,0.18)',
        boxShadow: '0 4px 16px rgba(123,110,246,0.12)',
        color: '#0D0D1A',
        whiteSpace: 'nowrap',
        ...style,
      }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { delay: d, duration: 0.4 },
        y: { delay: d, duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
      }}
    >
      {children}
    </motion.div>
  )
}

/* ════════════════════════════════════════
   Main Hero
   ════════════════════════════════════════ */
export default function Hero() {
  const [rotIdx, setRotIdx] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  /* Cycle rotating headline phrase */
  useEffect(() => {
    const id = setInterval(() => setRotIdx(i => (i + 1) % ROTATING.length), 2400)
    return () => clearInterval(id)
  }, [])

  /* IntersectionObserver for stats */
  useEffect(() => {
    const obs = new IntersectionObserver(
      e => { if (e[0].isIntersecting) setStatsVisible(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  const gen  = useCountUp(500,  1500, statsVisible)
  const user = useCountUp(200,  1500, statsVisible)
  const sat  = useCountUp(98,   1200, statsVisible)

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">

      {/* ── Background ── */}
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(123,110,246,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)',
        }}
      />

      {/* Orbs */}
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 640, height: 640, background: 'rgba(123,110,246,0.09)', top: '-15%', left: '-12%', filter: 'blur(80px)' }}
        animate={{ x: [-40, 40, -40], y: [-30, 30, -30] }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />
      <motion.div className="absolute rounded-full pointer-events-none"
        style={{ width: 480, height: 480, background: 'rgba(0,201,167,0.08)', bottom: '-5%', right: '-8%', filter: 'blur(70px)' }}
        animate={{ x: [30, -30, 30], y: [20, -40, 20] }}
        transition={{ duration: 16, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">

          {/* ════════ LEFT — Copy ════════ */}
          <div className="max-w-2xl">

            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-semibold mb-7"
              style={{ background: 'rgba(123,110,246,0.09)', borderColor: 'rgba(123,110,246,0.25)', color: '#7B6EF6' }}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.05 }}
            >
              <Zap size={13} strokeWidth={2.5} />
              Azərbaycan bazarı üçün hazırlanmış
            </motion.div>

            {/* H1 */}
            <motion.h1
              className="font-display font-bold text-5xl md:text-6xl lg:text-[64px] leading-[1.12] tracking-tight text-text-primary mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.15 }}
            >
              Saytınız üçün{' '}
              <span className="inline-block relative">
                {/* Gradient highlight */}
                <span
                  className="relative z-10"
                  style={{
                    background: 'linear-gradient(135deg, #7B6EF6 0%, #9B8FF8 50%, #00C9A7 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  mükəmməl SEO
                </span>
                {/* Underline accent */}
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #7B6EF6, #00C9A7)' }}
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ ...SPRING, delay: 0.7 }}
                />
              </span>
              <br />
              30 saniyə içində
            </motion.h1>

            {/* Rotating capability line */}
            <motion.div
              className="flex items-center gap-2 mb-5"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.28 }}
            >
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7B6EF6, #00C9A7)' }} />
              <span className="text-text-secondary text-base">
                AI ilə{' '}
                <span className="inline-block overflow-hidden align-bottom" style={{ height: '1.4em', minWidth: '130px' }}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={rotIdx}
                      className="inline-block font-semibold"
                      style={{ color: '#7B6EF6' }}
                      initial={{ y: 14, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -14, opacity: 0 }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      {ROTATING[rotIdx]}
                    </motion.span>
                  </AnimatePresence>
                </span>
                {' '}yaradın
              </span>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              className="text-text-secondary text-lg leading-relaxed mb-10"
              style={{ maxWidth: '54ch' }}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.38 }}
            >
              URL-i yapışdırın, süni intellekt title teq, meta açıqlama, Open
              Graph, schema markup və hreflang&nbsp;— hamısını Azərbaycan
              dilində, Google standartına uyğun hazırlasın.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 mb-10"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.48 }}
            >
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-white transition-all duration-200 hover:scale-[1.03]"
                style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 6px 24px rgba(123,110,246,0.35)' }}
              >
                Pulsuz Başla
                <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold text-text-primary transition-all duration-200 hover:scale-[1.01]"
                style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.2)', boxShadow: '0 2px 8px rgba(13,13,26,0.04)' }}
              >
                Necə işləyir?
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...SPRING, delay: 0.58 }}
            >
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                {['#7B6EF6','#00C9A7','#F25C54','#F5A623','#9B8FF8'].map((color, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: color, zIndex: 5 - i }}
                  >
                    {['A','B','C','D','E'][i]}
                  </div>
                ))}
              </div>
              {/* Stars + text */}
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} strokeWidth={0} fill="#F5A623" style={{ color: '#F5A623' }} />
                  ))}
                </div>
                <p className="text-xs text-text-muted"><span className="font-semibold text-text-secondary">200+</span> istifadəçi məmnundur</p>
              </div>
            </motion.div>
          </div>

          {/* ════════ RIGHT — Product mockup ════════ */}
          <div className="relative hidden lg:flex items-center justify-center flex-shrink-0">

            {/* Floating badges */}
            <FloatingBadge style={{ top: '-28px', left: '-30px' }} delay={1.2}>
              <CheckCircle size={12} style={{ color: '#00C9A7' }} />
              Google.az optimizasiyası
            </FloatingBadge>
            <FloatingBadge style={{ bottom: '60px', left: '-50px' }} delay={1.6}>
              <Zap size={12} style={{ color: '#7B6EF6' }} />
              30 saniyə
            </FloatingBadge>
            <FloatingBadge style={{ top: '80px', right: '-40px' }} delay={2.0}>
              <Star size={12} fill="#F5A623" style={{ color: '#F5A623' }} />
              SEO balı 87/100
            </FloatingBadge>

            <ProductCard />
          </div>

        </div>

        {/* ════════ Stats row ════════ */}
        <motion.div
          ref={statsRef}
          className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-8 mt-16 pt-8 border-t"
          style={{ borderColor: 'rgba(123,110,246,0.1)' }}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...SPRING, delay: 0.7 }}
        >
          {[
            { value: gen,  suffix: '+', label: 'SEO paketi yaradılıb' },
            { value: user, suffix: '+', label: 'aktiv istifadəçi' },
            { value: sat,  suffix: '%', label: 'müştəri razılığı' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-3">
              {i > 0 && <div className="hidden sm:block w-px h-8 self-center" style={{ background: 'rgba(123,110,246,0.12)' }} />}
              <div>
                <div className="font-display font-bold text-3xl text-text-primary tabular-nums">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-text-muted text-sm">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
