"use server";

import { db } from "@/prisma/db";
import { CommentProps, FileProps, FolderProps, ModuleProps, TaskProps, UserFolder } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createFolder(data: FolderProps) {
  
  try {
    
    const newFolder = await db.folder.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/dashboard/file-manager");
    return newFolder;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function createFile(data: FileProps[]) {
  

  try {
    const newFile = await db.file.createMany({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/dashboard/file-manager");
    return newFile;
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
export async function getUserFolder(userId: string) {
  try {
    const folders = await db.folder.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId },
      include: { files: true },
    });

    return folders as UserFolder[]; // Ensure it never returns null
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
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
export async function deleteFolder(id: string) {
  try {
    const deletedFolder = await db.folder.delete({
      where: {
        id,
      },
    });
revalidatePath('dashboard/file-manager')
    return {
      ok: true,
      data: deleteFolder,
    };
  } catch (error) {
    console.log(error);
  }
}
export async function deleteFile(id: string) {
  try {
    const deletedFile = await db.file.delete({
      where: {
        id,
      },
    });
revalidatePath('dashboard/file-manager')
    return {
      ok: true,
      data: deletedFile,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function updateFolderById(id: string, data: FolderProps) {
  try {
    const updatedFolder = await db.folder.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/file-manager");
    return updatedFolder;
  } catch (error) {
    console.log(error);
  }
}
export async function updateFileById(id: string, data: FileProps) {
  try {
    const updatedFile = await db.file.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/file-manager");
    return updatedFile;
  } catch (error) {
    console.log(error);
  }
}