import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ourFileRouter } from "./api/uploadthing/core";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import { Analytics } from "@vercel/analytics/next";
import dynamic from "next/dynamic";
import { PHProvider } from "@/components/posthog-provider";

const inter = Rethink_Sans({ subsets: ["latin"], display: "swap" });
const PostHogPageView = dynamic(() => import("@/components/PostHogPageView"));

export const metadata: Metadata = {
  title: "Zem Project",
  description: "Advance Project Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
