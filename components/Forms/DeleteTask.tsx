'use client'
import { deleteTask } from "@/actions/tasks"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import toast from "react-hot-toast"

export function DeleteTask({ id, onTaskDeleted }: { id: string; onTaskDeleted: () => void }) {
  async function handleDeleteTask() {
    try {
      const res = await deleteTask(id);
      if (res?.ok) {
        toast.success("Task Deleted");
        onTaskDeleted(); // Refresh tasks
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    }
  }

  return (
    
      <Button className="flex items-center w-full hover:bg-red-100 justify-center" variant="ghost" onClick={handleDeleteTask}>
        <Trash2 className="h-4 w-4 mr-2 text-red-500" />
        Delete
      </Button>
    
  );
}
