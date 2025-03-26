import type React from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Add custom scrollbar-hide class
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;  /* Chrome, Safari and Opera */
  }
`

interface RecentClient {
  id: string
  name: string
  email: string
  image?: string
  location?: string
}

interface RecentClientsProps {
  recentClients: RecentClient[]
}

function getInitials(name: string | undefined): string {
  if (!name) return ""
  const parts = name.split(" ")
  let initials = ""
  for (let i = 0; i < parts.length; i++) {
    initials += parts[i].charAt(0).toUpperCase()
  }
  return initials
}

const RecentClients: React.FC<RecentClientsProps> = ({ recentClients }) => {
  return (
    <Card className="w-full dark:bg-[#1E293B] bg-[#F8FAFB]">
      <style>{scrollbarHideStyles}</style>
      <CardHeader>
        <CardTitle>Recent Clients</CardTitle>
        <CardDescription>Here are some of your recent clients.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-auto scrollbar-hide">
          {recentClients.length > 0 ? (
            recentClients.map((client) => (
              <div
                key={client.id}
                className="flex-none flex items-center bg-white dark:bg-[#0F172A] mb-2 p-4 rounded-lg shadow-sm w-full justify-between"
              >
                <div className="flex items-center">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src={client.image ?? ""} alt={client.name || "Avatar"} />
                    <AvatarFallback>{getInitials(client.name)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-6 space-y-1">
                    <p className="text-sm font-medium leading-none">{client.name}</p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-8 font-medium text-sm">{client.location ?? "Unknown"}</div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recent clients found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentClients

