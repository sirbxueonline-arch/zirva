// FILE: components/landing/Features.tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Bot, Tag, FileText, Share2, Code, Globe, BarChart2 } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

interface StandardCard {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  title: string
  desc: string
}

const STANDARD_CARDS: StandardCard[] = [
  {
    icon: Tag,
    iconColor: '#7B6EF6',
    iconBg: 'rgba(123,110,246,0.1)',
    title: 'Başlıq Teqi',
    desc: 'Google.az üçün 50–60 simvol, Azərbaycan + Rusca optimizasiya',
  },
  {
    icon: FileText,
    iconColor: '#4285F4',
    iconBg: 'rgba(66,133,244,0.1)',
    title: 'Meta Açıqlama',
    desc: '150–160 simvol, klik üçün yazılmış, açar sözlər daxil',
  },
  {
    icon: Share2,
    iconColor: '#E1306C',
    iconBg: 'rgba(225,48,108,0.1)',
    title: 'Open Graph & Twitter',
    desc: 'Sosial mediada paylaşım üçün mükəmməl görünüş',
  },
  {
    icon: Code,
    iconColor: '#F5A623',
    iconBg: 'rgba(245,166,35,0.1)',
    title: 'Schema Markup',
    desc: 'LocalBusiness, Restaurant, BeautySalon — JSON-LD formatında',
  },
  {
    icon: Globe,
    iconColor: '#00C9A7',
    iconBg: 'rgba(0,201,167,0.1)',
    title: 'Hreflang Teqləri',
    desc: 'az-AZ / ru-AZ / x-default — çoxdilli siqnallar',
  },
  {
    icon: BarChart2,
    iconColor: '#7B6EF6',
    iconBg: 'rgba(123,110,246,0.1)',
    title: 'SEO Balı (0–100)',
    desc: 'Real-vaxt keyfiyyət hesabı + inkişaf tövsiyələri',
  },
]

function HeroCard({ inView }: { inView: boolean }) {
  return (
    <motion.div
      className="relative w-full rounded-2xl p-8 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #7B6EF6 0%, #9B8FF8 100%)',
        boxShadow: '0 20px 60px rgba(123,110,246,0.35)',
        gridColumn: '1 / -1',
      }}
      initial={{ y: 30, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ ...SPRING, delay: 0.05 }}
      whileHover={{ y: -3, boxShadow: '0 28px 70px rgba(123,110,246,0.42)' }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      />
      <div
        className="absolute -bottom-10 right-40 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          <Bot size={28} style={{ color: '#FFFFFF' }} strokeWidth={1.8} />
        </div>
        <div className="flex-1">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold mb-2"
            style={{ background: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}
          >
            2025-ci ilin ən güclü strategiyası
          </div>
          <h3 className="font-display font-bold text-2xl md:text-3xl mb-2" style={{ color: '#FFFFFF' }}>
            ChatGPT + Google Optimallaşdırması
          </h3>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.82)', maxWidth: '62ch', lineHeight: 1.65 }}>
            Schema markup və strukturlu data ilə saytınız həm Google axtarışında, həm ChatGPT cavablarında 1-nci sırada görünsün. 2025-ci ilin ən güclü SEO strategiyası.
          </p>
        </div>
      </div>
    </motion.div>
  )
}

interface FeatureCardProps {
  card: StandardCard
  delay: number
  inView: boolean
}

function StandardFeatureCard({ card, delay, inView }: FeatureCardProps) {
  return (
    <motion.div
      className="group relative rounded-2xl p-6 cursor-default"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid rgba(123,110,246,0.1)',
        boxShadow: '0 2px 12px rgba(13,13,26,0.05)',
      }}
      initial={{ y: 24, opacity: 0 }}
      animate={inView ? { y: 0, opacity: 1 } : {}}
      transition={{ ...SPRING, delay }}
      whileHover={{
        y: -4,
        boxShadow: '0 12px 36px rgba(123,110,246,0.14)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,110,246,0.35)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,110,246,0.1)'
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: card.iconBg }}
      >
        <card.icon size={20} style={{ color: card.iconColor }} strokeWidth={2} />
      </div>
      <h3 className="font-semibold text-base mb-1.5" style={{ color: '#0D0D1A' }}>
        {card.title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: '#737599' }}>
        {card.desc}
      </p>
    </motion.div>
  )
}

export default function Features() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="py-24" style={{ background: '#F5F5FF' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0 }}
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#0D0D1A' }}>
            Zirva Nə Edir?
          </h2>
          <p className="text-lg" style={{ color: '#3D4060', maxWidth: '46ch', margin: '0 auto' }}>
            Bir kliklə tam SEO paketiniz hazır olsun
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Hero card — spans all columns */}
          <HeroCard inView={inView} />

          {/* Standard cards */}
          {STANDARD_CARDS.map((card, i) => (
            <StandardFeatureCard
              key={card.title}
              card={card}
              delay={0.12 + i * 0.07}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
