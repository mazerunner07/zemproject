import { getUserProject, getProjectDetailsBySlug } from '@/actions/projects'
import ProjectDetailsPage from '@/components/projects/ProjectDetailPage'
import { notFound } from 'next/navigation'
import React from 'react'
import { Project } from "@prisma/client";
import { getAuthUser } from "@/config/useAuth";
import { getExistingUsers } from '@/actions/users';

export default async function page({params:{slug}}: {params: {slug: string}}) {
  const projectData = await getProjectDetailsBySlug(slug);

    if (!projectData) {
      console.error("Project not found for slug:", slug);
      notFound();
    }

  return (
    <div>
      <ProjectDetailsPage  projectData={projectData} />
    </div>
  )
}
