"use client";

import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "./query-provider";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
        <Toaster />
      </QueryProvider>
    </SessionProvider>
  );
}
