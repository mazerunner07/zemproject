import Link from "next/link"
import { Search, Home, FileText, Phone, ArrowLeft, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BackBtn from "@/components/BackBtn"
import { getAuthUser } from "@/config/useAuth"
// import { useRouter } from "next/navigation"

export default async function NotFound() {
  const user = await getAuthUser()
  const role = user?.role
  // const router = useRouter()
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 text-center">
        <div className="animate-bounce">
          <svg
            className="mx-auto h-24 w-24 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="mt-2 text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-2 text-lg text-gray-500">
          Oops! The page you are looking for doesn't exist or has been moved.
        </p>
          <BackBtn title="Go Back" /> 
        {role === "USER" && <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Home className="mr-2 h-4 w-4" /> Go to Dashboard
          </Link>
          <Link
            href="/dashboard/projects"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Briefcase className="mr-2 h-4 w-4" /> View Projects
          </Link>
          <Link
            href="/dashboard/clients"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <Briefcase className="mr-2 h-4 w-4" /> View Clients
          </Link>
          
          
        </div>}
      </div>
    </div>
  )
}

