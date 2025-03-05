import React from "react";
import { columns } from "./columns";
import { Project } from "@prisma/client";
import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "../../../../components/dashboard/Tables/TableHeader";
import { getUserProject } from "@/actions/projects";
import { getAuthUser } from "@/config/useAuth";

export default async function page() {
  const user = await getAuthUser();
  const userId = user?.id;
  const projects: Project[] = (await getUserProject(userId)) || [];
  return (
    <div className="p-8 dark:bg-[#121212]">
      <TableHeader
        title="Projects"
        linkTitle="Add Projects"
        href="/dashboard/projects/new"
        data={projects}
        model="project"
      />
      <div className="py-8">
        <DataTable model="project" data={projects} columns={columns} />
      </div>
    </div>
  );
}
