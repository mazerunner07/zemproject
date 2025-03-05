import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ourFileRouter } from "./api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
const inter = Rethink_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Zem Project",
  description: "Advance Project Management System",
};
import { Analytics } from "@vercel/analytics/next";
import dynamic from "next/dynamic";
import { PHProvider } from "@/components/posthog-provider";
import { Suspense } from "react";
import SimpleFallback from "@/components/SimpleFallback";

const PostHogPageView = dynamic(() => import("@/components/PostHogPageView"));
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Suspense fallback={<SimpleFallback />}>
          <PHProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />

            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Providers>
                <Toaster position="top-center" reverseOrder={false} />
                <PostHogPageView />
                {children}
                <Analytics />
              </Providers>
            </ThemeProvider>
          </PHProvider>
        </Suspense>
      </body>
    </html>
  );
}
