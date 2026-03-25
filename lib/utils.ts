import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function scoreColor(score: number): string {
  if (score >= 75) return '#00C9A7'
  if (score >= 50) return '#F5A623'
  return '#F25C54'
}

export function scoreClass(score: number): string {
  if (score >= 75) return 'score-high'
  if (score >= 50) return 'score-mid'
  return 'score-low'
}

export function charCountClass(current: number, min: number, max: number): string {
  if (current < min || current > max) return 'count-over'
  if (current >= max - 5) return 'count-warn'
  return 'count-ok'
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const months = [
    'Yanvar','Fevral','Mart','Aprel','May','İyun',
    'İyul','Avqust','Sentyabr','Oktyabr','Noyabr','Dekabr'
  ]
  const days = ['Bazar','Bazar ertəsi','Çərşənbə axşamı','Çərşənbə','Cümə axşamı','Cümə','Şənbə']
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${days[date.getDay()]}`
}

export function timeAgo(dateStr: string): string {
  const now = new Date()
  const past = new Date(dateStr)
  const diffMs = now.getTime() - past.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Bu gün'
  if (diffDays === 1) return 'Dünən'
  return `${diffDays} gün əvvəl`
}

export function flowBadgeColor(flow: string): string {
  switch (flow) {
    case 'url':    return '#7B6EF6'
    case 'social': return '#00C9A7'
    case 'manual': return '#F25C54'
    default:       return '#5A5D7A'
  }
}

export function flowLabel(flow: string): string {
  switch (flow) {
    case 'url':    return 'URL'
    case 'social': return 'Sosial'
    case 'manual': return 'Manual'
    default:       return flow
  }
}
