import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import GenerateForm from '@/components/app/GenerateForm'
import type { Profile } from '@/types'

export default async function GeneratePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return <GenerateForm profile={profile as Profile | null} />
}
