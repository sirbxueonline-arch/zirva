'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Rocket, ArrowRight } from 'lucide-react'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
}

export default function UpgradeModal({ open, onClose }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl border p-8"
              style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.3)' }}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="float-right p-1.5 rounded-lg transition-colors"
                style={{ color: '#9B9EBB' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0D0D1A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9B9EBB')}
                aria-label="Bağla"
              >
                <X size={16} strokeWidth={2} />
              </button>

              <div className="text-center pt-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(123,110,246,0.1)', border: '1px solid rgba(123,110,246,0.2)' }}>
                  <Rocket size={24} strokeWidth={1.5} style={{ color: '#7B6EF6' }} />
                </div>
                <h2 className="font-display font-bold text-2xl text-text-primary mb-2">
                  Limitiniz dolub
                </h2>
                <p className="text-text-secondary text-sm mb-8">
                  Bu ay üçün pulsuz limitiniz bitdi. Pro plana keçin —
                  aylıq 200 SEO paketi, rəqib analizi, JSON/HTML ixracı.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div
                    className="rounded-xl border p-4 text-center"
                    style={{ borderColor: 'rgba(123,110,246,0.3)' }}
                  >
                    <div className="font-display font-bold text-xl text-primary mb-1">Pro</div>
                    <div className="text-text-primary font-bold mb-1">79 AZN/ay</div>
                    <div className="text-text-muted text-xs">200 paket/ay</div>
                  </div>
                  <div
                    className="rounded-xl border p-4 text-center"
                    style={{ borderColor: 'rgba(0,201,167,0.3)' }}
                  >
                    <div className="font-display font-bold text-xl text-success mb-1">Agency</div>
                    <div className="text-text-primary font-bold mb-1">199 AZN/ay</div>
                    <div className="text-text-muted text-xs">Limitsiz</div>
                  </div>
                </div>

                <Link
                  href="/settings/billing"
                  className="flex items-center justify-center gap-2 w-full text-white py-3 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                  style={{ background: '#7B6EF6', boxShadow: '0 4px 14px rgba(123,110,246,0.28)' }}
                >
                  Pro-ya Keç <ArrowRight size={14} strokeWidth={2.5} />
                </Link>
                <button
                  onClick={onClose}
                  className="mt-3 text-text-muted text-sm hover:text-text-secondary transition-colors"
                >
                  Sonra
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
