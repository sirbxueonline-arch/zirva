export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'

interface Props { params: Promise<{ id: string }> }

// Legacy route — redirect to unified result page
export default async function SMOResultPage({ params }: Props) {
  const { id } = await params
  redirect(`/result/${id}`)
}
