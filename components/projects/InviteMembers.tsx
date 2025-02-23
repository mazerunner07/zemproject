"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Search, UserPlus, Users, X } from "lucide-react"
import { ExistingUser } from "@/actions/users"
import { InvitationDetailsProps, sendMemberInvitation } from "@/actions/email"
import { ProjectData } from "@/types/types"
import toast from "react-hot-toast"


export default function InviteMembersButton(
    {allMembers,projectData}:{allMembers : ExistingUser[],projectData:ProjectData}
) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMembers, setSelectedMembers] = useState<ExistingUser[]>([])
// console.log("all member : ",allMembers)
  const filteredMembers = searchQuery
    ? allMembers.filter(
        (member) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  const handleMemberToggle = (memberId: string) => {
    const member = allMembers.find((user) => user.id === memberId)
    if (!member) {
        return
    }
    const updatedList = [...selectedMembers,member]
    setSelectedMembers(updatedList)
    setSearchQuery("")
  }

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = selectedMembers.filter((member) =>member.id !== memberId)
    setSelectedMembers(updatedMembers)
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

const projectDetails : InvitationDetailsProps =  {
    loginLink :  `${baseUrl}/login?returnUrl=/project/${projectData.slug}`,
    projectName : projectData.name,
    projectOwner : projectData.user.name,
    projectOwnerId: projectData.userId
}
const [sending,setSending] = useState(false)
  const handleInvite = async () => {
    console.log("Inviting members:", selectedMembers)
    setSending(true)
    try {
        const res = await sendMemberInvitation(selectedMembers , projectDetails)
        setIsOpen(false)
        setSelectedMembers([])
        setSearchQuery("")
        setSending(false)
        toast.success("Invitation Sent Successfully")
    } catch (error) {
        setSending(false)
        console.log(error)
    }
  }
  return (

    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="mt-4 w-full dark:border-gray-700 dark:text-white">
          <Users className="mr-2 h-4 w-4" /> Manage Team
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Invite Members</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full py-4">
          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Selected Members Preview */}
          {selectedMembers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Selected Members</h3>
              <div className="space-y-2">
                {selectedMembers.map((user) => {
                  const member = allMembers.find((m) => m.id === user.id)
                  if (!member) return null
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
                    >
                      <div>
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.email}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(user.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="flex-grow overflow-y-auto mb-4">
            {searchQuery ? (
              filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={`member-${member.id}`}
                      checked={selectedMembers.some(user => user.id === member.id)}
                      onCheckedChange={() => handleMemberToggle(member.id)}
                    />
                    <label
                      htmlFor={`member-${member.id}`}
                      className="flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <div>{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No members found</p>
              )
            ) : (
              <p className="text-center text-muted-foreground">Type to search for members</p>
            )}
          </div>

          {/* Invite Button */}
          {sending ? (<Button disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending Invitation Please Wait
          </Button>):
          (<Button onClick={handleInvite} disabled={selectedMembers.length === 0}>
            Invite Selected Members
          </Button>)}
        </div>
      </SheetContent>
    </Sheet>
  )
}