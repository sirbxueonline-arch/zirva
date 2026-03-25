'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

const PLATFORMS = [
  { name: 'WordPress',   domain: 'wordpress.org'   },
  { name: 'Shopify',     domain: 'shopify.com'     },
  { name: 'Wix',         domain: 'wix.com'         },
  { name: 'Webflow',     domain: 'webflow.com'     },
  { name: 'Next.js',     domain: 'nextjs.org'      },
  { name: 'HubSpot',     domain: 'hubspot.com'     },
  { name: 'Squarespace', domain: 'squarespace.com' },
  { name: 'Ghost',       domain: 'ghost.org'       },
]

// Row 1 — left to right
const ROW1 = [
  { cc: 'az', name: 'Azərbaycan' },
  { cc: 'ru', name: 'Rusiya'     },
  { cc: 'gb', name: 'İngiltərə' },
  { cc: 'tr', name: 'Türkiyə'   },
  { cc: 'de', name: 'Almaniya'  },
  { cc: 'fr', name: 'Fransa'    },
  { cc: 'us', name: 'ABŞ'       },
  { cc: 'es', name: 'İspaniya'  },
  { cc: 'it', name: 'İtaliya'   },
  { cc: 'pl', name: 'Polşa'     },
  { cc: 'cn', name: 'Çin'       },
  { cc: 'in', name: 'Hindistan' },
]

// Row 2 — right to left (completely different countries)
const ROW2 = [
  { cc: 'ua', name: 'Ukrayna'   },
  { cc: 'kz', name: 'Qazaxstan' },
  { cc: 'uz', name: 'Özbəkistan'},
  { cc: 'ge', name: 'Gürcüstan' },
  { cc: 'sa', name: 'Səudiyyə'  },
  { cc: 'ae', name: 'BƏƏ'       },
  { cc: 'nl', name: 'Hollandiya'},
  { cc: 'br', name: 'Braziliya' },
  { cc: 'jp', name: 'Yaponiya'  },
  { cc: 'kr', name: 'Koreya'    },
  { cc: 'mx', name: 'Meksika'   },
  { cc: 'ca', name: 'Kanada'    },
]

const MARQUEE_ITEMS = [...ROW1, ...ROW1]
const MARQUEE_REV   = [...ROW2, ...ROW2]

function FlagImg({ cc, name }: { cc: string; name: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/24x18/${cc}.png`}
      srcSet={`https://flagcdn.com/48x36/${cc}.png 2x`}
      width={24}
      height={18}
      alt={name}
      style={{ borderRadius: 3, flexShrink: 0, objectFit: 'cover' }}
    />
  )
}

export default function Integrations() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <>
      {/* ── Platforms ── */}
      <section ref={ref} className="py-24" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            initial={{ y: 24, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ ...SPRING }}
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-3" style={{ color: '#0D0D1A' }}>
              Hər platformada işləyir
            </h2>
            <p className="text-lg" style={{ color: '#737599' }}>
              Teqlərinizi istənilən CMS-ə yapışdırın — sıfır texniki bilik tələb olunmur.
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {PLATFORMS.map((p, i) => (
              <motion.div
                key={p.domain}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-default"
                style={{
                  background: '#F5F5FF',
                  border: '1.5px solid rgba(123,110,246,0.08)',
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ ...SPRING, delay: 0.06 + i * 0.06 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(123,110,246,0.12)' }}
              >
                {/* Logo container */}
                <div
                  className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden"
                  style={{ boxShadow: '0 2px 8px rgba(13,13,26,0.08)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://logo.clearbit.com/${p.domain}`}
                    alt={p.name}
                    width={40}
                    height={40}
                    style={{ width: 40, height: 40, objectFit: 'contain' }}
                    onError={(e) => {
                      // Fallback: show first letter
                      const target = e.currentTarget as HTMLImageElement
                      target.style.display = 'none'
                      const parent = target.parentElement
                      if (parent && !parent.querySelector('span')) {
                        const span = document.createElement('span')
                        span.textContent = p.name[0]
                        span.style.cssText = 'font-weight:700;font-size:20px;color:#7B6EF6'
                        parent.appendChild(span)
                      }
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-center" style={{ color: '#3D4060' }}>
                  {p.name}
                </span>
              </motion.div>
            ))}

            {/* +100 more */}
            <motion.div
              className="flex flex-col items-center gap-3 p-5 rounded-2xl cursor-default"
              style={{
                background: '#F5F5FF',
                border: '1.5px dashed rgba(123,110,246,0.25)',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ ...SPRING, delay: 0.06 + PLATFORMS.length * 0.06 }}
              whileHover={{ y: -4 }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-bold text-sm"
                style={{ background: 'rgba(123,110,246,0.1)', color: '#7B6EF6' }}
              >
                100+
              </div>
              <span className="text-xs font-semibold text-center" style={{ color: '#737599' }}>
                Digər alətlər
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Markets Marquee ── */}
      <section className="py-20 overflow-hidden" style={{ background: '#F5F5FF' }}>
        <div className="max-w-5xl mx-auto px-6 text-center mb-10">
          <motion.h2
            className="font-display font-bold text-4xl md:text-5xl mb-3"
            style={{ color: '#0D0D1A' }}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ...SPRING }}
          >
            Hər bazarda görün
          </motion.h2>
          <motion.p
            className="text-lg"
            style={{ color: '#737599' }}
            initial={{ y: 16, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            Zirva hreflang + çoxdilli teqlərlə saytınızı hər ölkənin Google-unda irəli çıxarır.
          </motion.p>
        </div>

        {/* Row 1 — left to right */}
        <div className="mb-3 overflow-hidden">
          <div
            className="flex gap-3"
            style={{ animation: 'marquee 38s linear infinite', width: 'max-content' }}
          >
            {MARQUEE_ITEMS.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full whitespace-nowrap flex-shrink-0"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(123,110,246,0.1)',
                  boxShadow: '0 2px 8px rgba(13,13,26,0.04)',
                }}
              >
                <FlagImg cc={m.cc} name={m.name} />
                <span className="text-sm font-medium" style={{ color: '#3D4060' }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — right to left */}
        <div className="overflow-hidden">
          <div
            className="flex gap-3"
            style={{ animation: 'marquee-reverse 42s linear infinite', width: 'max-content' }}
          >
            {MARQUEE_REV.map((m, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full whitespace-nowrap flex-shrink-0"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(123,110,246,0.1)',
                  boxShadow: '0 2px 8px rgba(13,13,26,0.04)',
                }}
              >
                <FlagImg cc={m.cc} name={m.name} />
                <span className="text-sm font-medium" style={{ color: '#3D4060' }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
