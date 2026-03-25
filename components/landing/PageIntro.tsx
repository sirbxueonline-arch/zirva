'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LETTERS = 'Zirva'.split('')

export default function PageIntro() {
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')

  useEffect(() => {
    if (sessionStorage.getItem('zirva_intro_seen')) {
      setVisible(false)
      return
    }

    // in → hold → out (content fades) → visible=false (triggers exit slide-up)
    const t1 = setTimeout(() => setPhase('hold'), 1000)
    const t2 = setTimeout(() => setPhase('out'),  1800)
    const t3 = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('zirva_intro_seen', '1')
    }, 2800) // exit animation is 0.9s, fires at 1.9s → done at 2.8s

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
          style={{ background: '#0D0D1A' }}
          exit={{
            y: '-100%',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Ambient purple glow */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 560, height: 560,
              background: 'radial-gradient(circle, rgba(123,110,246,0.26) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: [0.7, 1.1, 0.95, 1.05, 1], opacity: [0, 1, 0.85, 1, 0.95] }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />

          {/* Teal accent orb */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: 320, height: 320,
              background: 'radial-gradient(circle, rgba(0,201,167,0.18) 0%, transparent 70%)',
              filter: 'blur(60px)',
              top: '52%', left: '54%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'hold' ? 1 : 0 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          />

          {/* Soft grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />

          {/* Logo + tagline */}
          <motion.div
            className="relative z-10 text-center select-none"
            animate={{ opacity: phase === 'out' ? 0 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Letter stagger */}
            <div className="flex items-end justify-center gap-[0.02em] mb-5">
              {LETTERS.map((char, i) => (
                <motion.span
                  key={i}
                  className="font-display font-bold"
                  style={{
                    fontSize: 'clamp(60px, 11vw, 88px)',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #FFFFFF 20%, #C4BCFF 60%, #7B6EF6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                    filter: 'drop-shadow(0 0 40px rgba(123,110,246,0.5))',
                  }}
                  initial={{ y: 40, opacity: 0, rotateX: 50, scale: 0.85 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 18,
                    delay: 0.1 + i * 0.08,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* Accent line */}
            <motion.div
              className="mx-auto rounded-full"
              style={{
                height: 2,
                background: 'linear-gradient(90deg, transparent, #7B6EF6, #00C9A7, transparent)',
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: phase !== 'in' ? 180 : 0,
                opacity: phase !== 'in' ? 1 : 0,
              }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            />

            {/* Tagline */}
            <motion.p
              className="mt-4 text-sm font-medium tracking-[0.28em] uppercase"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: phase !== 'in' ? 1 : 0,
                y: phase !== 'in' ? 0 : 10,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              Google · ChatGPT · Zirva
            </motion.p>
          </motion.div>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, #7B6EF6, #9B8FF8, #00C9A7)',
              borderRadius: '0 2px 2px 0',
            }}
            initial={{ width: '0%' }}
            animate={{
              width: phase === 'out' ? '100%' : phase === 'hold' ? '68%' : '28%',
            }}
            transition={{
              duration: phase === 'hold' ? 0.7 : phase === 'out' ? 0.55 : 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Shimmer line at top of exit — slides up with the curtain */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px] pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(123,110,246,0.6), rgba(0,201,167,0.6), transparent)' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
