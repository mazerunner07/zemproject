"use server";

import { db } from "@/prisma/db";
import { CommentProps, ModuleProps, TaskProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createTask(data: TaskProps) {
  
  try {
    
    const newTask = await db.task.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/dashboard/projects");
    return newTask;
  } catch (error) {
    console.log(error);
    return null;
  }
}
// export async function getProjectModules(projectId : string | undefined) {
//   if (projectId) {
    
//     try {
//       const modules = await db.module.findMany({
//       orderBy: {
//         createdAt: "desc",
//       },  
//       where :{
//         projectId  
//       },
//       include:{
//         tasks:true,
//       }
//     });

//     return modules;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }
// }
export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    const updatedTask = await db.task.update({
      where: {
        id: taskId,
      },
      data: {
        status: newStatus,
      },
    });
    revalidatePath("/dashboard/projects");
    return updatedTask;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
}
export async function getProjectModules(projectId: string) {
  try {
    const modules = await db.module.findMany({
      orderBy: { createdAt: "desc" },
      where: { projectId },
      include: { tasks: true },
    });

    return modules || []; // Ensure it never returns null
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}

export async function updateTaskById(id: string, data: TaskProps) {
  try {
    const updatedTask = await db.task.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/projects");
    return updatedTask;
  } catch (error) {
    console.log(error);
  }
}
export async function getModuleById(id: string) {
  try {
    const modules = await db.module.findUnique({
      where: {
        id,
      },
    });
    return modules;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteTask(id: string) {
  try {
    const deletedTask = await db.task.delete({
      where: {
        id,
      },
    });
// revalidatePath('dashboard/projects')
    return {
      ok: true,
      data: deleteTask,
    };
  } catch (error) {
    console.log(error);
  }
}

