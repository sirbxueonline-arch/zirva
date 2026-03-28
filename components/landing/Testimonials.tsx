// FILE: components/landing/Testimonials.tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Star } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

const AVATAR_COLORS = ['#7B6EF6', '#00C9A7', '#F25C54', '#F5A623', '#4285F4', '#E1306C']

const TESTIMONIALS = [
  {
    name: 'Nigar Əliyeva',
    initials: 'NƏ',
    role: 'Gözəllik salonu sahibi, Bakı',
    text: 'Zirva ilə bir həftədə Google-da #1 oldum. Əvvəl aylarca SEO agentliyinə pul verirdim — indi özüm edirəm.',
    stars: 5,
    avatarColor: AVATAR_COLORS[0],
  },
  {
    name: 'Rauf Hüseynov',
    initials: 'RH',
    role: 'Restoran sahibi, Gəncə',
    text: 'URL-i yapışdırdım, 30 saniyədə tam SEO paketi hazır oldu. İnanmadım, amma Google-da nəticəni gördüm.',
    stars: 5,
    avatarColor: AVATAR_COLORS[1],
  },
  {
    name: 'Leyla Quliyeva',
    initials: 'LQ',
    role: 'SMM mütəxəssisi, Bakı',
    text: 'Müştərilərimə Agency planı ilə istifadə edirəm. Hər biri nəticədən razıdır, heç kim ləğv etmir.',
    stars: 5,
    avatarColor: AVATAR_COLORS[2],
  },
  {
    name: 'Elnur Babayev',
    initials: 'EB',
    role: 'Hüquq bürosu direktoru, Sumqayıt',
    text: 'Schema markup-dan sonra Google biznesimizi düzgün tanıdı. Zənglər demək olar ki, dərhal artdı.',
    stars: 5,
    avatarColor: AVATAR_COLORS[3],
  },
  {
    name: 'Aytən Məmmədova',
    initials: 'AM',
    role: 'E-ticarət sahibi, Bakı',
    text: 'Avtopilot emailləri hər həftə saytımın vəziyyətini göstərir. Artıq SEO ilə bağlı heç nəyi qaçırmıram.',
    stars: 5,
    avatarColor: AVATAR_COLORS[4],
  },
  {
    name: 'Kamran İsayev',
    initials: 'Kİ',
    role: 'Veb developer, Bakı',
    text: 'Müştərilərimə Zirva ilə SEO xidməti göstərirəm. Eyni işi əvvəl 3 saata görürdüm, indi 5 dəqiqə.',
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
          Sahibkarlar Nə Deyir?
        </h2>
        <p className="text-lg" style={{ color: '#3D4060' }}>
          Bakı, Gəncə, Sumqayıtdan real istifadəçi rəyləri
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
