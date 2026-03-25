'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

/* #12 — icon + color both communicate state */
const STYLES = {
  success: { bg: 'rgba(0,201,167,0.1)',   border: 'rgba(0,201,167,0.22)',  color: '#007A63', Icon: CheckCircle },
  error:   { bg: 'rgba(242,92,84,0.1)',   border: 'rgba(242,92,84,0.22)',  color: '#C23B34', Icon: XCircle    },
  info:    { bg: 'rgba(123,110,246,0.1)', border: 'rgba(123,110,246,0.22)',color: '#5748C8', Icon: Info       },
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const s = STYLES[type]

  return (
    <motion.div
      role="alert"
      aria-live="polite"
      className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm shadow-lg"
      style={{ background: s.bg, borderColor: s.border, minWidth: '220px', maxWidth: '340px' }}
      /* #29 — fast spring, under 300ms */
      initial={{ x: 56, opacity: 0, scale: 0.95 }}
      animate={{ x: 0,  opacity: 1, scale: 1    }}
      exit={{    x: 56, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
    >
      {/* #12 — icon makes type unmistakable without relying on color alone */}
      <s.Icon size={16} strokeWidth={2} style={{ color: s.color, flexShrink: 0 }} />
      {/* #11 — message in high-contrast primary text, not the accent color */}
      <span className="flex-1 font-medium" style={{ color: '#0D0D1A' }}>{message}</span>
      {/* #16 — close button with visible hover */}
      <button
        onClick={onClose}
        aria-label="Bağla"
        className="flex-shrink-0 p-0.5 rounded transition-colors duration-150"
        style={{ color: '#9B9EBB' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#0D0D1A')}
        onMouseLeave={e => (e.currentTarget.style.color = '#9B9EBB')}
      >
        <X size={14} strokeWidth={2} />
      </button>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type?: 'success' | 'error' | 'info' }>
  removeToast: (id: string) => void
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {/* #28 — AnimatePresence only for entry/exit */}
      <AnimatePresence mode="popLayout">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <Toast message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
