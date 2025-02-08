"use server";

import { db } from "@/prisma/db";
import { DollarSign, LayoutGrid, LucideProps, Users } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
export type AnalyticsProps = {
  title : string;
      total: number;
      href: string;
      icon : any;
      isCurrency : boolean
}
export async function getDashboardOverview(userId: string | undefined) {
  if(userId){
    try {
      const projects = await db.project.findMany({
        where: {
          userId
        }
      });
      const clientLength = await db.user.count({
        where: {
          userId,
          role : "CLIENT"
        }
      });
      const totalRevenue = projects && projects.length > 0 
  ? projects.reduce((acc, item) => acc + (item.budget ?? 0), 0) 
  : 0;

  const analytics=[
    {
      title : "Projects",
      total: projects.length,
      href: "/dashboard/projects",
      icon : LayoutGrid
    },
    {
      title : "Total Revenue",
      total: totalRevenue,
      href: "/dashboard/projects",
      icon : DollarSign,
      isCurrency:true
    },
    {
      title : "Clients",
      total: clientLength,
      href: "/dashboard/clients",
      icon : Users
    }
  ]
      return analytics;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

