import { getCategoryById } from "@/actions/categories";
import { getProjectById } from "@/actions/projects";
import ProjectForm from "@/components/Forms/ProjectForm";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const projects = await getProjectById(id);
  return (
    <div className="p-8">
      <ProjectForm initialData={projects} editingId={id} />
    </div>
  );
}
