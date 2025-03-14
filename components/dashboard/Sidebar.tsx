"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Logo from "../global/Logo";
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

interface AnimatedItemProps {
  children: React.ReactNode;
  delay?: number;
  index?: number;
  onMouseEnter?: () => void;
  onClick?: () => void;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: false });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();

  const sidebarLinks = [
    {
      title: "Dashboard",
      links: [{ title: "Overview", href: "/dashboard", icon: HomeIcon }],
    },
    {
      title: "Client & Projects",
      links: [
        { title: "Clients", href: "/dashboard/clients", icon: Users },
        { title: "Projects", href: "/dashboard/projects", icon: LayoutGrid },
        {
          title: "Guest Projects",
          href: "/dashboard/guest-projects",
          icon: Combine,
        },
      ],
    },
    {
      title: "Finance",
      links: [
        { title: "Payments", href: "/dashboard/payments", icon: Handshake },
      ],
    },
    {
      title: "Team",
      links: [
        { title: "Members", href: "/dashboard/members", icon: UserPlus2 },
      ],
    },
    {
      title: "Communication",
      links: [
        { title: "Emails", href: "/dashboard/emails", icon: MailsIcon },
        { title: "Subscribers", href: "/dashboard/subscribers", icon: Bell },
      ],
    },
    {
      title: "Portfolio",
      links: [
        {
          title: "Generate Portfolio",
          href: "/dashboard/portfolio",
          icon: UserCircle,
        },
      ],
    },
    {
      title: "Brand",
      links: [
        {
          title: "Settings",
          href: "/dashboard/brand-setting",
          icon: Settings2Icon,
        },
        {
          title: "File Manager",
          href: "/dashboard/file-manager",
          icon: Lock,
        },
      ],
    },
    {
      title: "Settings",
      links: [
        {
          title: "Change Password",
          href: "/dashboard/change-password",
          icon: Settings,
        },
      ],
    },
  ];

  const filteredLinks = sidebarLinks
    .map((section) => ({
      ...section,
      links: section.links.filter((link) =>
        link.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((section) => section.links.length > 0);

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-2 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
      >
        <Menu className="h-6 w-6" />
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <Logo />
          <Button onClick={() => setIsOpen(false)} className="md:hidden">
            ✕
          </Button>
        </div>

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

        <ScrollArea className="flex-1 px-4">
          {filteredLinks.map((section, i) => (
            <div key={i} className="mb-4">
              <h3 className="text-xs text-gray-500 dark:text-gray-400 uppercase px-3 mb-2">
                {section.title}
              </h3>
              {section.links.map((item, j) => {
                const Icon = item.icon;
                const isActive = item.href === pathname;
                return (
                  <AnimatedItem key={j} delay={0.1 * j}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 mb-1 rounded-lg px-3 py-2 transition-all",
                        isActive
                          ? "bg-[#01B1F3] dark:bg-gray-700 text-white"
                          : "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.title}
                    </Link>
                  </AnimatedItem>
                );
              })}
            </div>
          ))}
        </ScrollArea>
        {/* Logout Section */}
        <div className="p-4 border-t dark:border-gray-700">
          <Button
            size="sm"
            className="w-full bg-[#FADBD8] hover:bg-[#e74c3c] hover:text-white text-[#e74c3c] dark:text-[#e74c3c]"
          >
            <LogOut className="mr-2" /> Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
