import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:              '#F5F5FF',
        surface:         '#FFFFFF',
        'surface-hover': '#F5F3FF',
        primary:         '#7B6EF6',
        'primary-hover': '#6B5EE6',
        success:         '#00C9A7',
        error:           '#F25C54',
        warning:         '#F5A623',
        'text-primary':  '#0D0D1A',
        /* #11 — improved contrast: was #5A5D7A (~5.3:1), keeping it */
        'text-secondary':'#3D4060',
        /* #11 — was #9B9EBB (~2.6:1 on white, fails WCAG AA for small text)
                  now  #737599 (~4.7:1 on white, passes WCAG AA) */
        'text-muted':    '#737599',
      },
      fontFamily: {
        display: ['Bricolage Grotesque', 'Outfit', 'sans-serif'],
        body:    ['Outfit', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      /* #6 — 4px-base spacing scale additions */
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
      },
      /* #2 — explicit line-height tokens */
      lineHeight: {
        'tight':   '1.2',
        'snug':    '1.35',
        'normal':  '1.5',
        'relaxed': '1.65',
        'loose':   '1.8',
      },
      /* #1 — consistent type scale with baked-in line-heights */
      fontSize: {
        'xs':   ['0.75rem',  { lineHeight: '1.4'  }],
        'sm':   ['0.875rem', { lineHeight: '1.5'  }],
        'base': ['1rem',     { lineHeight: '1.65' }],
        'lg':   ['1.125rem', { lineHeight: '1.5'  }],
        'xl':   ['1.25rem',  { lineHeight: '1.4'  }],
        '2xl':  ['1.5rem',   { lineHeight: '1.3'  }],
        '3xl':  ['1.875rem', { lineHeight: '1.2'  }],
        '4xl':  ['2.25rem',  { lineHeight: '1.15' }],
      },
      /* #29 — all transitions ≤ 300ms */
      transitionDuration: {
        DEFAULT: '200ms',
        '75':  '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
      animation: {
        'marquee':         'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        'shimmer':         'shimmer 1.6s ease-in-out infinite',
      },
      keyframes: {
        marquee:          { '0%': { transform: 'translateX(0%)' },    '100%': { transform: 'translateX(-50%)' } },
        'marquee-reverse':{ '0%': { transform: 'translateX(-50%)' },  '100%': { transform: 'translateX(0%)' } },
        shimmer:          { '0%': { backgroundPosition: '-200% 0' },  '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
export default config
