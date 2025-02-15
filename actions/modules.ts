"use server";

import { db } from "@/prisma/db";
import { CommentProps, ModuleProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createModule(data: ModuleProps) {
  
  try {
    
    const newModule = await db.module.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/dashboard/projects");
    return newModule;
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
export async function getProjectModules(projectId: string) {
  try {
    return await db.module.findMany({
      orderBy: { createdAt: "desc" },
      where: { projectId },
      include: { tasks: true },
    }) || [];
  } catch (error) {
    console.error("Error fetching modules:", error);
    return [];
  }
}
export async function updateModuleById(id: string, data: CommentProps) {
  try {
    const updatedModule = await db.module.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/projects");
    return updatedModule;
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
export async function deleteModule(id: string) {
  try {
    const deletedModule = await db.module.delete({
      where: {
        id,
      },
    });
revalidatePath('dashboard/projects')
    return {
      ok: true,
      data: deletedModule,
    };
  } catch (error) {
    console.log(error);
  }
}

