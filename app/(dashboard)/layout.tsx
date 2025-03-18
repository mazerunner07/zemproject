"use client";

import Navbar from "@/components/dashboard/Navbar";
import Sidebar from "@/components/dashboard/Sidebar";
import React, { ReactNode, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// Top Loader Component
const TopLoader = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const handleRouteChangeStart = () => {
      setLoading(true);
      setProgress(0);

      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          const increment = prevProgress < 30 ? 5 : prevProgress < 70 ? 3 : 1;
          return Math.min(prevProgress + increment, 95);
        });
      }, 100);
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchorElement = target.closest("a");

      if (
        anchorElement &&
        anchorElement.href &&
        anchorElement.href.includes(window.location.origin) &&
        !anchorElement.target &&
        !anchorElement.hasAttribute("download")
      ) {
        const targetPath = anchorElement.href.replace(window.location.origin, "");
        if (targetPath !== pathname) {
          handleRouteChangeStart();
        }
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      clearInterval(progressInterval);
    };
  }, [pathname]);

  useEffect(() => {
    setProgress(100);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading && progress !== 100) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      <div
        className="h-full bg-[#01B1F3] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: loading || progress < 100 ? 1 : 0,
        }}
      />
    </div>
  );
};

// Client dashboard layout component
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle redirects with useEffect (moved outside conditions)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (
      session?.user?.role !== "USER" &&
      session?.user?.role !== "MEMBER"
    ) {
      router.replace("/404");
    }
  }, [status, session?.user?.role, router]);

  // Show loading spinner while session is loading
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#01B1F3] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <TopLoader />
      <div className="flex dark:bg-[#0F172A] min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area with left padding to account for sidebar */}
        <main className="flex-1 md:pl-64 overflow-x-hidden">
          {/* Navbar */}
          <Navbar session={session} />

          {/* Page content */}
          <div className="p-4">{children}</div>
        </main>
      </div>
    </>
  );
}
