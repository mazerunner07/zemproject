"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  // Essential UI Icons
  Check,
  X,
  Plus,
  Minus,
  Search,
  Settings,
  Menu,
  MoreVertical,
  MoreHorizontal,
  
  // Navigation & Direction
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  
  // Common Actions
  Edit,
  Trash,
  Copy,
  Save,
  Download,
  Upload,
  Share,
  Send,
  
  // Communication
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Video,
  
  // User Interface
  Home,
  User,
  Users,
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Bell,
  
  // Files & Data
  File,
  FileText,
  Folder,
  Image,
  Camera,
  Video as VideoIcon,
  
  // Status & Notifications
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  
  // Media Controls
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  
  // Common Features
  Heart,
  Star,
  Bookmark,
  Tag,
  Link,
  ExternalLink,
  
  // Device & Tech
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Wifi,
  Battery,
  
  // Social
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Linkedin,
  
  // Weather & Nature
  Sun,
  Moon,
  Cloud,
  CloudRain,
  
  // Business & Commerce
  CreditCard,
  DollarSign,
  ShoppingCart,
  ShoppingBag,
  
  // Misc Useful
  Filter,
  RotateCcw,
  Layers,
  List,
  Grid,
  Map,
  Flag
} from "lucide-react"

const iconMap = {
  Check,
  X,
  Plus,
  Minus,
  Search,
  Settings,
  Menu,
  MoreVertical,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Edit,
  Trash,
  Copy,
  Save,
  Download,
  Upload,
  Share,
  Send,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Video,
  Home,
  User,
  Users,
  UserPlus,
  UserMinus,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Bell,
  File,
  FileText,
  Folder,
  Image,
  Camera,
  VideoIcon,
  Info,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Heart,
  Star,
  Bookmark,
  Tag,
  Link,
  ExternalLink,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Wifi,
  Battery,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Github,
  Linkedin,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CreditCard,
  DollarSign,
  ShoppingCart,
  ShoppingBag,
  Filter,
  RotateCcw,
  Layers,
  List,
  Grid,
  Map,
  Flag
}

interface IconInputProps {
  onIconSelect: (iconName: string) => void
  selectedIcon?: string
}

function IconGallery({ onSelect }: { onSelect: (iconName: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredIcons = Object.keys(iconMap).filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search icons..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-6 gap-4 max-h-[300px] overflow-y-auto">
        {filteredIcons.map((iconName) => {
          const IconComponent = iconMap[iconName as keyof typeof iconMap]
          return (
            <button
              key={iconName}
              onClick={() => onSelect(iconName)}
              className="p-2 hover:bg-gray-100 rounded-md flex items-center justify-center"
              title={iconName}
            >
              <IconComponent size={24} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function IconInput({ onIconSelect, selectedIcon }: IconInputProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleIconSelect = (iconName: string) => {
    onIconSelect(iconName)
    setIsOpen(false)
  }

  const SelectedIconComponent = selectedIcon ? iconMap[selectedIcon as keyof typeof iconMap] : null

  return (
    <div className="flex items-center space-x-2">
      <div className="relative w-full">
        <Input 
          type="text" 
          placeholder="Selected Icon" 
          value={selectedIcon || ""} 
          readOnly 
          className="w-full pl-10" 
        />
        {SelectedIconComponent && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <SelectedIconComponent size={24} />
          </div>
        )}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Icon</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select an Icon</DialogTitle>
          </DialogHeader>
          <IconGallery onSelect={handleIconSelect} />
        </DialogContent>
      </Dialog>
    </div>
  )
}