'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageIntro() {
  const [visible, setVisible] = useState(true)
  const [phase,   setPhase]   = useState<'enter' | 'hold' | 'out'>('enter')

  useEffect(() => {
    if (sessionStorage.getItem('zirva_intro_seen')) {
      setVisible(false)
      return
    }
    // enter → hold → out (content dissolves) → visible=false (triggers exit)
    const t1 = setTimeout(() => setPhase('hold'), 1000)
    const t2 = setTimeout(() => setPhase('out'),  1900)
    const t3 = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('zirva_intro_seen', '1')
    }, 2400) // content fade (400ms) + exit (850ms) fits inside this gap
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden select-none"
          style={{ background: '#06061A' }}
          /* ── Exit: "punch through" — scale up + blur + fade ── */
          exit={{
            scale: 1.12,
            opacity: 0,
            filter: 'blur(10px)',
            transition: { duration: 0.85, ease: [0.4, 0, 1, 1] },
          }}
        >

          {/* ── Deep purple radial — builds from nothing ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 65% 55% at 50% 50%, rgba(123,110,246,0.28) 0%, transparent 70%)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* ── Teal offset orb ── */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: 480, height: 480,
              background: 'radial-gradient(circle, rgba(0,201,167,0.14) 0%, transparent 65%)',
              filter: 'blur(24px)',
              bottom: '-8%', right: '-4%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'hold' ? 1 : 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />

          {/* ── Subtle grid ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),' +
                'linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          {/* ── Main content — fades + lifts before overlay exits ── */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            animate={{
              opacity: phase === 'out' ? 0 : 1,
              y:       phase === 'out' ? -14 : 0,
            }}
            transition={{ duration: 0.42, ease: 'easeIn' }}
          >

            {/* Logo — materialises as a single unit: blur clears + scale lands */}
            <motion.div
              className="relative mb-5"
              initial={{ opacity: 0, scale: 0.82, filter: 'blur(18px)' }}
              animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)' }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              <span
                className="font-display font-bold block"
                style={{
                  fontSize: 'clamp(68px, 13vw, 104px)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  background:
                    'linear-gradient(140deg, #FFFFFF 15%, #D4CEFF 50%, #7B6EF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 52px rgba(123,110,246,0.6))',
                }}
              >
                Zirva
              </span>

              {/* Shimmer sweep — plays once after logo settles */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded"
                style={{
                  background:
                    'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
                  backgroundSize: '200% 100%',
                }}
                initial={{ backgroundPosition: '-100% 0' }}
                animate={{ backgroundPosition: '200% 0' }}
                transition={{ duration: 0.75, ease: 'easeInOut', delay: 1.0 }}
              />
            </motion.div>

            {/* Accent line — draws left → right */}
            <motion.div
              className="rounded-full"
              style={{
                height: 2,
                background:
                  'linear-gradient(90deg, transparent, #7B6EF6 30%, #00C9A7 70%, transparent)',
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width:   phase !== 'enter' ? 220 : 0,
                opacity: phase !== 'enter' ? 1   : 0,
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Tagline */}
            <div style={{ overflow: 'hidden', marginTop: 14 }}>
              <motion.p
                className="text-xs font-semibold tracking-[0.3em] uppercase"
                style={{ color: 'rgba(255,255,255,0.3)' }}
                initial={{ y: '130%' }}
                animate={{ y: phase !== 'enter' ? '0%' : '130%' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              >
                Google · ChatGPT · Zirva
              </motion.p>
            </div>

          </motion.div>

          {/* ── Progress bar ── */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] rounded-r-full"
            style={{
              background: 'linear-gradient(90deg, #7B6EF6, #9B8FF8, #00C9A7)',
            }}
            initial={{ width: '0%' }}
            animate={{
              width:
                phase === 'out'  ? '100%' :
                phase === 'hold' ? '72%'  : '22%',
            }}
            transition={{ duration: phase === 'hold' ? 0.9 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  )
}
