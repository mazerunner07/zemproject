'use client';
import React from "react";
import Link from "next/link";
import {
  Bell,
  Cable,
  CircleUser,
  Combine,
  DollarSign,
  Gem,
  LayoutGrid,
  Mail,
  Menu,
  User2,
  Users,
  Handshake,
  HomeIcon,
  Lock,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Session } from "next-auth";
import { ModeToggle } from "../mode-toggle";
import { AvatarMenuButton } from "./AvatarMenuButton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import Logo from "../global/Logo";

export default function Navbar({ session, userLogo }: { session: Session, userLogo?: string }) {
  const sidebarLinks = [
    {
      title: "Dashboard",
      links: [
        {
          title: "Overview",
          href: "/dashboard",
          icon: HomeIcon,
        },
      ]
    },
    {
      title: "Client & Projects",
      links: [
        {
          title: "Clients",
          href: "/dashboard/clients",
          icon: Users,
        },
        {
          title: "Projects",
          href: "/dashboard/projects",
          icon: LayoutGrid,
        },
        {
          title: "Guest Projects",
          href: "/dashboard/guest-projects",
          icon: Combine,
        },
      ]
    },
    {
      title: "Finance",
      links: [
        {
          title: "Payments",
          href: "/dashboard/payments",
          icon: Handshake,
        },
      ],
    },
    {
      title: "Team",
      links: [
        {
          title: "Members",
          href: "/dashboard/members",
          icon: User2,
        },
      ],
    },
    {
      title: "Communication",
      links: [
        {
          title: "Emails",
          href: "/dashboard/emails",
          icon: User2,
        },
        {
          title: "Subscribers",
          href: "/dashboard/subscribers",
          icon: Mail,
        },
      ],
    },
    {
      title: "Portfolio",
      links: [
        {
          title: "Generate Portfolio",
          href: "/dashboard/portfolio",
          icon: User2,
        },
      ],
    },
    {
      title: "Brand",
      links: [
        {
          title: "Settings",
          href: "/dashboard/brand-setting",
          icon: User2,
        },
        {
          title: "File Manager",
          href: "/dashboard/file-manager",
          icon: Lock,
        },
      ],
    },
    {
      title: "Setting",
      links: [
        {
          title: "Change Password",
          href: "/dashboard/change-password",
          icon: User2,
        },
      ],
    },
  ];

  const pathname = usePathname();

  return (
    <header className="flex dark:bg-[#0F172A] h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <Logo />
          </div>
          
          <nav className="grid gap-2 text-sm font-medium">
            {sidebarLinks.map((section, i) => (
              <div key={i} className="mb-4">
                <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{section.title}</h3>
                {section.links.map((item, j) => {
                  const Icon = item.icon;
                  const isActive = item.href === pathname;
                  return (
                    <Link
                      key={j}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        isActive && "bg-muted text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="mt-auto">
            <Card>
              <Button size="sm" className="w-full">
                Logout
              </Button>
            </Card>
          </div>
        </SheetContent>
      </Sheet>

      {/* Rest of the Navbar remains the same */}
      <div className="w-full  flex-1">
        <form>
          <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search"
                          className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        />
          </div>
        </form>
      </div>

      <ModeToggle />
      <AvatarMenuButton session={session} />
    </header>
  );
}