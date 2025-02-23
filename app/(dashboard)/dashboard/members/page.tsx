import { getUserGuestProject, getUserMembers } from '@/actions/projects'
import GuestProjects from '@/components/dashboard/GuestProjects'
import { getAuthUser } from '@/config/useAuth'
import React from 'react'

export default async function page() {
    const user = await getAuthUser()
    const projects = await getUserMembers(user?.id) || []
  return (
    <>
    {projects.length>0 ? (
        <div className="p-8 max-w-3xl">
        <div className="">
          <GuestProjects isOwner={true} projects={projects} />
        </div>
      </div>   
    ):(
        <div className="">
            <h2>You don't Have any Members</h2>
        </div>
    )}
    </>
  )
}
