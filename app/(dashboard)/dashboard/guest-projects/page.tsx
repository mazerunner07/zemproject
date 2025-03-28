import { getUserGuestProject } from '@/actions/projects'
import GuestProjects from '@/components/dashboard/GuestProjects'
import { getAuthUser } from '@/config/useAuth'
import React from 'react'

export default async function page() {
    const user = await getAuthUser()
    const projects = await getUserGuestProject(user?.id) || []
  return (
    <>
    {projects.length>0 ? (
        <div className='dark:bg-[#0F172A] grid p-8'>
        <GuestProjects projects = {projects} />
      </div>
    ):(
        <div className="">
            <h2>You don't Have any Guest Project Yet</h2>
        </div>
    )}
    </>
  )
}
