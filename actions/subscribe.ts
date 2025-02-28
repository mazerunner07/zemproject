"use server";

import { SubscribeProps } from "@/components/Forms/SubscribeForm";
import { db } from "@/prisma/db";
import { CommentProps, ModuleProps, PortfolioProps, TaskProps } from "@/types/types";
import { error } from "console";
import { revalidatePath } from "next/cache";

export async function createSubscription(data: SubscribeProps) {
  const {userId , email} = data
  if (userId) {
    const existingSub = await db.subscriber.findFirst({
      where:{
        email
      }
    })
    if (existingSub) {
      return{
        error:`you have already Subscribed`,
        status : 409,
        data : null
      }
    }
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
export async function deleteSubscriber(id: string) {
  try {
    const deletedSub = await db.task.delete({
      where: {
        id,
      },
    });
revalidatePath('dashboard/subscriber')
    return {
      ok: true,
      data: deletedSub,
    };
  } catch (error) {
    console.log(error);
  }
}