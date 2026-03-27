export interface PostCaption {
  type: string
  text: string
}

export interface SEOPackage {
  title_tag_az:        string
  title_tag_ru:        string
  meta_description_az: string
  meta_description_ru: string
  og_title:            string
  og_description:      string
  og_type:             string
  twitter_card:        string
  twitter_title:       string
  twitter_description: string
  canonical_url:       string
  robots:              string
  hreflang:            HreflangEntry[]
  schema_markup:       Record<string, unknown>
  keywords_az:         string[]
  keywords_ru:         string[]
  competitors?:        { name: string; domain: string; why: string }[]
  competitor_tips:     string[]
  improvement_tips:    string[]
  seo_score:           number
  score_breakdown:     ScoreBreakdown
  post_hashtags?:      string[]
  post_captions?:      PostCaption[]
}

export interface HreflangEntry { lang: string; url: string }

export interface ScoreBreakdown {
  title_quality:      number  // max 20
  meta_quality:       number  // max 20
  schema_present:     number  // max 20
  hreflang_correct:   number  // max 20
  local_optimization: number  // max 20
}

export interface Generation {
  id:            string
  user_id:       string
  tool:          ToolType | null
  flow_type:     'url' | 'social' | 'manual'
  input_data:    Record<string, unknown>
  output_data:   SEOPackage | SMOResult | Record<string, unknown>
  business_name: string | null
  seo_score:     number | null
  title_tag_az:  string | null
  meta_desc_az:  string | null
  created_at:    string
}

export interface Profile {
  id:                    string
  email:                 string
  full_name:             string | null
  avatar_url:            string | null
  website_url:           string | null
  plan:                  'free' | 'pro' | 'agency'
  brands_limit:          number
  credits_used:          number
  credits_limit:         number
  dodo_customer_id:      string | null
  dodo_subscription_id:  string | null
  subscription_status:   string | null
  current_period_end:    string | null
  created_at:            string
  updated_at:            string
  autopilot_enabled?:    boolean
  autopilot_url?:        string | null
  autopilot_last_run?:   string | null
  autopilot_next_run?:   string | null
  gsc_site_url?:         string | null
  gsc_connected_at?:     string | null
}

export interface AutopilotInsights {
  seo_score: number
  score_change: number
  headline: string
  summary: string
  top_performers: { keyword: string; clicks: number; position: number; change: string }[]
  declining: { keyword: string; position_drop: number; reason: string }[]
  action_items: string[]
  opportunity: string
  warning: string
  total_clicks: number
  total_clicks_change: string
  total_impressions: number
  total_impressions_change: string
  smo: {
    headline: string
    top_hashtags: string[]
    content_ideas: string[]
    best_platform: string
    post_tip: string
  }
}

export interface Brand {
  id:            string
  user_id:       string
  name:          string
  website_url:   string | null
  instagram_url: string | null
  tiktok_url:    string | null
  facebook_url:  string | null
  category:      string | null
  city:          string | null
  description:   string | null
  created_at:    string
  updated_at:    string
}

export interface SMOPackage {
  instagram_bio:            string
  tiktok_bio:               string
  hashtag_sets:             { name: string; hashtags: string[] }[]
  caption_templates:        { type: string; caption: string }[]
  profile_tips:             string[]
  content_pillars:          { name: string; description: string; post_ideas: string[] }[]
  posting_schedule:         string
  score:                    number
  score_breakdown:          { bio_quality: number; hashtag_strategy: number; content_plan: number; engagement_potential: number; local_relevance: number }
  post_specific_hashtags?:  string[]
  post_specific_captions?:  PostCaption[]
}

// ─── Admin / Tool types ─────────────────────────────────────
export const ADMIN_EMAIL = 'kaan.guluzada@gmail.com'

export type ToolType = 'seo' | 'smo'

export const SMO_CARD_TYPES = ['ad_audience', 'hashtags', 'content_calendar', 'content_templates'] as const
export type CardType = typeof SMO_CARD_TYPES[number]

export const CARD_META: Record<CardType, { label: string; color: string }> = {
  ad_audience:       { label: 'Hədəf Auditoriya',    color: '#7B6EF6' },
  hashtags:          { label: 'Hashteq Strategiyası', color: '#00C9A7' },
  content_calendar:  { label: 'Kontent Təqvimi',      color: '#F5A623' },
  content_templates: { label: 'Kontent Şablonları',   color: '#4285F4' },
}

// ─── SMO result type ─────────────────────────────────────────
export interface SMOResult {
  ad_audience: {
    primary_audience: { age_range: string; gender: string; location: string; interests: string[]; behaviors: string[] }
    secondary_audience: { age_range: string; gender: string; interests: string[] } | null
    pain_points: string[]
    ad_hooks: string[]
    ad_copies: { platform: string; headline: string; body: string; cta: string }[]
  }
  hashtags: {
    main_set: string[]
    reel_set: string[]
    story_set: string[]
    best_time: string
    total_reach_estimate: string
  }
  content_calendar: {
    month_theme: string
    weeks: {
      week: number
      focus: string
      posts: { day: string; format: string; topic: string; caption_hint: string }[]
    }[]
    posting_frequency: string
  }
  content_templates: {
    templates: { category: string; hook: string; body_structure: string; cta: string; example: string }[]
  }
  score: number
  score_breakdown: {
    audience_clarity: number
    hashtag_strategy: number
    content_consistency: number
    engagement_potential: number
  }
}

export const CREDITS_PER_GENERATION = 5
export const PLAN_CREDITS = { free: 25, pro: 250, agency: 1000 } as const
export const BRAND_LIMITS = { free: 1,  pro: 5,   agency: 15   } as const
export const PLAN_NAMES   = { free: 'Pulsuz', pro: 'Pro', agency: 'Agency' } as const

export type BillingPeriod = 'monthly' | 'quarterly' | 'yearly'

// Price per month at each billing period
export const PLAN_PERIOD_PRICES: Record<string, Record<BillingPeriod, { perMonth: string; total: string; label: string }>> = {
  free: {
    monthly:   { perMonth: '0',      total: '0',       label: 'aylıq' },
    quarterly: { perMonth: '0',      total: '0',       label: 'rüblük' },
    yearly:    { perMonth: '0',      total: '0',       label: 'illik' },
  },
  pro: {
    monthly:   { perMonth: '39.99',  total: '39.99',   label: 'aylıq' },
    quarterly: { perMonth: '33.99',  total: '101.97',  label: 'rüblük (15% endirim)' },
    yearly:    { perMonth: '29.99',  total: '359.88',  label: 'illik (25% endirim)' },
  },
  agency: {
    monthly:   { perMonth: '149.99', total: '149.99',  label: 'aylıq' },
    quarterly: { perMonth: '127.49', total: '382.47',  label: 'rüblük (15% endirim)' },
    yearly:    { perMonth: '112.49', total: '1349.88', label: 'illik (25% endirim)' },
  },
}

// Keep backwards-compatible flat price for current-plan display
export const PLAN_PRICES = { free: '0 AZN', pro: '39.99 AZN/ay', agency: '149.99 AZN/ay' } as const
