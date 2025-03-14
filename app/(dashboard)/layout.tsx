import { getUserById } from "@/actions/users";
import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import SidebarV2 from "@/components/pages/SidebarV2";
import { authOptions } from "@/config/auth";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React, { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  const role = session.user.role
  
  if (role !== "USER" && role !== "MEMBER") {
    return notFound()
  }
  return (
    <div className="flex dark:bg-[#0F172A] min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area with left padding to account for sidebar */}
      <main className="flex-1 md:pl-64 overflow-x-hidden">
        {/* Navbar */}
        <Navbar session={session}  />
        
        {/* Page content */}
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
    // <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
    //   <Sidebar />
    //   {/* <SidebarV2 /> */}
    //   <div className="flex flex-col">
    //     <Navbar session={session} />
    //     {children}
    //   </div>
    // </div>
  );
}
