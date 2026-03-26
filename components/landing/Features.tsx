// FILE: components/landing/Features.tsx
'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  Calendar, FileText, Zap, LayoutGrid,
  Search, Bot, Link2, Code2, BookOpen,
  Mic2, Award, Megaphone, Users,
} from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

interface Feature {
  icon: React.ElementType
  iconColor: string
  iconBg: string
  title: string
  desc: string
}

interface Category {
  label: string
  badgeColor: string
  badgeBg: string
  accentBar: string
  features: Feature[]
}

const CATEGORIES: Category[] = [
  {
    label: 'Content & Publishing',
    badgeColor: '#7B6EF6',
    badgeBg: 'rgba(123,110,246,0.1)',
    accentBar: '#7B6EF6',
    features: [
      {
        icon: FileText,
        iconColor: '#7B6EF6',
        iconBg: 'rgba(123,110,246,0.1)',
        title: 'Daily Long-Form Articles',
        desc: 'A new SEO article written every morning. Approve, edit, or let it auto-publish — your choice.',
      },
      {
        icon: Calendar,
        iconColor: '#4285F4',
        iconBg: 'rgba(66,133,244,0.1)',
        title: 'Content Calendar',
        desc: 'Your full publishing schedule is auto-planned in seconds. Zirva follows it daily without reminders.',
      },
      {
        icon: Zap,
        iconColor: '#F5A623',
        iconBg: 'rgba(245,166,35,0.1)',
        title: 'Auto-Publish to Your CMS',
        desc: 'Content goes straight to your site — no copy-pasting, no manual uploads, no extra steps.',
      },
      {
        icon: LayoutGrid,
        iconColor: '#00C9A7',
        iconBg: 'rgba(0,201,167,0.1)',
        title: '30 to Unlimited Articles / Month',
        desc: 'Start with 30 articles a month and scale to unlimited as your content strategy grows.',
      },
    ],
  },
  {
    label: 'SEO & Optimization',
    badgeColor: '#00C9A7',
    badgeBg: 'rgba(0,201,167,0.1)',
    accentBar: '#00C9A7',
    features: [
      {
        icon: Search,
        iconColor: '#4285F4',
        iconBg: 'rgba(66,133,244,0.1)',
        title: 'Keyword Research',
        desc: 'Finds exactly what your target buyers search for and builds your entire content plan around those terms.',
      },
      {
        icon: Bot,
        iconColor: '#7B6EF6',
        iconBg: 'rgba(123,110,246,0.1)',
        title: 'Google + AI Optimization',
        desc: 'Every post scores 100/100 for SEO, targeting both Google rankings and ChatGPT / AI search results.',
      },
      {
        icon: Link2,
        iconColor: '#E1306C',
        iconBg: 'rgba(225,48,108,0.1)',
        title: 'Auto Linking',
        desc: 'Internal and external links are added automatically to strengthen relevance and trust signals.',
      },
      {
        icon: Code2,
        iconColor: '#F5A623',
        iconBg: 'rgba(245,166,35,0.1)',
        title: 'Technical SEO',
        desc: 'Meta descriptions, title tags, headings, keyword placement, and image alt text — all handled automatically.',
      },
      {
        icon: BookOpen,
        iconColor: '#00C9A7',
        iconBg: 'rgba(0,201,167,0.1)',
        title: 'Auto Research',
        desc: 'Before writing, Zirva checks what is currently ranking for your topic and builds a stronger outline based on that.',
      },
    ],
  },
  {
    label: 'Content Intelligence',
    badgeColor: '#F5A623',
    badgeBg: 'rgba(245,166,35,0.1)',
    accentBar: '#F5A623',
    features: [
      {
        icon: Mic2,
        iconColor: '#7B6EF6',
        iconBg: 'rgba(123,110,246,0.1)',
        title: 'Brand Voice Customisation',
        desc: 'Learns your tone, style, and terminology. Every post sounds exactly like you wrote it.',
      },
      {
        icon: Award,
        iconColor: '#F5A623',
        iconBg: 'rgba(245,166,35,0.1)',
        title: 'Trained on 10k+ Ranking Articles',
        desc: 'Built on patterns from content that already performs on Google — not generic templates, real ranking data.',
      },
      {
        icon: Megaphone,
        iconColor: '#E1306C',
        iconBg: 'rgba(225,48,108,0.1)',
        title: 'Auto Promotion',
        desc: 'Naturally mentions your business within articles so every post can drive sales, not just traffic.',
      },
      {
        icon: Users,
        iconColor: '#00C9A7',
        iconBg: 'rgba(0,201,167,0.1)',
        title: 'Audience Targeting',
        desc: 'Learns your customers\' pain points and builds content they actually care about reading.',
      },
    ],
  },
]

function FeatureCard({
  feature,
  delay,
  inView,
}: {
  feature: Feature
  delay: number
  inView: boolean
}) {
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
      whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(123,110,246,0.14)' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,110,246,0.3)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(123,110,246,0.1)'
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: feature.iconBg }}
      >
        <feature.icon size={20} style={{ color: feature.iconColor }} strokeWidth={2} />
      </div>
      <h4 className="font-semibold text-base mb-1.5" style={{ color: '#0D0D1A' }}>
        {feature.title}
      </h4>
      <p className="text-sm leading-relaxed" style={{ color: '#737599' }}>
        {feature.desc}
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
          className="text-center mb-20"
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING }}
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#0D0D1A' }}>
            Everything You Need to Rank
          </h2>
          <p className="text-lg" style={{ color: '#3D4060', maxWidth: '50ch', margin: '0 auto' }}>
            From keyword research to daily publishing — Zirva handles the full content pipeline automatically.
          </p>
        </motion.div>

        {/* Category sections */}
        <div className="space-y-20">
          {CATEGORIES.map((cat, catIdx) => (
            <div key={cat.label}>
              {/* Category label */}
              <motion.div
                className="flex items-center gap-3 mb-8"
                initial={{ x: -16, opacity: 0 }}
                animate={inView ? { x: 0, opacity: 1 } : {}}
                transition={{ ...SPRING, delay: catIdx * 0.1 }}
              >
                <div
                  className="w-1 h-6 rounded-full flex-shrink-0"
                  style={{ background: cat.accentBar }}
                />
                <span
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                  style={{ color: cat.badgeColor, background: cat.badgeBg }}
                >
                  {cat.label}
                </span>
              </motion.div>

              {/* Feature cards grid */}
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  cat.features.length === 5
                    ? 'lg:grid-cols-3'
                    : 'lg:grid-cols-4'
                } gap-5`}
              >
                {cat.features.map((feature, i) => (
                  <FeatureCard
                    key={feature.title}
                    feature={feature}
                    delay={catIdx * 0.08 + i * 0.06}
                    inView={inView}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
