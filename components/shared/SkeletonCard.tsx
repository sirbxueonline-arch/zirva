export function SkeletonLine({ width = 'w-full', height = 'h-4' }: { width?: string; height?: string }) {
  return <div className={`skeleton rounded ${width} ${height}`} />
}

export function SkeletonCard() {
  return (
    <div
      className="rounded-xl border p-6 space-y-4"
      style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.15)' }}
    >
      <SkeletonLine width="w-1/3" height="h-4" />
      <SkeletonLine width="w-full" height="h-6" />
      <SkeletonLine width="w-3/4" height="h-4" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border p-4 flex items-center gap-4"
          style={{ background: '#FFFFFF', borderColor: 'rgba(123,110,246,0.1)' }}
        >
          <SkeletonLine width="w-1/4" height="h-4" />
          <SkeletonLine width="w-16" height="h-5" />
          <SkeletonLine width="w-12" height="h-5" />
          <SkeletonLine width="w-24" height="h-4" />
        </div>
      ))}
    </div>
  )
}
