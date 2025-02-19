"use server";

import { db } from "@/prisma/db";
import { CategoryProps, InvoiceDetails, PaymentProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createPayment(data: PaymentProps) {
  try {

    console.log(data)
    const payment = await db.payment.create({
      data,
    });

    revalidatePath("/dashboard/projects");
    return payment;
  } catch (error) {
    console.error("Error creating payment:", error);
    return null;
  }
}

// ✅ Fix: Correct function to fetch payments
export async function getInvoiceById(id: string) {
  try {
    const payment = await db.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return null;
    }

    // Fetch the user (business owner)
    const user = await db.user.findUnique({
      where: {
        id: payment.userId,
        role: "USER",
      },
      select: {
        name: true,
        phone: true,
        email: true,
        companyName: true,
        companyDescription: true,
        userLogo: true,
      },
    });

    // Fetch the client
    const client = await db.user.findUnique({
      where: {
        id: payment.clientId,
        role: "CLIENT",
      },
      select: {
        name: true,
        phone: true,
        email: true,
        companyName: true,
        companyDescription: true,
      },
    });

    return {
      invoice: payment,
      user,
      client,
    } as InvoiceDetails;
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }
}


// ✅ Update category by ID with validation
export async function updateCategoryById(id: string, data: CategoryProps) {
  try {
    if (!id || !data) {
      throw new Error("Invalid category update: Missing ID or data.");
    }

    const updatedCategory = await db.category.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/categories");
    return updatedCategory;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
}

// ✅ Fetch category by ID safely
export async function getPayementById(id: string) {
  try {
    if (!id) throw new Error("Category ID is required.");

    const payment = await db.payment.findUnique({
      where: { id },
    });

    return payment;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
  }
}

// ✅ Delete category safely
export async function deletePayment(id: string) {
  try {
    if (!id) throw new Error("Category ID is required for deletion.");

    const deletePayment = await db.payment.delete({
      where: { id },
    });

    return {
      ok: true,
      data: deletePayment,
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { ok: false, error};
  }
}
