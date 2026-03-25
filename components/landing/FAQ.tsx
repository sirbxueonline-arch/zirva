// FILE: components/landing/FAQ.tsx
'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

const FAQS = [
  {
    q: 'Zirva nədir?',
    a: 'Zirva Azərbaycan bazarı üçün hazırlanmış süni intellekt SEO alətidir. URL əsasında saytınız üçün başlıq teqi, meta açıqlama, Open Graph, schema markup yaradır — hamısı Azerbaycanca və Rusca.',
  },
  {
    q: 'Saytım olmasa da istifadə edə bilərəmmi?',
    a: 'URL axışından istifadə edə bilərsiniz: mövcud saytınızın URL-ini daxil edin, Zirva geri qalanını özü edir. Gələcək saytınız üçün də SEO hazırlaya bilərsiniz.',
  },
  {
    q: 'Nəticələr hansı dildə olacaq?',
    a: 'Bütün SEO teqləri Azerbaycanca (birincil) və Rusca (ikincil) yaradılır. Bu, Google.az-da maksimum görünürlük üçün optimaldır, çünki Azərbaycan axtarışlarının böyük hissəsi hər iki dildə aparılır.',
  },
  {
    q: 'Pulsuz plan nə qədər istifadə etmək olar?',
    a: 'Pulsuz plan ayda 5 tam SEO paketi verir. Hər paketə title tag, meta description, OG teqləri, hreflang, schema markup və SEO balı daxildir. Kredit kartı tələb olunmur.',
  },
  {
    q: 'Ödəniş Azərbaycandan işləyirmi?',
    a: 'Bəli, Azərbaycan bank kartları ilə ödəniş edilə bilər. Qiymətlər AZN ilə göstərilir. Dodo Payments vasitəsilə təhlükəsiz ödəniş.',
  },
  {
    q: 'SEO balı nəyi ölçür?',
    a: '0–100 arası bal yaradılan teqlərin keyfiyyətini göstərir: açar söz sıxlığı, simvol limitlərinə uyğunluq, schema mövcudluğu, hreflang düzgünlüyü və Google.az üçün lokal optimallaşdırma.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="faq" ref={ref} className="py-24" style={{ background: '#F5F5FF' }}>
      <div className="max-w-3xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ y: 24, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ ...SPRING, delay: 0 }}
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-sm font-semibold mb-6"
            style={{
              background: 'rgba(123,110,246,0.08)',
              borderColor: 'rgba(123,110,246,0.2)',
              color: '#7B6EF6',
            }}
          >
            <MessageCircle size={13} strokeWidth={2.5} />
            FAQ
          </div>
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4" style={{ color: '#0D0D1A' }}>
            Tez-tez Verilən Suallar
          </h2>
          <p className="text-lg" style={{ color: '#3D4060' }}>
            Cavab tapa bilməsəniz bizimlə əlaqə saxlayın
          </p>
        </motion.div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i
            return (
              <motion.div
                key={i}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: '#FFFFFF',
                  border: `1.5px solid ${isOpen ? '#7B6EF6' : 'rgba(123,110,246,0.12)'}`,
                  transition: 'border-color 0.2s ease',
                  boxShadow: isOpen
                    ? '0 8px 28px rgba(123,110,246,0.12)'
                    : '0 2px 8px rgba(13,13,26,0.04)',
                }}
                initial={{ y: 16, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ ...SPRING, delay: 0.06 + i * 0.07 }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-base pr-4" style={{ color: '#0D0D1A' }}>
                    {faq.q}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={SPRING}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      size={18}
                      strokeWidth={2}
                      style={{ color: isOpen ? '#7B6EF6' : '#737599' }}
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-6 pb-5 border-t"
                        style={{ borderColor: 'rgba(123,110,246,0.1)' }}
                      >
                        <p
                          className="pt-4 text-sm leading-relaxed"
                          style={{ color: '#3D4060' }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
