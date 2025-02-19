// components/projects/modules/TaskColumn.tsx
import { Task } from "@prisma/client";
import { useDrop } from "react-dnd";
import { DraggableTask } from "./DraggableTask ";
import TaskForm from "@/components/Forms/TaskForm";


const TASK_TYPE = "task";  // Add this constant

interface TaskColumnProps {
  status: string;
  moduleId : string
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: string) => Promise<void>;
  onTaskEdit: (taskId: string) => void;
  onTaskDelete: (taskId: string) => void;
  fetchModules: () => void;
}

export const TaskColumn = ({ fetchModules,moduleId,status, tasks, onTaskMove, onTaskEdit, onTaskDelete }: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: TASK_TYPE,
    drop: (item: { id: string }) => {
      onTaskMove(item.id, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col ${
        isOver ? "bg-gray-100 dark:bg-gray-800" : ""
      }`}
    >
      <div
        className={`p-3 py-1 flex justify-between items-center rounded-md font-semibold ${
          status === "TODO"
            ? "bg-orange-100 dark:bg-orange-700"
            : status === "INPROGRESS"
            ? "bg-blue-100 dark:bg-blue-700"
            : "bg-green-100 dark:bg-green-700"
        }`}
      >
        {status.replace("INPROGRESS", "In Progress")}
        <TaskForm moduleId={moduleId} onTaskAdded={fetchModules} initialStatus={status as "TODO" | "INPROGRESS" | "COMPLETE"} isDefault = {false} />
      </div>
      <ul className="space-y-2 mt-4 overflow-y-auto flex-1">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <DraggableTask
              status={status as "TODO" | "INPROGRESS" | "COMPLETE"}
              moduleId={moduleId}
              fetchModules={fetchModules}
              key={task.id}
              task={task}
              onTaskMove={onTaskMove}
              onTaskEdit={onTaskEdit}
              onTaskDelete={onTaskDelete}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No tasks in this category.</p>
        )}
      </ul>
    </div>
  );
};