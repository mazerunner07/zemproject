"use server";

import { db } from "@/prisma/db";
import { UserProps } from "@/types/types";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function createUser(data: UserProps) {
  if (!data || typeof data !== 'object') {
    return {
      error: "Invalid user data provided",
      status: 400,
      data: null,
    };
  }

  const { email, password, firstName, lastName, name, phone, image, country, location, userId, companyName, companyDescription } = data;

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
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: "Email already exists",
        status: 409,
        data: null,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: name || `${firstName} ${lastName}`,
        phone: phone || "",
        image: image || "",
        role: "USER",
        country,
        location,
        userId,
        companyName,
        companyDescription
      },
    });
  revalidatePath("/dashboard/users");
    return {
      error: null,
      status: 200,
      data: newUser,
    };
  } catch (error) {
    console.error("User creation error:", error);
    return {
      error: "Failed to create user",
      status: 500,
      data: null,
    };
  }
}

export async function deleteUser(id: string) {
  try {
    const deletedUser = await db.user.delete({
      where: {
        id, // Use the unique identifier
      },
    });

    return {
      ok: true,
      data: deletedUser,
    };
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return {
      ok: false,
      error: error.message || "An error occurred while deleting the category.",
    };
  }
}
export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        id, // Use the unique identifier
      },
    });

    return user;
  } catch (error) {
    console.error("Error in Get User By Id", error);
  }
}
export async function updateUserById(id: string, data: UserProps) {
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/clients");
    return updatedUser;
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
    return count;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}
