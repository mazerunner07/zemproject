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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { AvatarMenuButton } from "@/components/dashboard/AvatarMenuButton";
import { useSession } from "next-auth/react";
import BackBtn from "@/components/BackBtn";

import { HTML5Backend } from "react-dnd-html5-backend";
import { TaskStatus } from "@prisma/client";
import { TaskColumn } from "@/components/projects/modules/TaskColumn";
import { deleteTask, updateTaskStatus } from "@/actions/tasks";
interface MainContentProps  {
  activeModule: {
    tasks: Task[];
  };
  task: any;
  moduleId: string;
  onTaskMoved: () => void;
  onTaskEdit: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export default function Page() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const pId = searchParams.get("pId");
  const moduleId = params.id as string;
  const { data: session,status } = useSession();
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchModules() {
    if (!pId || !moduleId || !session?.user) return;
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
    if (session?.user) {
      fetchModules();
    }
  }, [pId, moduleId, session]);
  if (status === "loading") return ;
 
  let percentageCompletion = 0;
  const allTask = activeModule?.tasks?.length ?? 0;
  const completeTask = activeModule?.tasks?.filter(task => task.status === "COMPLETE").length ?? 0;
  if (allTask > 0) {
    percentageCompletion = ((completeTask / allTask) * 100).toFixed(2);
  }
  const onTaskEdit = async (taskId: string) => {
    <TaskForm moduleId={activeModule.id} editingId={task.id} initialStatus="TODO" onTaskAdded={fetchModules} isDefault />
    console.log('Edit task:', taskId);
  };
  const onTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      fetchModules();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  const handleTaskMove = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchModules(); // Refresh the tasks after update
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };
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
          {session?.user && (
            <ModuleForm 
              projectId={pId as string} 
              userId={session.user.id} 
              userName={session.user.name || ''} 
              onModuleAdded={fetchModules} 
            />
          )}
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

              <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 overflow-y-auto flex-1">
        {["TODO", "INPROGRESS", "COMPLETE"].map((status) => (
          <TaskColumn
          fetchModules={()=>fetchModules()}
            key={status}
            moduleId={activeModule.id}
            status={status}
            tasks={activeModule.tasks.filter((task) => task.status === status)}
            onTaskMove={handleTaskMove}
            onTaskEdit={onTaskEdit}
            onTaskDelete={onTaskDelete}
          />
        ))}
      </div>
    </DndProvider>
            </>
          ) : (
            <p className="text-center text-gray-500">No module selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}
