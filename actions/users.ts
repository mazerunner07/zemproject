"use server";

import { PasswordProps } from "@/components/Forms/ChangePasswordForm";
import { db } from "@/prisma/db";
import { UserProps } from "@/types/types";
import bcrypt, { compare } from "bcryptjs";
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
        plain: password,
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
export type ExistingUser = {
  id: string,
  name: string,
  email: string
}
export async function getExistingUsers() {
  try {
    const user = await db.user.findMany({
      where: {
        role: "USER"
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });
console.log("user: ",user )
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
export async function updateUserPassword(id: string, data: PasswordProps) {
  const existingUser = await db.user.findUnique({
    where : {
      id
    }
  })
  let passwordMatch: boolean = false;
            //Check if Password is correct
            if (existingUser && existingUser.password) {
              // if user exists and password exists
              passwordMatch = await compare(
                data.oldPassword,
                existingUser.password
              );
            }
            if (!passwordMatch) {
              // console.log("Password incorrect");
              return { error: "Old Password Incorrect", status: 403 };
            }
            const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data:{
        password : hashedPassword
      }
    });
    revalidatePath("/dashboard/clients");
    return { error: null, status: 200 };
  } catch (error) {
    console.log(error);
  }
}

export async function getKitUsers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
  const endpoint = `${baseUrl}/api/users/count`;

  console.log("Fetching count from:", endpoint);

  try {
    const res = await fetch(endpoint, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Invalid response type: ${contentType}`);
    }

    const data = await res.json();
    return data.count ?? 0;
  } catch (error) {
    console.error("Error fetching the count:", error);
    return 0;
  }
}
