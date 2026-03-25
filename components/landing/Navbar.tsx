'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { ArrowRight, X, Menu } from 'lucide-react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const { scrollY } = useScroll()

  useEffect(() => scrollY.on('change', v => setScrolled(v > 24)), [scrollY])

  // lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const navLinks = [
    { label: 'Necə işləyir', href: '#how-it-works' },
    { label: 'Qiymətlər',    href: '#pricing'      },
    { label: 'FAQ',          href: '#faq'           },
  ]

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50"
        animate={{
          backgroundColor: scrolled ? 'rgba(6,6,26,0.92)' : 'rgba(6,6,26,0)',
          backdropFilter:   scrolled ? 'blur(20px)'        : 'blur(0px)',
        }}
        transition={{ duration: 0.2 }}
        style={{ borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent' }}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="font-display font-bold text-xl tracking-tight flex-shrink-0"
            style={{ color: '#FFFFFF' }}
          >
            Zirva
          </Link>

          {/* Desktop links — centred */}
          <div className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: 'rgba(255,255,255,0.5)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium transition-colors duration-150"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            >
              Daxil ol
            </Link>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-2 rounded-lg transition-all duration-150 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)',
                boxShadow: '0 0 0 1px rgba(123,110,246,0.4)',
              }}
            >
              Pulsuz başla <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
            style={{ color: '#fff', background: mobileOpen ? 'rgba(255,255,255,0.1)' : 'transparent' }}
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menyu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col"
              style={{ background: '#0E0E28', borderLeft: '1px solid rgba(255,255,255,0.07)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-16 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <span className="font-display font-bold text-lg text-white">Zirva</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col px-4 py-4 gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>

              {/* Bottom CTAs */}
              <div className="px-4 pb-8 flex flex-col gap-3 border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <Link
                  href="/login"
                  className="text-center py-3 rounded-xl text-sm font-medium transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Daxil ol
                </Link>
                <Link
                  href="/signup"
                  className="text-center py-3 rounded-xl text-sm font-bold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)', boxShadow: '0 4px 20px rgba(123,110,246,0.4)' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Pulsuz başla →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
