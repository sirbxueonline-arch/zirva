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
  flow_type:     'url' | 'social' | 'manual'
  input_data:    Record<string, unknown>
  output_data:   SEOPackage
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
  plan:                  'free' | 'pro' | 'agency'
  generations_used:      number
  generations_limit:     number
  dodo_customer_id:      string | null
  dodo_subscription_id:  string | null
  subscription_status:   string | null
  current_period_end:    string | null
  created_at:            string
  updated_at:            string
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

export const PLAN_LIMITS = { free: 5, pro: 50, agency: 300 } as const
export const PLAN_PRICES = { free: '0 AZN', pro: '39.99 AZN/ay', agency: '149.99 AZN/ay' } as const
export const PLAN_NAMES  = { free: 'Pulsuz', pro: 'Pro', agency: 'Agency' } as const
