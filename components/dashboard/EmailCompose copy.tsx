"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X, Minimize2, Maximize2, Paperclip, Smile, Bold, Italic, Underline, List, ListOrdered } from "lucide-react"
import { Switch } from "../ui/switch"
import { Textarea } from "../ui/textarea"

interface Client {
  id: string
  name: string
  email: string
  avatarUrl?: string
  initials: string
  color?: string
}

const clients: Client[] = [
  { id: "1", name: "Madison Inoaye", email: "madison@example.com", initials: "MI", color: "bg-blue-500" },
  { id: "2", name: "Merva Sahin", email: "merva@example.com", initials: "MS", color: "bg-emerald-500" },
  { id: "3", name: "John Smith", email: "john@example.com", initials: "JS", color: "bg-purple-500" },
  { id: "4", name: "Sarah Johnson", email: "sarah@example.com", initials: "SJ", color: "bg-amber-500" },
  { id: "5", name: "Alex Wong", email: "alex@example.com", initials: "AW", color: "bg-pink-500" },
  { id: "6", name: "Maria Garcia", email: "maria@example.com", initials: "MG", color: "bg-indigo-500" },
]

export default function EmailCompose() {
  const [recipients, setRecipients] = useState<Client[]>([clients[0], clients[1]])
  const [subject, setSubject] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [broadcast, setBroadcast] = useState(false)
  const [attachments, setAttachments] = useState([{ name: "Design Documents.pdf", type: "pdf" }])
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [currentUser] = useState<Client>({
    id: "0",
    name: "John Miller",
    email: "john.miller@example.com",
    initials: "JM",
    color: "bg-red-500",
  })

  const addRecipient = (client: any) => {
    if (!recipients.some((r) => r.id === client.id)) {
      setRecipients([...recipients, client])
    }
    setSearchOpen(false)
  }

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter((r) => r.id !== id))
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-0">
        <h2 className="text-lg font-medium">New mail</h2>
        {/* <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div> */}
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-12 text-sm text-muted-foreground">From</div>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                <AvatarFallback className={currentUser.color}>{currentUser.initials}</AvatarFallback>
              </Avatar>
              <span className="text-sm">{currentUser.name}</span>
              <span className="text-xs text-muted-foreground">({currentUser.email})</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-12 text-sm text-muted-foreground pt-2">To</div>
            <div className="flex-1 flex flex-wrap items-center gap-1 min-h-10 p-2 border rounded-md focus-within:ring-1 focus-within:ring-ring">
              {recipients.map((recipient) => (
                <Badge key={recipient.id} variant="secondary" className="flex items-center gap-1 pl-1 h-6">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={recipient.avatarUrl} alt={recipient.name} />
                    <AvatarFallback className={recipient.color || "bg-primary"} style={{ fontSize: "10px" }}>
                      {recipient.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{recipient.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1 hover:bg-muted"
                    onClick={() => removeRecipient(recipient.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Input
                    ref={searchInputRef}
                    type="text"
                    className="border-0 flex-1 min-w-[120px] h-6 p-0 text-sm focus-visible:ring-0"
                    placeholder={recipients.length ? "" : "Add recipients..."}
                    onFocus={() => setSearchOpen(true)}
                  />
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px]" align="start">
                  <Command>
                    <CommandInput placeholder="Search clients..." />
                    <CommandList>
                      <CommandEmpty>No clients found.</CommandEmpty>
                      <CommandGroup>
                        {clients
                          .filter((client) => !recipients.some((r) => r.id === client.id))
                          .map((client) => (
                            <CommandItem
                              key={client.id}
                              onSelect={() => addRecipient(client)}
                              className="flex items-center gap-2"
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={client.avatarUrl} alt={client.name} />
                                <AvatarFallback className={client.color}>{client.initials}</AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span>{client.name}</span>
                                <span className="text-xs text-muted-foreground">{client.email}</span>
                              </div>
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-xs h-8">
                CC
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-8">
                BCC
              </Button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Subject</div>
            <Input placeholder="Type here..." value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          <Textarea className="min-h-[200px]" placeholder="Compose your email..." />

          {attachments.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Attachments</div>
              <div className="space-y-2">
                {attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <div className="h-6 w-6 bg-red-500 text-white rounded flex items-center justify-center text-xs">
                      PDF
                    </div>
                    <span className="text-sm flex-1">{attachment.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeAttachment(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <div className="border-t px-4 py-2">
        {/* <div className="flex flex-wrap items-center gap-2"> */}
          {/* <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Smile className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Emoji</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Underline className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Underline</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet list</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered list</TooltipContent>
            </Tooltip>
          </TooltipProvider> */}
        {/* </div> */}
      </div>

      <CardFooter className="flex justify-between items-center p-4 pt-2">
        <div className="flex items-center gap-2">
          <Switch id="broadcast" checked={broadcast} onCheckedChange={setBroadcast} />
          <Label htmlFor="broadcast" className="text-sm">
            Broadcast
          </Label>
        </div>

        <div className="flex items-center gap-2">
            <TooltipProvider>
        <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full h-8 px-2">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
            </TooltipProvider>
          <Button variant="outline">Discard</Button>
          <Button>Send email</Button>
        </div>
      </CardFooter>

      <div className="text-xs text-muted-foreground p-4 pt-0 border-t">
        Your signature will be included when you use this template.{" "}
        <a href="#" className="text-primary hover:underline">
          Edit Signature
        </a>
      </div>
    </Card>
  )
}

