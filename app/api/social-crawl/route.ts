import { z } from 'zod'

const schema = z.object({
  username: z.string().min(1),
  platform: z.enum(['instagram']),
})

export interface SocialProfile {
  username:    string
  full_name?:  string
  bio?:        string
  followers?:  number
  following?:  number
  posts?:      number
  category?:   string
  website?:    string
  is_business?: boolean
}

// ── Instagram ──────────────────────────────────────────────
async function fetchInstagram(username: string): Promise<SocialProfile> {
  const res = await fetch(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
    {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'x-ig-app-id': '936619743392459',
        'x-requested-with': 'XMLHttpRequest',
        'Referer': `https://www.instagram.com/${username}/`,
        'Origin': 'https://www.instagram.com',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      cache: 'no-store',
    }
  )

  if (!res.ok) throw new Error(`Instagram API: HTTP ${res.status}`)

  const data = await res.json()
  const user = data?.data?.user
  if (!user) throw new Error('Profil tapılmadı. Hesab mövcud deyil və ya gizlidir.')

  return {
    username:    user.username,
    full_name:   user.full_name || undefined,
    bio:         user.biography || undefined,
    followers:   user.edge_followed_by?.count,
    following:   user.edge_follow?.count,
    posts:       user.edge_owner_to_timeline_media?.count,
    category:    user.category_name || undefined,
    website:     user.external_url || undefined,
    is_business: user.is_business_account,
  }
}

// ── Route handler ──────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const raw = await req.json()
    const { username } = schema.parse(raw)
    const clean = username.replace(/^@/, '').trim()
    const profile = await fetchInstagram(clean)
    return Response.json(profile)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Profil əldə edilə bilmədi'
    console.error('social-crawl error:', err)
    return Response.json({ error: message }, { status: 400 })
  }
}
