"use server";

import { SubscribeProps } from "@/components/Forms/SubscribeForm";
import { db } from "@/prisma/db";
import { CommentProps, ModuleProps, PortfolioProps, TaskProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createSubscription(data: SubscribeProps) {
  const userId = data.userId
  console.log("backend: ",data)
  if (userId) {
    
    try {
      const subscriber = await db.subscriber.create({
        data,
      });
      // console.log(newCategory);
      revalidatePath("/dashboard/subscribers");
      return subscriber;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export async function getUserSubscribers(userId: string) {
  try {
    const data = await db.subscriber.findMany({
      where: {
        userId,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
}