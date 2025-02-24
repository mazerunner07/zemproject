"use client";
import React from "react";
import Link from "next/link";
import {
  Bell,
  Cable,
  CircleUser,
  Combine,
  Component,
  DollarSign,
  ExternalLink,
  Gem,
  Grid,
  Handshake,
  Home,
  HomeIcon,
  KeySquare,
  LayoutGrid,
  LineChart,
  Lock,
  Mail,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Star,
  User2,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area"
export default function Sidebar() {
  const sidebarLinks = [
    {
    title: "Dashboard",
    links:[
    {
      title: "Overview",
      href: "/dashboard",
      icon: HomeIcon,
    },
  ]
  },
    {
    title: "Client & Projects",
    links:[
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
    title: "Finance" ,
    links:[
      {
        title: "Payments",
        href: "/dashboard/payments",
        icon: Handshake,
      },
    ],
  },
  {
    title: "Team" ,
      links:[
        {
            title: "Members",
            href: "/dashboard/members",
            icon: User2,
        },
        
      ],
    },
  {
    title: "Communication" ,
      links:[
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
        {
            title: "Bulk Emails",
            href: "/dashboard/bulk-emails",
            icon: Lock,
        },
      ],
    },
    {
      title: "Portfolio" ,
          links:[
            {
              title: "Generate Portfolio",
              href: "/dashboard/portfolio",
              icon: User2,
            },
        ],
    },
    {
      title: "Brand" ,
        links:[
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
        title: "Reports" ,
          links:[
            {
                title: "Project Progress",
                href: "/dashboard/project-progress",
                icon: User2,
            },
            {
                title: "Financial Summary",
                href: "/dashboard/financial-summary",
                icon: Lock,
            },
            {
                title: "Time Tracking",
                href: "/dashboard/time-tracking",
                icon: Lock,
            },
          ],
        },
        {
          title: "Setting" ,
            links:[
              {
                  title: "Change Password",
                  href: "/dashboard/change-password",
                  icon: User2,
              },
              {
                  title: "Notifications",
                  href: "/dashboard/notifications",
                  icon: Lock,
              },
              {
                  title: "Integrations",
                  href: "/dashboard/integrations",
                  icon: Lock,
              },
            ],
          },
  ];
  
  const pathname = usePathname();
  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2 mt-4">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Gem className="h-6 w-6" />
            <span className="">Zem Project</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div className="flex-1">
          <ScrollArea className="h-[448px] w-full rounded-md p-4">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {sidebarLinks.map((section, i) => (
              <div key={i}>
                <h3 className="mb-2 px-4 text-sm font-semibold">{section.title}</h3>
                {section.links.map((item, j) => {
                  const Icon = item.icon;
                  const isActive = item.href === pathname;
                  return (
                    <Link
                      key={j}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                        isActive && " bg-muted  text-primary"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                      {/* {item.count && (
                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                          {item.count}
                        </Badge>
                      )} */}
                    </Link>
                  );
                })}
              </div>
              
            ))}
            </nav>
            </ScrollArea>
            
        </div>
        <div className="mt-auto p-4">
          <Card x-chunk="dashboard-02-chunk-0">
              <Button size="sm" className="w-full">
                Logout
              </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
