import { getUserPublicProject } from '@/actions/projects'
import PortFolioPage from '@/components/PortFolioPage'
import { getAuthUser } from '@/config/useAuth'
import React from 'react'

export default async function page() {
    const user = await getAuthUser()
    const projects = await getUserPublicProject(user?.id)||[]
  return (
    <div>
      <PortFolioPage projects = {projects} />
    </div>
  )
}
