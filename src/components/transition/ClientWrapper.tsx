"use client";

import { useRouter } from "next/navigation";
import { TransitionProvider } from "@/lib/TransitionProvider";
import { ReactNode } from "react";

export function ClientWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <TransitionProvider router={(path) => router.push(path)}>
      {children}
    </TransitionProvider>
  );
}
