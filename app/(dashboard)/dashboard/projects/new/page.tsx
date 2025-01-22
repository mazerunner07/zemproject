import { getUserClient } from "@/actions/clients";
import ProjectForm from "@/components/Forms/ProjectForm";
import { getAuthUser } from "@/config/useAuth";
import React from "react";

export default async function page() {
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
      <ProjectForm userId={userId} clients={userClients} />
    </div>
  );
}
