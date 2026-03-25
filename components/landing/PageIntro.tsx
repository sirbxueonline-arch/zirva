'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORD = 'Zirva'

export default function PageIntro() {
  const [visible, setVisible]   = useState(true)
  const [phase,   setPhase]     = useState<'build' | 'hold' | 'out'>('build')

  useEffect(() => {
    if (sessionStorage.getItem('zirva_intro_seen')) {
      setVisible(false)
      return
    }
    // build (letters reveal) → hold → out (content dissolves) → overlay lifts
    const t1 = setTimeout(() => setPhase('hold'), 1100)
    const t2 = setTimeout(() => setPhase('out'),  2100)
    const t3 = setTimeout(() => {
      setVisible(false)
      sessionStorage.setItem('zirva_intro_seen', '1')
    }, 3000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: '#06061A' }}
          exit={{ y: '-100%', transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
        >
          {/* ── radial glow that builds up ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(123,110,246,0.22) 0%, transparent 70%)',
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* teal bottom-right accent */}
          <motion.div
            className="absolute pointer-events-none"
            style={{
              width: 500, height: 500,
              bottom: '-10%', right: '-5%',
              background: 'radial-gradient(circle, rgba(0,201,167,0.13) 0%, transparent 65%)',
              filter: 'blur(20px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === 'hold' ? 1 : 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* ── wordmark ── */}
          <motion.div
            className="relative z-10 flex flex-col items-center select-none"
            animate={{ opacity: phase === 'out' ? 0 : 1, y: phase === 'out' ? -12 : 0 }}
            transition={{ duration: 0.55, ease: 'easeInOut' }}
          >
            {/* each letter is in an overflow-hidden clip so it "rises" into view */}
            <div className="flex items-end justify-center gap-[0.01em]">
              {WORD.split('').map((char, i) => (
                <div key={i} style={{ overflow: 'hidden', lineHeight: 1, paddingBottom: '0.06em' }}>
                  <motion.span
                    className="block font-display font-bold"
                    style={{
                      fontSize: 'clamp(64px, 12vw, 100px)',
                      lineHeight: 1,
                      background: 'linear-gradient(160deg, #FFFFFF 10%, #D4CEFF 55%, #7B6EF6 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 48px rgba(123,110,246,0.55))',
                    }}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{
                      duration: 0.75,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.1 + i * 0.07,
                    }}
                  >
                    {char}
                  </motion.span>
                </div>
              ))}
            </div>

            {/* accent line — draws left → right */}
            <motion.div
              className="mt-4 rounded-full"
              style={{
                height: 2,
                background: 'linear-gradient(90deg, transparent, #7B6EF6, #00C9A7, transparent)',
              }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: phase !== 'build' ? 200 : 0, opacity: phase !== 'build' ? 1 : 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* tagline */}
            <div style={{ overflow: 'hidden', marginTop: 14 }}>
              <motion.p
                className="text-xs font-semibold tracking-[0.32em] uppercase"
                style={{ color: 'rgba(255,255,255,0.32)' }}
                initial={{ y: '120%' }}
                animate={{ y: phase !== 'build' ? '0%' : '120%' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              >
                Google · ChatGPT · Zirva
              </motion.p>
            </div>
          </motion.div>

          {/* ── progress bar ── */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, #7B6EF6, #9B8FF8, #00C9A7)',
              borderRadius: '0 2px 2px 0',
            }}
            initial={{ width: '0%' }}
            animate={{
              width: phase === 'out' ? '100%' : phase === 'hold' ? '70%' : '25%',
            }}
            transition={{ duration: phase === 'hold' ? 0.8 : 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
