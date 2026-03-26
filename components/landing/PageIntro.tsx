'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageIntro() {
  const [visible, setVisible]   = useState(true)
  const [rank,    setRank]      = useState(10)
  const [phase,   setPhase]     = useState<'count' | 'final' | 'out'>('count')

  useEffect(() => {
    if (sessionStorage.getItem('zirva_intro_seen')) {
      setVisible(false)
      return
    }

    // Tick 10 → 1 quickly (every 80ms)
    let current = 10
    const tick = setInterval(() => {
      current -= 1
      setRank(current)
      if (current <= 1) {
        clearInterval(tick)
        setTimeout(() => setPhase('final'), 80)
        setTimeout(() => setPhase('out'),   1600)
        setTimeout(() => {
          setVisible(false)
          sessionStorage.setItem('zirva_intro_seen', '1')
        }, 2300)
      }
    }, 80)

    return () => clearInterval(tick)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden select-none"
          style={{ background: '#FFFFFF' }}
          exit={{
            y: -40,
            opacity: 0,
            transition: { duration: 0.55, ease: [0.4, 0, 0.6, 1] },
          }}
        >
          {/* Subtle dot grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(123,110,246,0.12) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black 10%, transparent 100%)',
            }}
          />

          {/* Soft purple glow center */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: 500, height: 500,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(123,110,246,0.08) 0%, transparent 70%)',
            }}
          />

          <motion.div
            className="relative z-10 flex flex-col items-center gap-0"
            animate={{
              opacity: phase === 'out' ? 0 : 1,
              y:       phase === 'out' ? -20 : 0,
            }}
            transition={{ duration: 0.38, ease: 'easeIn' }}
          >
            {/* Rank number */}
            <div className="relative flex items-start justify-center" style={{ height: 'clamp(80px, 16vw, 130px)' }}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={rank}
                  className="font-display font-bold absolute"
                  style={{
                    fontSize: 'clamp(80px, 16vw, 130px)',
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                    color: phase === 'final'
                      ? 'transparent'
                      : rank <= 3
                        ? '#7B6EF6'
                        : '#E5E7EB',
                    background: phase === 'final'
                      ? 'linear-gradient(135deg, #7B6EF6 0%, #00C9A7 100%)'
                      : 'none',
                    WebkitBackgroundClip: phase === 'final' ? 'text' : 'unset',
                    WebkitTextFillColor: phase === 'final' ? 'transparent' : 'unset',
                    backgroundClip: phase === 'final' ? 'text' : 'unset',
                    filter: phase === 'final' ? 'drop-shadow(0 0 32px rgba(123,110,246,0.35))' : 'none',
                    transition: 'color 0.15s, filter 0.3s',
                  }}
                  initial={{ y: 28, opacity: 0, scale: 0.85 }}
                  animate={{ y: 0,  opacity: 1, scale: 1 }}
                  exit={{    y: -20, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  {phase === 'final' ? '#1' : rank}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Zirva wordmark — appears at final */}
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: phase === 'final' ? 1 : 0,
                y:       phase === 'final' ? 0  : 10,
              }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              {/* Accent line */}
              <motion.div
                className="rounded-full mb-4"
                style={{
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #7B6EF6 30%, #00C9A7 70%, transparent)',
                }}
                initial={{ width: 0 }}
                animate={{ width: phase === 'final' ? 180 : 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              />

              <span
                className="font-display font-bold block"
                style={{
                  fontSize: 'clamp(28px, 5vw, 40px)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: '#0D0D1A',
                }}
              >
                Zirva
              </span>

              <p
                className="text-xs font-semibold tracking-[0.25em] uppercase mt-2"
                style={{ color: '#B0B3CC' }}
              >
                Google · ChatGPT
              </p>
            </motion.div>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] rounded-r-full"
            style={{
              background: 'linear-gradient(90deg, #7B6EF6, #9B8FF8, #00C9A7)',
            }}
            initial={{ width: '0%' }}
            animate={{
              width:
                phase === 'out'   ? '100%' :
                phase === 'final' ? '80%'  : `${(10 - rank) * 8}%`,
            }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
