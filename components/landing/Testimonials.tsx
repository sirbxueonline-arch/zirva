// FILE: components/landing/Testimonials.tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

const AVATAR_COLORS = ['#7B6EF6', '#00C9A7', '#F25C54', '#F5A623', '#4285F4', '#E1306C']

const TESTIMONIALS = [
  {
    name: 'Aynur Həsənova',
    initials: 'AH',
    role: 'Bakı Gözəllik Salonu sahibi',
    text: 'Zirva sayəsində Google-da ilk səhifəyə çıxdım. Əvvəl heç axtarışda görünmürdüm.',
    stars: 5,
    avatarColor: AVATAR_COLORS[0],
  },
  {
    name: 'Rauf Əliyev',
    initials: 'RƏ',
    role: 'E-ticarət Müdiri, Bakı',
    text: '5 dəqiqəyə tam SEO paketi. Agentliyə verirdiyim pulu üç dəfə azaltdım.',
    stars: 5,
    avatarColor: AVATAR_COLORS[1],
  },
  {
    name: 'Nigar Məmmədova',
    initials: 'NM',
    role: 'SMM Mütəxəssisi',
    text: 'Müştərilər üçün sürətlə hazırlayıram. Agency planı bizim üçün çox sərfəlidir.',
    stars: 5,
    avatarColor: AVATAR_COLORS[2],
  },
  {
    name: 'Tural Babayev',
    initials: 'TB',
    role: 'Restoran sahibi, Sumqayıt',
    text: 'Rusca SEO-ya ehtiyacım vardı. Zirva həm Azerbaycanca, həm Rusca verir.',
    stars: 5,
    avatarColor: AVATAR_COLORS[3],
  },
  {
    name: 'Leyla Quliyeva',
    initials: 'LQ',
    role: 'Hüquq Firması, Bakı',
    text: 'Schema markup-ı Google-a nə olduğumu başa saldı. Ziyarətçi sayı ikiqat artdı.',
    stars: 5,
    avatarColor: AVATAR_COLORS[4],
  },
  {
    name: 'Kamran İsmayılov',
    initials: 'Kİ',
    role: 'Web Developer',
    text: 'Müştərilərimə Agency ilə istifadə edirəm. Hər biri razıdır.',
    stars: 5,
    avatarColor: AVATAR_COLORS[5],
  },
]

type Testimonial = typeof TESTIMONIALS[0]

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="flex-shrink-0 w-80 rounded-2xl p-6 mx-3 cursor-default"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid rgba(123,110,246,0.1)',
        boxShadow: '0 4px 20px rgba(13,13,26,0.06)',
      }}
    >
      {/* Decorative quote mark */}
      <div
        className="font-display font-bold text-6xl leading-none mb-1 select-none"
        style={{ color: 'rgba(123,110,246,0.15)', lineHeight: 0.9 }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {Array.from({ length: t.stars }).map((_, i) => (
          <Star
            key={i}
            size={14}
            strokeWidth={0}
            fill="#F5A623"
            style={{ color: '#F5A623' }}
          />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#3D4060' }}>
        {t.text}
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ background: t.avatarColor }}
        >
          {t.initials}
        </div>
        <div>
          <div className="font-semibold text-sm" style={{ color: '#0D0D1A' }}>{t.name}</div>
          <div className="text-xs mt-0.5" style={{ color: '#737599' }}>{t.role}</div>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section ref={ref} className="py-24 overflow-hidden" style={{ background: '#F5F5FF' }}>
      {/* Heading */}
      <motion.div
        className="text-center mb-14 px-6"
        initial={{ y: 24, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ ...SPRING, delay: 0 }}
      >
        <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#0D0D1A' }}>
          İstifadəçilər Nə Deyir?
        </h2>
        <p className="text-lg" style={{ color: '#3D4060' }}>
          Azərbaycanlı sahibkarların real nəticələri
        </p>
      </motion.div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-4">
        <div
          className="flex"
          style={{
            width: 'max-content',
            animation: 'marquee 38s linear infinite',
          }}
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {doubled.map((t, i) => (
            <TestimonialCard key={`r1-${i}`} t={t} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        <div
          className="flex"
          style={{
            width: 'max-content',
            animation: 'marquee-reverse 32s linear infinite',
          }}
          onMouseEnter={e => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={e => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {[...doubled].reverse().map((t, i) => (
            <TestimonialCard key={`r2-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
