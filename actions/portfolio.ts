"use server";

import { db } from "@/prisma/db";
import { CommentProps, ModuleProps, PortfolioProps, TaskProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createPortfolioProfile(data: PortfolioProps) {
  
  try {
    console.log("backend: ",data)
    const newPortfolio = await db.portfolioProfile.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/portfolio");
    return newPortfolio;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function updatePortfolioById(id: string, data: PortfolioProps) {
  try {
    const updatedPortfolio = await db.portfolioProfile.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/portfolio/");
    return updatedPortfolio;
  } catch (error) {
    console.log(error);
  }
}
export async function getPortfolioByUserId(userId: string) {
  try {
    const data = await db.portfolioProfile.findUnique({
      where: {
        userId,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}