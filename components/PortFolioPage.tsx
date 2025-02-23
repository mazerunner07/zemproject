"use client"

import { useState } from "react"
import Image from "next/image"
import { Building2, Instagram } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Project } from "@prisma/client"
import PortfolioCard from "./projects/PortfolioCard"
import { ProjectWithUser } from "@/types/types"
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
  export default function PortFolioPage({ projects }: {projects : ProjectWithUser[]}) {
    const [email, setEmail] = useState("")
  
    return (
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="sticky top-0 h-screen w-90 flex-shrink-0 border-r bg-white p-8">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-23%20104218-sYz0MUD1EhKvIXBZzUqAu1U8O2byVn.png"
                alt="Profile"
              />
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold">Marc Lou</h1>
            <div className="flex items-center space-x-2 text-gray-600">
              <Building2 className="h-4 w-4" />
              <span>Bali</span>
              <span>•</span>
              <span>$108.7k/month</span>
            </div>
            <p className="text-center italic text-gray-600">I was fired everywhere so I hired myself.</p>
            <p className="text-center text-sm text-gray-600">
              32,851 entrepreneurs read {" "}
              <a href="#" className="text-blue-600 hover:underline">
                Just Ship It:
              </a>
            </p>
            <p className="text-center text-sm text-gray-600">
              I share how to find startup ideas, launch fast, and get profitable 👇
            </p>
            <div className="w-full space-y-4 pt-4">
              <Input
                type="email"
                placeholder="Your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600">Subscribe</Button>
            </div>
            <div className="flex items-center space-x-4 pt-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <span className="text-gray-600">Build your Indie Page</span>
              </Button>
              <Button variant="outline" size="icon">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </aside>
  
        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.slice(0,4).map((project,index) => (
  <PortfolioCard key={index} project={project} />
))}

          </div>
        </main>
      </div>
    )
  }

