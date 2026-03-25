export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SMOResultCard from '@/components/app/SMOResultCard'
import type { Generation } from '@/types'

interface Props { params: Promise<{ id: string }> }

export default async function SMOResultPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: generation, error } = await supabase
    .from('generations').select('*').eq('id', id).eq('user_id', user.id).single()

  if (error || !generation) notFound()

  return <SMOResultCard generation={generation as Generation} />
}
