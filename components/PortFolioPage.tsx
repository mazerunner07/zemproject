"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Building2,
  Calendar,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioProfile, Project } from "@prisma/client";
import PortfolioCard from "./projects/PortfolioCard";
import { ProjectWithUser } from "@/types/types";
import Link from "next/link";
import SubscribeForm from "./Forms/SubscribeForm";
import { OtherPortfolioProjects } from "./OtherPortfolioProjects";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export default function PortFolioPage({
  otherProjects,
  projects,
  profile,
}: {
  otherProjects: ProjectWithUser[];
  projects: ProjectWithUser[];
  profile: PortfolioProfile;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const renderSidebarContent = () => (
    <div className="flex  flex-col items-center space-y-5 w-full px-4">
      <Image
        width={275}
        height={275}
        className="rounded-lg shadow-lg border border-[#1E40AF] max-w-[250px] w-full"
        src={profile.profileImage ?? "/placeholder.svg"}
        alt={profile.name}
      />
      <h1 className="text-2xl font-bold text-[#1E3A8A] dark:text-white text-center">{profile.name}</h1>
      <div className="flex items-center space-x-2 text-[#3B5998]">
        <Building2 className="h-4 w-4 dark:text-white" />
        <span className="dark:text-white">{profile.location}</span>
        <span className="dark:text-white">•</span>
        <span className="dark:text-white">{profile.projectCount} Projects</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <Button asChild className="bg-[#00B1F3] hover:bg-[#56cdf8] text-white w-full">
          <Link href={profile.bookingLink}>
            <Calendar className="h-4 w-4 mr-2" />
            Book Appointment
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border bg-[#ffffff] text-[#00B1F3] w-full"
        >
          <Link href="mailto:projectmin95@gmail.com">
            <Mail className="h-4 w-4 mr-2" />
            Mail Me
          </Link>
        </Button>
      </div>

      {/* Description */}
      <p className="text-center w-full text-sm px-5 dark:text-white/50 text-[#3B5998]">
        {profile.description}
      </p>

      {/* Subscribe */}
      <div className="w-full">
        <SubscribeForm userId={profile.userId} />
      </div>

      {/* Social Icons */}
      <div className="flex items-center space-x-4 pt-4">
        <Link className="hover:bg-blue-200 ring-[#1E40AF] ring-1 rounded-full p-2 transition-all" href={profile.twitterUrl ?? ""}>
          <Twitter className="h-4 w-4 text-[#1E3A8A]" />
        </Link>
        <Link className="hover:bg-red-100 ring-[#EF4444] ring-1 rounded-full p-2 transition-all" href={profile.youtubeUrl ?? ""}>
          <Youtube className="h-4 w-4 text-[#DC2626]" />
        </Link>
        <Link className="hover:bg-blue-200 ring-[#1E40AF] ring-1 rounded-full p-2 transition-all" href={profile.linkedinUrl ?? ""}>
          <Linkedin className="h-4 w-4 text-[#3B5998]" />
        </Link>
        <Link className="hover:bg-red-100 ring-[#BE185D] ring-1 rounded-full p-2 transition-all" href={profile.instagramUrl ?? ""}>
          <Instagram className="h-4 w-4 text-[#BE185D]" />
        </Link>
        <Link className="hover:bg-gray-200 ring-[#4B5563] ring-1 rounded-full p-2 transition-all" href={profile.githubUrl ?? ""}>
          <Github className="h-4 w-4 text-[#374151]" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-white dark:bg-[#121212] border-b p-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          {isMobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <h1 className="text-xl font-bold text-[#1E3A8A] dark:text-white">{profile.name}</h1>
        <div className="w-10"></div> {/* Placeholder to center the title */}
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
        <SheetContent side="left" className="w-[300px] p-0 overflow-y-auto">
          <div className="pt-8">
            {renderSidebarContent()}
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen bg-[#FFFFFF] text-[#1E3A8A]">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block sticky top-0 h-screen w-[35%] flex-shrink-0 border-r border-[#1E40AF] dark:bg-[#0F172A]  p-8 overflow-y-auto">
          {renderSidebarContent()}
        </div>
        {/* Main Content */}
        <main className="flex-1 dark:bg-[#0F172A] p-4 lg:p-8">
          <div className="grid grid-cols-1  gap-6 md:grid-cols-2 lg:grid-cols-2">
            {projects.map((project, index) => (
              <PortfolioCard key={index} project={project} />
            ))}
          </div>
        </main>
      </div>

      <Separator className="border-[#1E40AF]" />
      <div className="bg-[#FFFFFF] ">
        <OtherPortfolioProjects otherProjects={otherProjects} />
      </div>
    </>
  );
} 