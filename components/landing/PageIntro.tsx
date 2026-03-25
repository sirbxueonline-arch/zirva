'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LETTERS = 'Zirva'.split('')

export default function PageIntro() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out' | 'done'>('in')

  useEffect(() => {
    // Skip replay within the same session
    if (sessionStorage.getItem('zirva_intro_seen')) {
      setPhase('done')
      return
    }

    // Letters animate in → hold → curtain lifts
    const t1 = setTimeout(() => setPhase('hold'), 900)
    const t2 = setTimeout(() => setPhase('out'),  1500)
    const t3 = setTimeout(() => {
      setPhase('done')
      sessionStorage.setItem('zirva_intro_seen', '1')
    }, 2200)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (phase === 'done') return null

  return (
    <AnimatePresence>
      <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          style={{ background: '#0D0D1A' }}
          exit={{
            y: '-100%',
            transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Ambient glow — pulses while visible */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 480, height: 480,
              background: 'radial-gradient(circle, rgba(123,110,246,0.22) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
            animate={{ scale: [0.8, 1.15, 0.95, 1.05, 1], opacity: [0, 1, 0.85, 1, 0.9] }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />

          {/* Second orb — teal accent */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 280, height: 280,
              background: 'radial-gradient(circle, rgba(0,201,167,0.14) 0%, transparent 70%)',
              filter: 'blur(50px)',
              top: '55%', left: '55%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'hold' ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Logo */}
          <div className="relative z-10 text-center select-none">
            {/* Letters stagger in */}
            <div className="flex items-end justify-center gap-[0.03em] mb-4">
              {LETTERS.map((char, i) => (
                <motion.span
                  key={i}
                  className="font-display font-bold"
                  style={{
                    fontSize: 'clamp(56px, 10vw, 80px)',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #FFFFFF 30%, #C4BCFF 70%, #7B6EF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                  }}
                  initial={{ y: 30, opacity: 0, rotateX: 40 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 22,
                    delay: 0.1 + i * 0.07,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Tagline */}
            <motion.p
              className="text-sm font-medium tracking-[0.22em] uppercase"
              style={{ color: 'rgba(255,255,255,0.38)' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase !== 'in' ? 1 : 0, y: phase !== 'in' ? 0 : 8 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              Google · ChatGPT · Zirva
            </motion.p>

            {/* Thin accent line under wordmark */}
            <motion.div
              className="mx-auto mt-5 rounded-full"
              style={{ height: 2, background: 'linear-gradient(90deg, transparent, #7B6EF6, #00C9A7, transparent)' }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: phase !== 'in' ? 160 : 0, opacity: phase !== 'in' ? 1 : 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            />
          </div>

          {/* Progress bar at very bottom */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] rounded-full"
            style={{ background: 'linear-gradient(90deg, #7B6EF6, #00C9A7)' }}
            initial={{ width: '0%' }}
            animate={{ width: phase === 'out' ? '100%' : phase === 'hold' ? '70%' : '30%' }}
            transition={{ duration: phase === 'hold' ? 0.6 : phase === 'out' ? 0.5 : 0.8, ease: 'easeInOut' }}
          />
        </motion.div>
    </AnimatePresence>
  )
}
