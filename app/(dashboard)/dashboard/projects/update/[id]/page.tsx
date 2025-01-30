import { getClientsById, getUserClient } from "@/actions/clients";
import { getProjectById } from "@/actions/projects";
import ProjectForm from "@/components/Forms/ProjectForm";
import { getAuthUser } from "@/config/useAuth";
import React from "react";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const projects = await getProjectById(id);
  const user = await getAuthUser();
  const userId = user?.id??""

  const clients = await getUserClient(userId);
  const userClients = clients?.map((user) => {
    return {
      label: user.name,
      value: user.id
    }
  }) || [];
  return (
    <div className="p-8">
      <ProjectForm initialData={projects}
        editingId={id} userId={userId} clients={userClients}
        />
    </div>
  );
}
