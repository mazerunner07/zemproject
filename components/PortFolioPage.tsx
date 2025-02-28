"use client"

import { useState } from "react"
import Image from "next/image"
import { Building2, Calendar, Github, Instagram, Linkedin, Mail, Twitter, Youtube } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PortfolioProfile, Project } from "@prisma/client"
import PortfolioCard from "./projects/PortfolioCard"
import { ProjectWithUser } from "@/types/types"
import { profile } from "console"
import Link from "next/link"
import SubscribeForm from "./Forms/SubscribeForm"
import { OtherPortfolioProjects } from "./OtherPortfolioProjects"
import { Separator } from "./ui/separator"
type ProjectCardProps = {
    title : string,
    description : string,
    revenue : string
    data : string
}

// Sample project data
const ProjectCard = ({project}:{project:Project}) => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <span className="mr-2">{}</span>
            {project.name}
          </CardTitle>
          <span className="text-sm text-blue-600">Budget: {project.budget?.toLocaleString()}</span>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">{project.description}</p>
          <div className="mt-4 h-[80px]">
            <Image width={800} height={800} alt="This is an Image" src={project.thumbnail??"./placeholder.svg"} />
          </div>
        </CardContent>
      </Card>
    )
  }
  export default function PortFolioPage({ otherProjects,projects,profile }: {otherProjects:ProjectWithUser[],projects : ProjectWithUser[],profile:PortfolioProfile}) {
    const [email, setEmail] = useState("")
  
    return (
      <>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="sticky top-0 h-screen w-[35%] flex-shrink-0 border-r bg-white p-8">
          <div className="flex flex-col items-center space-y-4">
            <Image width={300} className="rounded-lg" height={300} src={profile.profileImage ??"/placeholder.svg"} alt={profile.name} />
            <h1 className="text-2xl font-bold">{profile.name}</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>{profile.location}</span>
              <span>•</span>
              <span>{profile.projectCount} Projects</span>
            </div>
            <div className="flex gap-3  justify-between items-center">
            <Button asChild>
              <Link href={profile.bookingLink}>
              <Calendar className="h-4 w-4 mr-2" />
              Book Appointment
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="mailto:projectmin95@gmail.com">
              <Mail className="h-4 w-4 mr-2" />
              Mail Me
              </Link>
            </Button>
            </div>
            
            <p className="text-center text-wrap w-full text-sm p-5">
             {profile.description}
            </p>
            {/* Subscribe */}
            <div className="w-full">
              <SubscribeForm userId={profile.userId} />
              {/* <Input
                type="email"
                placeholder="Your email..."
                value={email}
                className="w-full"
              />
              <Button className="w-full bg-blue-500 hover:bg-blue-600">Subscribe</Button> */}
            </div>
            <div className="flex items-center space-x-4 pt-4">
                <Link className="hover:bg-blue-200 ring-blue-200 ring-1 rounded-full p-2" href={profile.twitterUrl??""}>
                <Twitter className="hover:scale-110  h-4 w-4" />
                </Link>
                <Link className="hover:bg-red-200 ring-red-200 ring-1 rounded-full p-2" href={profile.youtubeUrl??""}>
                <Youtube className="h-4 w-4 hover:scale-110" />
                </Link>
                <Link className="hover:bg-blue-200 ring-blue-200 ring-1 rounded-full p-2" href={profile.linkedinUrl??""}>
                <Linkedin className="h-4 w-4 hover:scale-110" />
                </Link>
                <Link className="hover:bg-red-200 ring-red-200 ring-1 rounded-full p-2" href={profile.instagramUrl??""}>
                <Instagram className="h-4 w-4 hover:scale-110" />
                </Link>
                <Link className="hover:bg-blue-200 ring-blue-200 ring-1 rounded-full p-2" href={profile.githubUrl??""}>
                <Github className="h-4 w-4 hover:scale-110" />
                </Link>
            </div>
          </div>
        </div>
  
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project,index) => (
  <PortfolioCard key={index} project={project} />
))}

          </div>
        </main>
      </div>
      <Separator />
        <div className="">
          <OtherPortfolioProjects otherProjects={otherProjects} />
        </div>
      </>
    )
  }

