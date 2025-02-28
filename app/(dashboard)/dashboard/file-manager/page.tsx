import { getUserFolder } from '@/actions/fileManager'
import { getDetailedUserProjects, getUserProject } from '@/actions/projects'
import FileManager from '@/components/dashboard/FileManager'
import PaymentsPage from '@/components/dashboard/PaymentsPage'
import { getAuthUser } from '@/config/useAuth'
import React from 'react'

export default async function page() {
  const user = await getAuthUser()
  const userFolders = await getUserFolder(user?.id??"") || []
  return (
    <div>
      {/* {userProjects.length>0?(
        <PaymentsPage userProjects = {userProjects} />
      ):(
        <div>
          <h2>No Projects Yet</h2>
        </div>
      )} */}
      <FileManager userId = {user?.id??""} userFolders = {userFolders} />
    </div>
  )
}
