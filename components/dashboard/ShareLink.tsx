"use client"

import { useState, useCallback } from "react"
import { Copy, Share, Twitter, Linkedin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import toast from "react-hot-toast"
import { FaWhatsapp } from "react-icons/fa"

interface ShareLinkProps {
  link: string
}

export function ShareLink({ link }: ShareLinkProps) {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(link).then(() => {
      setIsCopied(true)
      toast.success("Link copied to clipboard!")
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [link])

  const handleShare = (name: string, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
    toast.success(`Shared on ${name}!`)
  }

  const shareOptions = [
    { name: "Copy", icon: Copy, action: copyToClipboard },
    { name: "Twitter", icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}` },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
    },
    { name: "WhatsApp", icon: FaWhatsapp, url: `https://wa.me/?text=${encodeURIComponent(link)}` },
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Share className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2">
        <div className="flex space-x-2">
          {shareOptions.map((option) => (
            <TooltipProvider key={option.name}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {option.url ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:scale-110"
                      onClick={() => handleShare(option.name, option.url!)}
                    >
                      <option.icon className="h-5 w-5" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" onClick={option.action} className="rounded-full">
                      <option.icon className="h-5 w-5" />
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{option.name === "Copy" && isCopied ? "Copied!" : option.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
