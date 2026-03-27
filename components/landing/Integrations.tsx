'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SPRING = { type: 'spring' as const, stiffness: 260, damping: 28 }

// Row 1 — 5 platforms
const PLATFORMS_R1 = [
  { name: 'WordPress',   icon: 'https://cdn.simpleicons.org/wordpress/21759B'   },
  { name: 'Shopify',     icon: 'https://cdn.simpleicons.org/shopify/96BF48'     },
  { name: 'Wix',         icon: 'https://cdn.simpleicons.org/wix/FAAD4D'         },
  { name: 'Webflow',     icon: 'https://cdn.simpleicons.org/webflow/146EF5'     },
  { name: 'Notion',      icon: 'https://cdn.simpleicons.org/notion/000000'      },
]
// Row 2 — 4 platforms + 100+
const PLATFORMS_R2 = [
  { name: 'HubSpot',     icon: 'https://cdn.simpleicons.org/hubspot/FF7A59'     },
  { name: 'Ghost',       icon: 'https://cdn.simpleicons.org/ghost/15171A'       },
  { name: 'Next.js',     icon: 'https://cdn.simpleicons.org/nextdotjs/000000'   },
  { name: 'Squarespace', icon: 'https://cdn.simpleicons.org/squarespace/000000' },
]

// GSC icon as inline SVG paths (Google colors)
const GSC_ICON = (
  <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

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

// Row 3 — left to right
const ROW3 = [
  { cc: 'pt', name: 'Portuqaliya' },
  { cc: 'se', name: 'İsveç'       },
  { cc: 'no', name: 'Norveç'      },
  { cc: 'dk', name: 'Danimarka'   },
  { cc: 'fi', name: 'Finlandiya'  },
  { cc: 'ch', name: 'İsveçrə'     },
  { cc: 'at', name: 'Avstriya'    },
  { cc: 'be', name: 'Belçika'     },
  { cc: 'gr', name: 'Yunanıstan'  },
  { cc: 'ro', name: 'Rumıniya'    },
  { cc: 'hu', name: 'Macarıstan'  },
  { cc: 'cz', name: 'Çexiya'      },
]

// Row 4 — right to left
const ROW4 = [
  { cc: 'th', name: 'Tailand'     },
  { cc: 'vn', name: 'Vyetnam'     },
  { cc: 'id', name: 'İndoneziya'  },
  { cc: 'my', name: 'Malayziya'   },
  { cc: 'sg', name: 'Sinqapur'    },
  { cc: 'ph', name: 'Filippin'    },
  { cc: 'pk', name: 'Pakistan'    },
  { cc: 'ng', name: 'Nigeriya'    },
  { cc: 'za', name: 'C. Afrika'   },
  { cc: 'eg', name: 'Misir'       },
  { cc: 'il', name: 'İsrail'      },
  { cc: 'ar', name: 'Argentina'   },
]

const MARQUEE_ITEMS = [...ROW1, ...ROW1, ...ROW1]
const MARQUEE_REV   = [...ROW2, ...ROW2, ...ROW2]
const MARQUEE_R3    = [...ROW3, ...ROW3, ...ROW3]
const MARQUEE_R4    = [...ROW4, ...ROW4, ...ROW4]

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

          {/* Row 1 — 5 platforms */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-4">
            {PLATFORMS_R1.map((p, i) => (
              <motion.div
                key={p.name}
                className="flex flex-col items-center gap-3 py-7 px-3 rounded-2xl cursor-default"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(13,13,26,0.07)',
                  boxShadow: '0 2px 12px rgba(13,13,26,0.05)',
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ ...SPRING, delay: 0.05 + i * 0.06 }}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(123,110,246,0.1)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.icon}
                  alt={p.name}
                  width={40}
                  height={40}
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                />
                <span className="text-xs font-semibold text-center" style={{ color: '#3D4060' }}>{p.name}</span>
              </motion.div>
            ))}
          </div>

          {/* GSC highlight banner */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-2xl px-6 py-5 mb-4"
            style={{
              background: 'linear-gradient(135deg, #F0F4FF 0%, #E8FDF8 100%)',
              border: '1.5px solid rgba(66,133,244,0.18)',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ ...SPRING, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 flex-shrink-0">
              {GSC_ICON}
              <div>
                <div className="font-semibold text-sm" style={{ color: '#0D0D1A' }}>Google Search Console</div>
                <div className="text-xs" style={{ color: '#737599' }}>Rəsmi inteqrasiya</div>
              </div>
            </div>
            <div className="h-px sm:h-10 sm:w-px w-full" style={{ background: 'rgba(66,133,244,0.15)' }} />
            <p className="text-sm text-center sm:text-left" style={{ color: '#5A5D7A', lineHeight: 1.6 }}>
              Zirva, istifadəçilərin razılığı ilə Google Search Console API-sinə qoşulur — saytın keyword performansını analiz edib hər 3 gündə bir Azərbaycanca SEO hesabatı göndərir. Məlumatlar yalnız sizindir, heç kimlə paylaşılmır.
            </p>
          </motion.div>

          {/* Row 2 — 4 platforms + 100+ */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {PLATFORMS_R2.map((p, i) => (
              <motion.div
                key={p.name}
                className="flex flex-col items-center gap-3 py-7 px-3 rounded-2xl cursor-default"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(13,13,26,0.07)',
                  boxShadow: '0 2px 12px rgba(13,13,26,0.05)',
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ ...SPRING, delay: 0.29 + i * 0.06 }}
                whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(123,110,246,0.1)' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.icon}
                  alt={p.name}
                  width={40}
                  height={40}
                  style={{ width: 40, height: 40, objectFit: 'contain' }}
                />
                <span className="text-xs font-semibold text-center" style={{ color: '#3D4060' }}>{p.name}</span>
              </motion.div>
            ))}

            {/* 100+ tile in same row */}
            <motion.div
              className="flex flex-col items-center gap-3 py-7 px-3 rounded-2xl cursor-default"
              style={{
                background: '#FFFFFF',
                border: '1.5px dashed rgba(123,110,246,0.28)',
                boxShadow: '0 2px 12px rgba(13,13,26,0.03)',
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ ...SPRING, delay: 0.53 }}
              whileHover={{ y: -3 }}
            >
              <div
                className="w-13 h-13 flex items-center justify-center font-display font-bold text-sm"
                style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(123,110,246,0.08)', color: '#7B6EF6' }}
              >
                100+
              </div>
              <span className="text-xs font-semibold text-center" style={{ color: '#737599' }}>Digər alətlər</span>
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
        <div style={{ overflow: 'hidden', width: '100%', marginBottom: 12, WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 38s linear infinite', willChange: 'transform' }}>
            {MARQUEE_ITEMS.map((m, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px', borderRadius: 999,
                  whiteSpace: 'nowrap', flexShrink: 0,
                  marginRight: 12,
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(123,110,246,0.1)',
                  boxShadow: '0 2px 8px rgba(13,13,26,0.04)',
                }}
              >
                <FlagImg cc={m.cc} name={m.name} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#3D4060' }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2 — right to left */}
        <div style={{ overflow: 'hidden', width: '100%', marginBottom: 12, WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'marquee-reverse 42s linear infinite', willChange: 'transform' }}>
            {MARQUEE_REV.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0, marginRight: 12, background: '#FFFFFF', border: '1.5px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 8px rgba(13,13,26,0.04)' }}>
                <FlagImg cc={m.cc} name={m.name} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#3D4060' }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 — left to right */}
        <div style={{ overflow: 'hidden', width: '100%', marginBottom: 12, WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'marquee 44s linear infinite', willChange: 'transform' }}>
            {MARQUEE_R3.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0, marginRight: 12, background: '#FFFFFF', border: '1.5px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 8px rgba(13,13,26,0.04)' }}>
                <FlagImg cc={m.cc} name={m.name} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#3D4060' }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 4 — right to left */}
        <div style={{ overflow: 'hidden', width: '100%', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
          <div style={{ display: 'flex', width: 'max-content', animation: 'marquee-reverse 36s linear infinite', willChange: 'transform' }}>
            {MARQUEE_R4.map((m, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0, marginRight: 12, background: '#FFFFFF', border: '1.5px solid rgba(123,110,246,0.1)', boxShadow: '0 2px 8px rgba(13,13,26,0.04)' }}>
                <FlagImg cc={m.cc} name={m.name} />
                <span style={{ fontSize: 14, fontWeight: 500, color: '#3D4060' }}>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
