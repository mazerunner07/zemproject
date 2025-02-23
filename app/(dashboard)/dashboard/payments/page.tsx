import { getDetailedUserProjects, getUserProject } from '@/actions/projects'
import PaymentsPage from '@/components/dashboard/PaymentsPage'
import { getAuthUser } from '@/config/useAuth'
import React from 'react'

export default async function page() {
  const user = await getAuthUser()
  const userProjects = await getDetailedUserProjects(user?.id) || []
  return (
    <div>
      {userProjects.length>0?(
        <PaymentsPage userProjects = {userProjects} />
      ):(
        <div>
          <h2>No Projects Yet</h2>
        </div>
      )}
    </div>
  )
}
