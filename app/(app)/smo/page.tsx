import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SMOForm from '@/components/app/SMOForm'
import type { Profile } from '@/types'

export default async function SMOPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  return <SMOForm profile={profile as Profile | null} />
}
