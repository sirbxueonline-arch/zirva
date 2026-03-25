// FILE: components/landing/CTABanner.tsx
'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Zap, ArrowRight, Play } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

const AVATAR_COLORS = ['#7B6EF6', '#00C9A7', '#F25C54', '#F5A623', '#9B8FF8']
const AVATAR_INITIALS = ['A', 'R', 'N', 'T', 'L']

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #7B6EF6 0%, #9B8FF8 60%, #00C9A7 100%)',
      }}
    >
      {/* Decorative blurred circles */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 480,
          height: 480,
          background: 'rgba(255,255,255,0.06)',
          top: '-20%',
          left: '-10%',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 360,
          height: 360,
          background: 'rgba(0,0,0,0.08)',
          bottom: '-15%',
          right: '-8%',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200,
          height: 200,
          background: 'rgba(255,255,255,0.05)',
          top: '30%',
          right: '20%',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 20%, transparent 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold mb-7"
          style={{
            background: 'rgba(255,255,255,0.18)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#FFFFFF',
            backdropFilter: 'blur(8px)',
          }}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.05 }}
        >
          <Zap size={13} strokeWidth={2.5} />
          Pulsuz başla
        </motion.div>

        {/* Heading */}
        <motion.h2
          className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-5"
          style={{ color: '#FFFFFF', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.12 }}
        >
          Saytınız bu gün Google-da 1-nci ola bilər
        </motion.h2>

        {/* Subtext */}
        <motion.p
          className="text-lg mb-10"
          style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '44ch', margin: '0 auto 2.5rem' }}
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.2 }}
        >
          Kredit kartı tələb olunmur. 30 saniyədə başlayın.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.28 }}
        >
          <Link
            href="/signup"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold transition-all duration-200 hover:scale-[1.03]"
            style={{
              background: '#FFFFFF',
              color: '#7B6EF6',
              boxShadow: '0 8px 28px rgba(0,0,0,0.18)',
            }}
          >
            <Zap size={16} strokeWidth={2.5} />
            İndi Başla — Pulsuzdur
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>

          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.4)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Play size={15} strokeWidth={2.5} />
            Demo baxın
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="flex items-center justify-center gap-3"
          initial={{ y: 16, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.36 }}
        >
          {/* Avatar stack */}
          <div className="flex -space-x-2.5">
            {AVATAR_COLORS.map((color, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: color,
                  borderColor: 'rgba(255,255,255,0.5)',
                  zIndex: 5 - i,
                }}
              >
                {AVATAR_INITIALS[i]}
              </div>
            ))}
          </div>
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
            <span className="font-bold">500+</span> Azərbaycanlı sahibkar artıq istifadə edir
          </p>
        </motion.div>
      </div>
    </section>
  )
}
