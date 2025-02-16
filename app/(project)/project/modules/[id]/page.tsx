"use client";

import { useEffect, useState } from "react";
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation";
import { getModuleById, getProjectModules } from "@/actions/modules";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check, CheckCheck, MoreVertical, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import TaskForm from "@/components/Forms/TaskForm";
import { Module } from "@/types/types";
import { DeleteTask } from "@/components/Forms/DeleteTask";
import ModuleForm from "@/components/Forms/ModuleForm";
import { ModeToggle } from "@/components/mode-toggle";
import { AvatarMenuButton } from "@/components/dashboard/AvatarMenuButton";
import { useSession } from "next-auth/react";
import BackBtn from "@/components/BackBtn";

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pId = searchParams.get("pId");
  const moduleId = params.id as string;
  const { data: session } = useSession();
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchModules() {
    if (!pId || !moduleId) return;
    setLoading(true);
    try {
      const projectModules: Module[] = (await getProjectModules(pId)) || [];
      const activeModuleData: Module | null = await getModuleById(moduleId);

      if (!activeModuleData || projectModules.length === 0) {
        return notFound();
      }

      setActiveModule(activeModuleData);
      setModules(projectModules);
      setUser({ id: activeModuleData.userId, name: activeModuleData.userName });
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchModules();
  }, [pId, moduleId]);

  let percentageCompletion = 0;
  const allTask = activeModule?.tasks?.length ?? 0;
  const completeTask = activeModule?.tasks?.filter(task => task.status === "COMPLETE").length ?? 0;
  if (allTask > 0) {
    percentageCompletion = (completeTask / allTask) * 100;
  }

  return (
    <div className="h-screen w-full flex flex-col p-4 bg-gradient-to-r from-blue-200 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <BackBtn title="Back" />
        <div className="flex gap-3">
          <ModeToggle />
          <AvatarMenuButton session={session} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 w-full h-full overflow-hidden rounded-lg shadow-lg bg-white dark:bg-gray-900">
        {/* Sidebar - Modules */}
        <div className="w-full md:w-1/4 flex flex-col p-4 border-r bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-bold">Project Modules</h2>
          <Separator className="my-3" />
          <ScrollArea className="flex-1">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-3">
                {modules.map((module) => (
                  <Link key={module.id} href={`/project/modules/${module.id}?pId=${module.projectId}`}>
                    <Card
                      className={`cursor-pointer p-2 ${
                        activeModule?.id === module.id ? "bg-blue-200 dark:bg-blue-700" : "hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      <CardHeader className="">
                        <div className="flex items-center justify-start">

                        {activeModule?.id === module.id ? (
                          <CheckCheck className="h-4 w-4 mr-4 text-blue-500" />
                        ) : (
                          <Check className="h-4 w-4 mr-4 text-gray-500" />
                        )}
                        <h1>{module.name}</h1>
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </ScrollArea>
          <ModuleForm projectId={pId as string} userId={user?.id ?? ""} userName={user?.name ?? ""} onModuleAdded={fetchModules} />
        </div>

        {/* Main Panel - Tasks */}
        <div className="w-full md:w-3/4 flex flex-col p-6 bg-gray-50 dark:bg-gray-900">
          {activeModule ? (
            <>
              <h1 className="text-2xl font-bold">{activeModule.name}</h1>
              <Separator className="my-3" />
              <div className="flex items-center gap-3">
                <Progress value={percentageCompletion} className="w-full bg-gray-200 dark:bg-gray-700" />
                <span className="text-sm text-gray-500">{percentageCompletion}% Completed</span>
                <TaskForm moduleId={activeModule.id} initialStatus="TODO" onTaskAdded={fetchModules} isDefault />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 overflow-y-auto flex-1">
                {["TODO", "INPROGRESS", "COMPLETE"].map((status) => (
                  <div key={status} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col">
                    <div
                      className={`p-3 py-1 flex justify-between items-center rounded-md font-semibold ${
                        status === "TODO" ? "bg-orange-100 dark:bg-orange-700" : status === "INPROGRESS" ? "bg-blue-100 dark:bg-blue-700" : "bg-green-100 dark:bg-green-700"
                      }`}
                    >
                      {status.replace("INPROGRESS", "In Progress")}
                      <TaskForm moduleId={activeModule.id} initialStatus={status} onTaskAdded={fetchModules} isDefault={false} />
                    </div>
                    <ul className="space-y-2 mt-4 overflow-y-auto flex-1">
                      {activeModule.tasks?.filter((task) => task.status === status).length > 0 ? (
                        activeModule.tasks.filter((task) => task.status === status).map((task) => (
                          <Card key={task.id} className="flex p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 items-center">
                            <ChevronRight className="w-4 h-4 mr-2" />
                            <span>{task.title}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <TaskForm moduleId={activeModule.id} editingId={task.id} initialStatus={task.status} onTaskAdded={fetchModules} initialTitle={task.title} />
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <DeleteTask id={task.id} onTaskDeleted={fetchModules} />
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </Card>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No tasks in this category.</p>
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">No module selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
