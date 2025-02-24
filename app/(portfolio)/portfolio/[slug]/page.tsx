import { getPortfolioByUserId } from '@/actions/portfolio'
import { getUserPublicProject } from '@/actions/projects'
import PortFolioPage from '@/components/PortFolioPage'
import { getAuthUser } from '@/config/useAuth'
import { notFound } from 'next/navigation'
import React from 'react'

export default async function page({
  params,
  searchParams
}:{
  params : {slug : string}
  searchParams : {[key : string]:string | string[]|undefined}
}) {
  const {id = ""} = searchParams
  if (!id) {
    return notFound()
  } 
    const projects = await getUserPublicProject(id as string)||[]
    const profile = await getPortfolioByUserId(id as string)
  return (
    <div>
      {profile && profile.id && (
      <PortFolioPage profile = {profile} projects = {projects} />
      )}
    </div>
  )
}
