import { getProjectDetailsBySlug } from '@/actions/projects';
import ProjectDetailsPage from '@/components/projects/ProjectDetailPage'
import { notFound } from 'next/navigation';
import React from 'react'

export default async function page({ params: { slug } }: { params: { slug: string } }) {
  try {
    const projectData = await getProjectDetailsBySlug(slug);

    if (!projectData) {
      console.error("Project not found for slug:", slug);
      return notFound();
    }

    return (
      <div>
        <ProjectDetailsPage projectData={projectData} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching project data:", error);
    return notFound();
  }
}
