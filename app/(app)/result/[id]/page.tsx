export const dynamic = 'force-dynamic'

import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ResultCard from '@/components/app/ResultCard'
import SMOResultCard from '@/components/app/SMOResultCard'
import type { Generation } from '@/types'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ResultPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: generation, error }, { data: profile }] = await Promise.all([
    supabase.from('generations').select('*').eq('id', id).eq('user_id', user.id).single(),
    supabase.from('profiles').select('plan').eq('id', user.id).single(),
  ])

  if (error || !generation) notFound()

  const gen = generation as Generation
  const isPro = profile?.plan === 'pro' || profile?.plan === 'agency'

  if (gen.tool === 'smo') {
    return <SMOResultCard generation={gen} />
  }

  return <ResultCard generation={gen} isPro={isPro} />
}
