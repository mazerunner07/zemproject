"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { getModuleById, getProjectModules } from "@/actions/modules";
import { notFound } from "next/navigation";

export default function Page({ params, searchParams }: { params: { id: string }; searchParams: { [key: string]: string | string[] | undefined } }) {
  const { pId } = searchParams;
  const [modules, setModules] = useState([]);
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], complete: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      if (!pId) return;
      try {
        const activeModule = await getModuleById(id)
        const projectModules = await getProjectModules(pId as string) || [];
        if (!activeModule || module?.length<0) {
          return notFound()
        }
        setModules(projectModules);

        const categorizedTasks = { todo: [], inProgress: [], complete: [] };
        projectModules.forEach(module => {
          module.tasks.forEach(task => {
            if (task.status === "TODO") categorizedTasks.todo.push(task);
            else if (task.status === "INPROGRESS") categorizedTasks.inProgress.push(task);
            else if (task.status === "COMPLETE") categorizedTasks.complete.push(task);
          });
        });
        setTasks(categorizedTasks);
      } catch (error) {
        console.error("Error fetching modules:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, [pId]);

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-8 h-screen flex">
        {/* Left Side - Project Modules */}
        <div className="w-1/4 bg-white rounded-xl shadow-lg p-6 flex flex-col space-y-4 overflow-hidden h-full">
          <h2 className="text-2xl font-bold">Project Modules</h2>
          {loading ? <p>Loading...</p> : (
            <div className="space-y-4 overflow-y-auto no-scrollbar flex-1">
              {modules.map(module => (
                <Card key={module.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors cursor-pointer">
                  <CardHeader className="flex justify-between items-center">
                    <CardTitle>{module.name}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
          <Button className="mt-auto">+ Add Module</Button>
        </div>

        {/* Right Side - Tasks and Progress */}
        <div className="w-3/4 bg-white rounded-xl shadow-lg p-6 space-y-6 flex flex-col h-full">
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{
                width: `${
                  (tasks.complete.length /
                    (tasks.todo.length + tasks.inProgress.length + tasks.complete.length)) *
                    100 || 0
                }%`,
              }}
            ></div>
          </div>

          {/* Task Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-y-auto no-scrollbar">
            {Object.entries({ todo: "Todo", inProgress: "In Progress", complete: "Complete" }).map(([columnId, title]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div className="bg-secondary p-4 rounded-lg h-full flex flex-col" ref={provided.innerRef} {...provided.droppableProps}>
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold">{title}</h2>
                      <Button size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <ul className="space-y-2 overflow-y-auto no-scrollbar flex-1">
                      {tasks[columnId]?.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-background p-3 rounded-md shadow-sm">
                              <div className="flex items-center justify-between">
                                <span>{task.title}</span>
                                <div className="space-x-2">
                                  <Button size="icon" variant="ghost">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
