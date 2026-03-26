'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
  loading?: boolean
}

export default function ConfirmModal({
  open, title, message, confirmLabel = 'Sil',
  onConfirm, onCancel, danger = true, loading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="pointer-events-auto w-full max-w-sm rounded-2xl p-6 shadow-xl"
              style={{ background: '#FFFFFF', border: '1px solid rgba(123,110,246,0.12)' }}
              initial={{ scale: 0.93, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: danger ? 'rgba(242,92,84,0.1)' : 'rgba(123,110,246,0.1)' }}
                >
                  <AlertTriangle size={18} strokeWidth={2} style={{ color: danger ? '#F25C54' : '#7B6EF6' }} />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">{title}</h3>
                  <p className="text-sm text-text-muted">{message}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onCancel}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50 disabled:opacity-50"
                  style={{ borderColor: 'rgba(123,110,246,0.2)', color: '#737599' }}
                >
                  Ləğv et
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{
                    background: danger ? '#F25C54' : '#7B6EF6',
                    boxShadow: danger ? '0 4px 12px rgba(242,92,84,0.25)' : '0 4px 12px rgba(123,110,246,0.25)',
                  }}
                >
                  {loading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
