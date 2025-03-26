"use server";

import { db } from "@/prisma/db";
import { UserProps } from "@/types/types";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function createClient(data: UserProps) {
  
  if (!data || typeof data !== 'object') {
    return {
      error: "Invalid client data provided",
      status: 400,
      data: null,
    };
  }

  const { email, password, firstName, lastName, name, phone, image, country, location, userId, companyName, companyDescription ,role} = data;
  
  // Validate required fields
  if (!email || !password || !firstName || !lastName) {
    return {
      error: "Missing required fields",
      status: 400,
      data: null,
    };
  }

  try {
    // Check for existing user
    const existingClient = await db.user.findUnique({
      where: { email },
    });

    if (existingClient) {
      return {
        error: "Email already exists",
        status: 409,
        data: null,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newClient = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        plain: role === 'CLIENT' ? password : "",
        firstName,
        lastName,
        name: name || `${firstName} ${lastName}`,
        phone: phone || "",
        image: image || "",
        role: UserRole.CLIENT,
        country, 
        location,
        userId,
        companyName,
        companyDescription
      },
    });
  revalidatePath("/dashboard/clients");
    return {
      error: null,
      status: 200,
      data: newClient,
    };
  } catch (error) {
    console.error("Client creation error:", error);
    return {
      error: "Failed to create user",
      status: 500,
      data: null,
    };
  }
}

export async function getUserClient(userId: string | undefined) {
  if(userId){
    try {
      const clients = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          role: "CLIENT",
          userId
        }
      });
  
      return clients;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export async function getUserRecentClient(userId: string | undefined) {
  if(userId){
    try {
      const users = await db.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          role: "CLIENT",
          userId
        }
      });
  
      return users;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}


export async function updateClientById(id: string, data: Partial<UserProps>) {
  try {
    const transformedData = {
      ...data,
      role: UserRole.CLIENT,
    };

    const updatedClient = await db.user.update({
      where: { id },
      data: transformedData,
    });

    // revalidatePath("/dashboard/clients");
    return updatedClient;
  } catch (error) {
    console.error(`Error updating client: ${error}s`);
    throw error;
  }
}

export async function getClientsById(id: string) {
  try {
    const getClient = await db.user.findUnique({
      where: { id },
    });

    // revalidatePath("/dashboard/clients/update/[id]");
    return getClient;
  } catch (error) {
    console.error("Error finding client:", error);
    throw error;
  }
}

export async function deleteClient(id: string) {
  try {
    const deletedClient = await db.user.delete({
      where: {
        id, // Use the unique identifier
      },
    });
    revalidatePath("/dashboard/clients");
    return {
      ok: true,
      data: deletedClient,
    };
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return {
      ok: false,
      error: error.message || "An error occurred while deleting the category.",
    };
  }
}

export async function createBulkCategories(clients: UserProps[]) {
  try {
    for (const client of clients) {
      await createClient(client);
    }
  } catch (error) {
    console.log(error);
  }
}


export async function getKitUsers() {
  const endpoint = process.env.KIT_API_ENDPOINT as string;
  try {
    const res = await fetch(endpoint, {
      next: { revalidate: 0 }, // Revalidate immediately
    });
    const response = await res.json();
    const count = response.count;
    console.log(count);
    return count;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}
