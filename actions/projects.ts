"use server";

import { generateSlug } from "@/lib/generateSlug";
import { db } from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { ProjectProps, ProjectWithPayments } from "@/types/types";
import { ok } from "assert";

export async function createProject(data: ProjectProps) {
  const slug = data.slug || generateSlug(data.name);
  try {
    const userExists = await db.user.findUnique({
      where: { id: data.userId },
    });

    if (!userExists) {
      throw new Error(`User with ID ${data.userId} does not exist.`);
    }

    const existingProject = await db.project.findUnique({ where: { slug } });
    if (existingProject) {
      return { status: 409, error: `Project ${data.name} Already Exists`, data: null };
    }

    const newProject = await db.project.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        thumbnail: data.thumbnail,
        startDate: data.startDate,
        clientId: data.clientId,
        userId: data.userId,
        deadline: data.deadline,
        endDate: data.endDate,
        budget: data.budget,
      },
    });

    revalidatePath("/dashboard/projects");
    return { status: 200, error: null, data: newProject };
  } catch (error) {
    console.log(`Project Error: ${error}`);
    return null;
  }
}

export async function getUserGuestProject(userId: string | undefined) {
  if (!userId) return null;

  try {
    return await db.guestProject.findMany({
      orderBy: { createdAt: "desc" },
      where: { 
        guestId : userId
       },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserMembers(userId: string | undefined) {
  if (!userId) return null;

  try {
    return await db.guestProject.findMany({
      orderBy: { createdAt: "desc" },
      where: { 
      ownerId : userId
       },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserProjectsCount(userId: string | undefined) {
  if (!userId) return null;

  try {
    return await db.project.count({
      where: { userId },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserProject(userId: string | undefined) {
  if (!userId) return null;

  try {
    return await db.project.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getDetailedUserProjects(userId: string | undefined) {
  if (!userId) return null;

  try {
    const projects =  await db.project.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId },
      select : {
        id : true,
        name : true,
        slug : true,
        thumbnail : true,
        payments : true
      },
      // include :{
      //   payments:true
      // }
    });
    return projects;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getUserRecentProject(userId: string | undefined) {
  if (!userId) return []; // Return an empty array instead of null
  try {
    return await db.project.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId },
      take: 1,
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getUserPublicProject(userId: string | undefined) {
  if (!userId) return []; // Return an empty array instead of null
  try {
    return await db.project.findMany({
      orderBy: { createdAt: "desc" },
      where: { userId , isPublic : true},
      include:{
        user:true
      }
    });
  } catch (error) {
    console.log(error);
    return [];
  }
}


export async function updateProjectById(id: string, data: ProjectProps) {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    throw new TypeError(`Invalid data: ${JSON.stringify(data)}`);
  }

  try {
    return await db.project.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        thumbnail: data.thumbnail,
        startDate: data.startDate ? new Date(data.startDate).toISOString() : null,
        clientId: data.clientId,
        userId: data.userId,
        deadline: data.deadline,
        endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
        budget: data.budget,
        notes: data.notes,
        freeDomain: data.freeDomain,
        customDomain: data.customDomain, 
      },
    });
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}
export async function updateProjectPublicity(id: string, isPublic: boolean) {
  try {
    const updatedProject = await db.project.update({
      where: { id },
      data: {
        isPublic
      },
    });
    return{
      data : updatedProject,
      ok : true
    }
  } catch (error) {
    return { 
      data : null,
      ok:false
    }
  }
}

export async function getProjectDetailsBySlug(slug: string) {
  try {
    console.log("Fetching project details for slug:", slug);

    const project = await db.project.findUnique({
      where: { slug },
      include: {
        modules: true,
        comments: true,
        members: true,
        invoices: true,
        payments: true,
        portfolioItems: true,
        user: true,
      },
    });

    if (!project) return null;

    const client = await db.user.findFirst({
      where: { id: project.clientId, role: "CLIENT" },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        image: true,
        country: true,
        location: true,
        plain: true,
        role: true,
        companyName: true,
        companyDescription: true,
      },
    });

    return { ...project, client };
  } catch (error) {
    console.error("Error fetching project details:", error);
    return null;
  }
}

export async function getProjectById(id: string) {
  try {
    return await db.project.findUnique({ where: { id } });
  } catch (error) {
    console.log(error);
    return null;
  }
}

// export async function deleteProject(id: string) {
//   try {
//     return { ok: true, data: await db.project.delete({ where: { id } }) };
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }
export async function deleteProject(id: string) {
  if (!id) {
    return { ok: false, error: "Project ID is required for deletion." };
  }

  try {
    const existingProject = await db.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return { ok: false, error: "Project not found." };
    }

    const deletedProject = await db.project.delete({
      where: { id },
    });

    return { ok: true, data: deletedProject };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { ok: false, error: error.message || "Deletion failed." };
  }
}
