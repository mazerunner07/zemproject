"use server";

import { generateSlug } from "@/lib/generateSlug";
import { db } from "@/prisma/db";
import { ProjectData, ProjectProps } from "@/types/types";
import { error } from "console";
import { promises } from "dns";
import { revalidatePath } from "next/cache";


//  export async function createProject(data: ProjectProps) {
//    let slug = data.slug || generateSlug(data.name);
//    console.log("Generated slug:", slug); 
//    try{
//      const existingProject = await db.project.findUnique({
//        where:{
//          slug,
//        }
//      });
//      if(existingProject) {
//        return {
//          status:409,
//          error: `Project ${data.name} Already Exists`
//        };
//      }
//      const newProject = await db.project.create({
//        data:{
//          name: data.name,
//          slug: slug,
//          description: data.description,
//          thumbnail:data.thumbnail,
//          startDate: data.startDate,
//          clientId: data.clientId,
//          userId: data.userId,
//          deadline: data.deadline,
//          endDate: data.endDate,
//          budget: data.budget
//        },
//      })
//      revalidatePath("/dashboard/projects");
//      return newProject;
//    }catch (error) {
//      console.log(error);
//      return null;
//    }
//  }


export async function createProject(data: ProjectProps) {
  const slug = data.slug;
  try {

    const userExists = await db.user.findUnique({
      where: {
        id: data.userId,
      },
    });

    if (!userExists) {
      throw new Error(`User with ID ${data.userId} does not exist.`);
    }

    const existingProject = await db.project.findUnique({
      where: {
        slug,
      },
    });
    if (existingProject) {
      return {

        status: 409,
         error: `Project ${data.name} Already Exists`,
        data:null
      }
    }
    const newProject = await db.project.create({
      data:{
        name: data.name,
        slug: data.slug,
        description: data.description,
        thumbnail: data.thumbnail,
        startDate: data.startDate,
        // new Date(data.startDate) : undefined,
        clientId: data.clientId,
        userId: data.userId,
        deadline: data.deadline,
        endDate: data.endDate,
        budget: data.budget
      },
    });

    console.log(newProject);
    console.log("Payload received:", data);
console.log("Starting save operation...");
    revalidatePath("/dashboard/projects");
    return {
      status:200,
      error:null,
      data:newProject
    };
  } catch (error) {
    console.log(`Project Error: ${error}`);
    return null;
  }
}


export async function getUserProject(userId: string | undefined) {
  if(userId){
    try {
      const project = await db.project.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where:{
          userId
        }
      });
  
      return project;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function updateProjectById(id: string, data: ProjectProps) {
  // ✅ Validate `data` before proceeding
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    throw new TypeError("The 'data' argument must be a valid object. Received: " + JSON.stringify(data));
  }

  try {
    console.log("Updating project:", id, "with data:", data);

    const updatedProject = await db.project.update({
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
      },
    });

    revalidatePath("/dashboard/projects");
    return updatedProject;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function getProjectDetailsBySlug(slug: string): Promise<ProjectData | null> {
  try {
    console.log("Fetching project details for slug:", slug);
    const project = await db.project.findUnique({
      where: {
        slug,
      },
      include:{
        modules:true,
        comments:true,
        members:true,
        invoices:true,
        payments: true,
      }
    });

    if(!project) {
      return null;
    }

    const client = await db.user.findFirst({
        where:{
          id: project.clientId,
          role: "CLIENT"
        },
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
          role: true,
          companyName: true,
          companyDescription: true
        }
    })

    if (!client) {
      console.log("No client found for project:", project.id);
      return null;
    }

    const projectData: ProjectData = {
      ...project,
      client,

    }

    return projectData;

  } catch (error) {
    console.error('Error fetching project Details:', error);
    return null;
  }
  
}

export async function getProjectById(id: string) {
  try {
    const project = await db.project.findUnique({
      where: {
        id,
      },
    });
    return project;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteProject(id: string) {
  try {
    const deletedProject = await db.project.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deletedProject,
    };
  } catch (error) {
    console.log(error);
  }
}

