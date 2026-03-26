// FILE: components/landing/Pricing.tsx
'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Star } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

type Interval = 'monthly' | 'quarterly' | 'yearly'

interface PriceSet {
  display: string      // shown big
  original?: string    // crossed-out (only monthly has this)
  badge?: string       // e.g. "Save 25%"
  billing: string      // sub-label
}

interface Plan {
  name: string
  popular: boolean
  prices: Record<Interval, PriceSet>
  features: { text: string; included: boolean }[]
  cta: string
  href: string
}

const PLANS: Plan[] = [
  {
    name: 'Free',
    popular: false,
    prices: {
      monthly:   { display: '0',     billing: 'AZN / ay' },
      quarterly: { display: '0',     billing: 'AZN / ay' },
      yearly:    { display: '0',     billing: 'AZN / ay' },
    },
    features: [
      { text: '1 brend',                            included: true  },
      { text: 'Ayda 5 SEO paketi',                included: true  },
      { text: 'URL axışı',                       included: true  },
      { text: 'Azərbaycan dili teqləri',                 included: true  },
      { text: 'Bütün teq növləri',               included: true  },
      { text: 'Rəqib analizi',                   included: false },
      { text: 'JSON / HTML ixracı',              included: false },
    ],
    cta: 'Pulsuz Başla',
    href: '/signup',
  },
  {
    name: 'Pro',
    popular: true,
    prices: {
      monthly:   { display: '39.99', original: '79',  badge: '50% OFF',  billing: 'AZN / ay' },
      quarterly: { display: '33.99',                  badge: 'Save 15%', billing: 'AZN / ay, hər rüb ödənilir' },
      yearly:    { display: '27.99',                  badge: 'Save 30%', billing: 'AZN / ay, illik ödənilir' },
    },
    features: [
      { text: '10 brend',                          included: true },
      { text: 'Ayda 50 SEO paketi',         included: true },
      { text: 'Bütün axışlar',                   included: true },
      { text: 'AZ + RU + EN teqləri',            included: true },
      { text: 'Bütün teq növləri',               included: true },
      { text: 'Rəqib analizi',                   included: true },
      { text: 'JSON / HTML ixracı',              included: true },
      { text: 'Prioritet dəstək',                included: true },
    ],
    cta: 'Pro-ya Keç',
    href: '/signup?plan=pro',
  },
  {
    name: 'Agency',
    popular: false,
    prices: {
      monthly:   { display: '149.99', original: '299', badge: '50% OFF',  billing: 'AZN / ay' },
      quarterly: { display: '127.49',                  badge: 'Save 15%', billing: 'AZN / ay, hər rüb ödənilir' },
      yearly:    { display: '104.99',                  badge: 'Save 30%', billing: 'AZN / ay, illik ödənilir' },
    },
    features: [
      { text: '20 brend',                          included: true },
      { text: 'Limitsiz SEO paketi',       included: true },
      { text: 'Pro-nun hər şeyi',                included: true },
      { text: 'Çoxlu sayt idarəetməsi',          included: true },
      { text: 'API girişi (tezliklə)',            included: true },
      { text: 'Xüsusi hesabat',                  included: true },
      { text: 'Fərdi onboarding',                included: true },
    ],
    cta: 'Agency-yə Keç',
    href: '/signup?plan=agency',
  },
]

const TABS: { label: string; value: Interval }[] = [
  { label: 'Aylıq',   value: 'monthly'   },
  { label: 'Rüblük',  value: 'quarterly' },
  { label: 'İllik',   value: 'yearly'    },
]

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [interval, setInterval] = useState<Interval>('monthly')

  return (
    <section id="pricing" ref={ref} className="py-24" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0 }}
        >
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#0D0D1A' }}>
            Qiymətlər
          </h2>
          <p className="text-lg" style={{ color: '#3D4060' }}>
            Kiçik biznesdən agentliyə — hər ölçü üçün plan var
          </p>
        </motion.div>

        {/* Interval Toggle */}
        <motion.div
          className="flex justify-center mb-12"
          initial={{ y: 16, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0.08 }}
        >
          <div
            className="relative flex items-center p-1 rounded-xl gap-1"
            style={{ background: 'rgba(123,110,246,0.08)', border: '1px solid rgba(123,110,246,0.12)' }}
          >
            {TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setInterval(tab.value)}
                className="relative z-10 px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
                style={{
                  color: interval === tab.value ? '#FFFFFF' : '#737599',
                }}
              >
                {interval === tab.value && (
                  <motion.div
                    layoutId="tab-bg"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {tab.value === 'yearly' && (
                  <span
                    className="relative z-10 ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: interval === 'yearly' ? 'rgba(255,255,255,0.25)' : 'rgba(123,110,246,0.15)',
                      color:      interval === 'yearly' ? '#FFFFFF' : '#7B6EF6',
                    }}
                  >
                    Sərfəli
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>


        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => {
            const isPro = plan.popular
            const price = plan.prices[interval]

            return (
              <motion.div
                key={plan.name}
                className="relative rounded-2xl p-8 flex flex-col"
                style={
                  isPro
                    ? {
                        background: 'linear-gradient(160deg, #7B6EF6 0%, #9B8FF8 100%)',
                        boxShadow: '0 24px 64px rgba(123,110,246,0.35), 0 0 0 1px rgba(123,110,246,0.5)',
                      }
                    : {
                        background: '#FFFFFF',
                        border: '1.5px solid rgba(123,110,246,0.12)',
                        boxShadow: '0 4px 20px rgba(13,13,26,0.05)',
                      }
                }
                initial={{ y: 30, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ ...SPRING, delay: 0.12 + i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Popular badge */}
                {isPro && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                    style={{
                      background: '#FFFFFF',
                      color: '#7B6EF6',
                      boxShadow: '0 4px 14px rgba(123,110,246,0.3)',
                    }}
                  >
                    <Star size={11} fill="#7B6EF6" style={{ color: '#7B6EF6' }} strokeWidth={0} />
                    Ən Populyar
                  </div>
                )}

                {/* Plan name */}
                <h3
                  className="font-display font-bold text-xl mb-5"
                  style={{ color: isPro ? '#FFFFFF' : '#0D0D1A' }}
                >
                  {plan.name}
                </h3>

                {/* Price block */}
                <div className="mb-6">
                  {/* Original crossed-out price + discount badge */}
                  <AnimatePresence mode="wait">
                    {price.original && (
                      <motion.div
                        key={`orig-${interval}`}
                        className="flex items-center gap-2 mb-1"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span
                          className="text-lg font-semibold line-through"
                          style={{ color: isPro ? 'rgba(255,255,255,0.45)' : 'rgba(61,64,96,0.4)' }}
                        >
                          ₼{price.original}
                        </span>
                        {price.badge && (
                          <span
                            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                            style={{
                              background: isPro ? 'rgba(255,255,255,0.2)' : 'rgba(245,158,11,0.12)',
                              color:      isPro ? '#FFFFFF'                : '#D97706',
                            }}
                          >
                            {price.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                    {!price.original && price.badge && (
                      <motion.div
                        key={`badge-${interval}`}
                        className="flex items-center gap-2 mb-1"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span
                          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{
                            background: isPro ? 'rgba(255,255,255,0.2)' : 'rgba(0,201,167,0.12)',
                            color:      isPro ? '#FFFFFF'                : '#00A886',
                          }}
                        >
                          {price.badge}
                        </span>
                      </motion.div>
                    )}
                    {!price.original && !price.badge && <div key="spacer" className="mb-1 h-5" />}
                  </AnimatePresence>

                  {/* Main price */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`price-${interval}-${plan.name}`}
                      className="flex items-baseline gap-1"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      {plan.name !== 'Free' && (
                        <span
                          className="text-2xl font-bold"
                          style={{ color: isPro ? 'rgba(255,255,255,0.7)' : '#737599' }}
                        >
                          ₼
                        </span>
                      )}
                      <span
                        className="font-display font-bold text-5xl"
                        style={{ color: isPro ? '#FFFFFF' : '#0D0D1A' }}
                      >
                        {price.display}
                      </span>
                    </motion.div>
                  </AnimatePresence>

                  <p
                    className="text-xs font-medium mt-1"
                    style={{ color: isPro ? 'rgba(255,255,255,0.55)' : '#9B9EBB' }}
                  >
                    {price.billing}
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="mb-6"
                  style={{
                    height: 1,
                    background: isPro ? 'rgba(255,255,255,0.2)' : 'rgba(123,110,246,0.1)',
                  }}
                />

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f.text} className="flex items-center gap-3 text-sm">
                      {f.included ? (
                        <CheckCircle
                          size={16}
                          strokeWidth={2}
                          style={{ color: isPro ? 'rgba(255,255,255,0.9)' : '#00C9A7', flexShrink: 0 }}
                        />
                      ) : (
                        <X
                          size={16}
                          strokeWidth={2}
                          style={{ color: isPro ? 'rgba(255,255,255,0.3)' : '#C4C6D8', flexShrink: 0 }}
                        />
                      )}
                      <span
                        style={{
                          color: f.included
                            ? isPro ? 'rgba(255,255,255,0.92)' : '#3D4060'
                            : isPro ? 'rgba(255,255,255,0.35)' : '#9B9EBB',
                        }}
                      >
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className="block text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02]"
                  style={
                    isPro
                      ? {
                          background: '#FFFFFF',
                          color: '#7B6EF6',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                        }
                      : {
                          background: 'transparent',
                          border: '1.5px solid rgba(123,110,246,0.3)',
                          color: '#7B6EF6',
                        }
                  }
                >
                  {plan.cta}
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          className="text-center text-sm mt-10"
          style={{ color: '#9B9EBB' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          Müqavilə yoxdur. İstənilən vaxt ləğv edin. Bütün qiymətlər AZN ilə göstərilir.
        </motion.p>
      </div>
    </section>
  )
}
