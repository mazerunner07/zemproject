import { getPortfolioByUserId } from '@/actions/portfolio'
import { getUserPublicFeaturedProject, getUserPublicOtherProject } from '@/actions/projects'
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
    const otherProjects = await getUserPublicOtherProject(id as string)||[]
    const featured = await getUserPublicFeaturedProject(id as string)||[]
    const profile = await getPortfolioByUserId(id as string)
  return (
    <div>
      {profile && profile.id && (
      <PortFolioPage otherProjects = {otherProjects} profile = {profile} projects = {featured} />
      )}
    </div>
  )
}
