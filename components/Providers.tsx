"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>
      <Toaster/>
    {children}</SessionProvider>;
}
