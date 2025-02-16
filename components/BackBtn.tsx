'use client'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'


export default function BackBtn({title = "Back"}:{title?: string}) {
    const router = useRouter()
  return (
    
      <Button
      
            onClick={() => router.back()}
            variant="outline"
            size="sm"
            className="bg-white/50 backdrop-blur-sm
             dark:bg-black dark:border-black dark:text-white dark:hover:bg-white dark:hover:text-black"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            {title}
          </Button>
    
  )
}
