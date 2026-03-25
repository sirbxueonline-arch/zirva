// FILE: components/landing/Footer.tsx
'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

export default function Footer() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.footer
      ref={ref}
      className="border-t py-16 px-6"
      style={{
        borderColor: 'rgba(123,110,246,0.12)',
        background: '#FFFFFF',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...SPRING, delay: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">

          {/* Col 1-2: Brand */}
          <div className="md:col-span-2">
            <div
              className="font-display font-bold text-2xl mb-3"
              style={{ color: '#7B6EF6' }}
            >
              Zirva
            </div>
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: '#3D4060', maxWidth: '32ch' }}
            >
              Google-da da. ChatGPT-də də. İkisini birlikdə tutun.
            </p>
            <p className="text-xs" style={{ color: '#737599' }}>
              Azərbaycan bazarı üçün hazırlanmış SEO həlli.
            </p>
          </div>

          {/* Col 3: Product */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#737599' }}
            >
              Məhsul
            </div>
            <ul className="space-y-2.5">
              {[
                { label: 'Necə işləyir', href: '#how-it-works' },
                { label: 'Qiymətlər',   href: '#pricing' },
                { label: 'FAQ',         href: '#faq' },
              ].map(l => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: '#3D4060' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0D0D1A')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#3D4060')}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: '#737599' }}
            >
              Əlaqə
            </div>
            <ul className="space-y-2.5">
              {[
                { label: 'Məxfilik Siyasəti', href: '/privacy', isLink: true },
                { label: 'İstifadə Şərtləri', href: '/terms', isLink: true },
              ].map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm transition-colors duration-150"
                    style={{ color: '#3D4060' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#0D0D1A')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#3D4060')}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:hello@tryzirva.com"
                  className="text-sm transition-colors duration-150"
                  style={{ color: '#3D4060' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#7B6EF6')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#3D4060')}
                >
                  hello@tryzirva.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t gap-3"
          style={{ borderColor: 'rgba(123,110,246,0.1)' }}
        >
          <p className="text-sm" style={{ color: '#737599' }}>
            &copy; 2025 Zirva. Bütün hüquqlar qorunur.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}
