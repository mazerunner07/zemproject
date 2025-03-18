"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getInitials } from "@/lib/generateInitials";
import {
  Headset,
  LogOut,
  Mail,
  MessageSquareMore,
  PhoneCall,
  Presentation,
  Settings,
  UserRound,
} from "lucide-react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AvatarMenuButton({ session,userLogo }: { session: Session | null,userLogo?:string }) {
  const router = useRouter();
  // Handle case when session is null
  if (!session) return null;

  const user = session.user;
  const initials = getInitials(user.name ?? "");
  
  const role = user.role; // Make sure user has a role

  async function handleLogout() {
    await signOut();
    router.push("/");
  }

  const menuLinks = [
    { name: "Settings", icon: Settings, href: "/dashboard/brand-setting" },
    { name: "Client", icon: UserRound, href: "/dashboard/clients" },
    { name: "Project", icon: Presentation, href: "/dashboard/projects" },
  ];

  const assistanceLinks = [
    { name: "Free 2-hour set-up assistance", icon: Headset, href: "tel:9228891006" },
    { name: "Chat with Us on WhatsApp", icon: MessageSquareMore, href: "https://wa.me/9228891006" },
    { name: "Send an Email", icon: Mail, href: "mailto:projectmin95@gmail.com" },
    { name: "Talk to Us - 9228891006", icon: PhoneCall, href: "tel:9228891006" },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={userLogo ?? ""} alt={user.name ?? "User"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </SheetTrigger>

      <SheetContent className="dark:bg-[#0F172A]">
        {/* User Info */}
        <SheetHeader>
          <div className="flex items-center space-x-3 pb-3 border-b">
            <Avatar>
              <AvatarImage src={userLogo ?? ""} alt={user.name ?? "User"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </SheetHeader>

        {/* Account Management */}
        {role === "USER" && (
          <div>
            {/* Navigation Links */}
            <div className="grid grid-cols-3 gap-4 py-6 border-b">
              {menuLinks.map(({ name, icon: Icon, href }, i) => (
                <Link key={i} href={href} className="flex flex-col items-center text-sm hover:text-primary">
                  <Icon className="w-6 h-6" />
                  {name}
                </Link>
              ))}
            </div>

            {/* Assistance Section */}
            <div className="py-6">
              <h2 className="text-lg font-semibold">Need Assistance?</h2>
              <div className="flex flex-col space-y-2 mt-3">
                {assistanceLinks.map(({ name, icon: Icon, href }, i) => (
                  <Button key={i} size="sm" asChild variant="ghost" className="justify-start">
                    <Link href={href}>
                      <Icon className="h-4 w-4 mr-2" />
                      {name}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4 justify-center items-center py-6 border-b">
          <Button onClick={handleLogout} variant="destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
