'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => {
    return scrollY.on('change', v => setScrolled(v > 20))
  }, [scrollY])

  const navLinks = [
    { label: 'Necə işləyir', href: '#how-it-works' },
    { label: 'Qiymətlər',    href: '#pricing' },
    { label: 'FAQ',          href: '#faq' },
  ]

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        animate={{
          backgroundColor: scrolled ? 'rgba(7,7,26,0.88)' : 'rgba(7,7,26,0)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(0px)',
        }}
        style={{ borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-display font-bold text-2xl tracking-tight" style={{ color: '#FFFFFF' }}>
            Zirva
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.55)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium transition-colors"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Daxil Ol
            </Link>
            <Link
              href="/signup"
              className="bg-primary hover:bg-primary-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.03] flex items-center gap-1.5"
            >
              Pulsuz başla <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Menyu"
          >
            <motion.span
              className="block w-6 h-0.5 bg-text-primary rounded-full"
              animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 8 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-text-primary rounded-full"
              animate={{ opacity: mobileOpen ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="block w-6 h-0.5 bg-text-primary rounded-full"
              animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -8 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-x-0 top-16 z-40 bg-surface border-b border-white/5 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-text-secondary hover:text-text-primary py-3 px-4 rounded-lg hover:bg-surface-hover transition-colors text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-white/5 mt-2 pt-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="text-center py-3 px-4 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors text-sm font-medium"
                  onClick={() => setMobileOpen(false)}
                >
                  Daxil Ol
                </Link>
                <Link
                  href="/signup"
                  className="text-center bg-primary hover:bg-primary-hover text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Pulsuz başla <ArrowRight size={13} strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
