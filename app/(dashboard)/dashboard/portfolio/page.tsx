import { getPortfolioByUserId } from '@/actions/portfolio'
import { getUserProjectsCount, getUserPublicProject } from '@/actions/projects'
import { ShareLink } from '@/components/dashboard/ShareLink'
import PortfolioForm from '@/components/Forms/PortfolioForm'
import PortFolioPage from '@/components/PortFolioPage'
import { Button } from '@/components/ui/button'
import { authOptions } from '@/config/auth'
import { getAuthUser } from '@/config/useAuth'
import { generateSlug } from '@/lib/generateSlug'
import { Copy, Eye, Share } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import React from 'react'

export default async function page() {
  const session = await getServerSession(authOptions)
    const user = await getAuthUser()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const slug = generateSlug(user?.name??"slug")
    const count = await getUserProjectsCount(user?.id)??0
    const initialData = await getPortfolioByUserId(user?.id ?? "");
    const link = `${baseUrl}/portfolio/${slug}?id=${user?.id}`
    
  return (
    <div className='p-8'>
      <div className="pb-3 flex border-b items-center justify-between">
        <h2 className='scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0'>
          Customize Your Portfolio
        </h2>
        <div className="flex gap-4">
          <Button><Link target='_blank' className='flex items-center' href = {`/portfolio/${slug}?id=${user?.id}`}>
          <Eye className='w-4 h-4 mr-2' />
          Preview
          </Link></Button>
          <ShareLink link={link} />
        </div>
      </div>
      <div className="py-6">
        <PortfolioForm editingId={initialData?.id} initialData={initialData} session={session} count = {count} />
      </div>
    </div>
  )
}
