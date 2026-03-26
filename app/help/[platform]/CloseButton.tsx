'use client'

export default function CloseButton() {
  return (
    <button
      onClick={() => window.close()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: 'linear-gradient(135deg, #7B6EF6, #9B8FF8)',
        color: '#FFFFFF',
        border: 'none',
        borderRadius: 16,
        padding: '13px 32px',
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 6px 20px rgba(123,110,246,0.35)',
      }}
    >
      Bağla və qayıt
    </button>
  )
}
