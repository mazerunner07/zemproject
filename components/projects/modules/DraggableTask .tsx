// DraggableTask.tsx
import { useDrag } from "react-dnd";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, ChevronRight, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TaskForm from "@/components/Forms/TaskForm";

const TASK_TYPE = "task";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface DraggableTaskProps {
  status: string;
  moduleId : string
  fetchModules: () => void;
  task: Task;
  onTaskMove: (taskId: string, newStatus: string) => Promise<void>;
  onTaskEdit: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export const DraggableTask = ({status,moduleId,fetchModules, task, onTaskMove, onTaskEdit, onTaskDelete }: DraggableTaskProps) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: TASK_TYPE,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className="cursor-move"
    >
      <Card className="flex p-2 justify-between bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 items-center">
        <div className="flex items-center">

        <ChevronRight className="w-4 h-4 mr-2" />
        <span>{task.title}</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex-col justify-center items-center " align="end">
            <div>
              <TaskForm initialTitle={task.title} moduleId={moduleId} editingId={task.id} onTaskAdded={fetchModules} initialStatus={status as "TODO" | "INPROGRESS" | "COMPLETE"} isDefault = {false} />
            </div>
              
            <Button variant="ghost" className="flex w-full dark:hover:bg-gray-700  hover:bg-red-100 items-center justify-center" onClick={() => onTaskDelete(task.id)}>
              <Trash className="w-4 h-4 mr-2 text-red-500" />
              Delete
            </Button>
              
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </div>
  );
};