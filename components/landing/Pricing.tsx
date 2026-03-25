// FILE: components/landing/Pricing.tsx
'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { CheckCircle, X, Star } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

interface PlanFeature {
  text: string
  included: boolean
}

interface Plan {
  name: string
  price: string
  priceSub: string
  popular: boolean
  features: PlanFeature[]
  cta: string
  href: string
}

const PLANS: Plan[] = [
  {
    name: 'Pulsuz',
    price: '0',
    priceSub: 'AZN/ay',
    popular: false,
    features: [
      { text: 'Ayda 5 SEO + SMO paketi',       included: true  },
      { text: 'URL axışı',                       included: true  },
      { text: 'Azerbaycanca + Rusca teqlər',     included: true  },
      { text: 'Bütün teq növləri',               included: true  },
      { text: 'Rəqib analizi',                   included: false },
      { text: 'JSON/HTML ixracı',                included: false },
    ],
    cta: 'Pulsuz Başla',
    href: '/signup',
  },
  {
    name: 'Pro',
    price: '79',
    priceSub: 'AZN/ay',
    popular: true,
    features: [
      { text: 'Ayda 50 SEO + SMO paketi',       included: true },
      { text: 'Bütün axışlar',                   included: true },
      { text: 'Azerbaycanca + Rusca teqlər',     included: true },
      { text: 'Bütün teq növləri',               included: true },
      { text: 'Rəqib analizi',                   included: true },
      { text: 'JSON/HTML ixracı',                included: true },
      { text: 'Prioritet dəstək',                included: true },
    ],
    cta: 'Pro-ya Keç',
    href: '/signup?plan=pro',
  },
  {
    name: 'Agency',
    price: '199',
    priceSub: 'AZN/ay',
    popular: false,
    features: [
      { text: 'Limitsiz SEO + SMO paketi',       included: true },
      { text: 'Pro-nun hər şeyi',                included: true },
      { text: 'Çoxlu sayt dəstəyi',              included: true },
      { text: 'API girişi (tezliklə)',            included: true },
      { text: 'Xüsusi hesabat',                  included: true },
      { text: 'Fərdi onboarding',                included: true },
    ],
    cta: 'Agency-yə Keç',
    href: '/signup?plan=agency',
  },
]

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="pricing" ref={ref} className="py-24" style={{ background: '#FFFFFF' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
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

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => {
            const isPro = plan.popular

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
                transition={{ ...SPRING, delay: 0.08 + i * 0.1 }}
                whileHover={{ y: -5 }}
              >
                {/* Populyar badge */}
                {isPro && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
                    style={{
                      background: '#FFFFFF',
                      color: '#7B6EF6',
                      boxShadow: '0 4px 14px rgba(123,110,246,0.3)',
                    }}
                  >
                    <Star size={11} fill="#7B6EF6" style={{ color: '#7B6EF6' }} strokeWidth={0} />
                    Populyar
                  </div>
                )}

                {/* Plan name */}
                <div className="mb-6">
                  <h3
                    className="font-display font-bold text-xl mb-4"
                    style={{ color: isPro ? '#FFFFFF' : '#0D0D1A' }}
                  >
                    {plan.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="font-display font-bold text-4xl"
                      style={{ color: isPro ? '#FFFFFF' : '#0D0D1A' }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: isPro ? 'rgba(255,255,255,0.7)' : '#737599' }}
                    >
                      {plan.priceSub}
                    </span>
                  </div>
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

                {/* CTA Button */}
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
      </div>
    </section>
  )
}
