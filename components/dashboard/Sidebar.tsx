"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Combine,
  Handshake,
  HomeIcon,
  LayoutGrid,
  Lock,
  LogOut,
  MailsIcon,
  Menu,
  Search,
  Settings,
  Settings2Icon,
  UserCircle,
  UserPlus2,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Logo from "../global/Logo";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const sidebarLinks = [
    { title: "Dashboard", links: [{ title: "Overview", href: "/dashboard", icon: HomeIcon }] },
    { title: "Client & Projects", links: [
      { title: "Clients", href: "/dashboard/clients", icon: Users },
      { title: "Projects", href: "/dashboard/projects", icon: LayoutGrid },
      { title: "Guest Projects", href: "/dashboard/guest-projects", icon: Combine }
    ] },
    { title: "Finance", links: [{ title: "Payments", href: "/dashboard/payments", icon: Handshake }] },
    { title: "Team", links: [{ title: "Members", href: "/dashboard/members", icon: UserPlus2 }] },
    { title: "Communication", links: [
      { title: "Emails", href: "/dashboard/emails", icon: MailsIcon },
      { title: "Subscribers", href: "/dashboard/subscribers", icon: Bell }
    ] },
    { title: "Portfolio", links: [{ title: "Generate Portfolio", href: "/dashboard/portfolio", icon: UserCircle }] },
    { title: "Brand", links: [
      { title: "Settings", href: "/dashboard/brand-setting", icon: Settings2Icon },
      { title: "File Manager", href: "/dashboard/file-manager", icon: Lock }
    ] },
    { title: "Settings", links: [{ title: "Change Password", href: "/dashboard/change-password", icon: Settings }] }
  ];

  const filteredLinks = sidebarLinks.map(section => ({
    ...section,
    links: section.links.filter(link => link.title.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(section => section.links.length > 0);

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button onClick={() => setIsOpen(!isOpen)} className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md">
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <Logo />
          <Button onClick={() => setIsOpen(false)} className="md:hidden">✕</Button>
        </div>

        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4">
          {filteredLinks.map((section, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase px-3 mb-2">{section.title}</h3>
              {section.links.map((item, j) => {
                const Icon = item.icon;
                const isActive = item.href === pathname;
                return (
                  <Link
                    key={j}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-700",
                      isActive ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white" : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          ))}
        </ScrollArea>

        {/* Logout Section */}
        <div className="p-4 border-t dark:border-gray-700">
          <Button size="sm" className="w-full bg-[#00B1F3] hover:bg-red-300 text-white">
          <LogOut className="" />
            Logout</Button>
        </div>
      </div>
    </>
  );
}