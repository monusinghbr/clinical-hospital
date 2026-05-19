"use client";

import type { Session } from "next-auth";

import { Header } from "@/modules/foundation/components/header";
import { Sidebar } from "@/modules/foundation/components/sidebar";
import { CommandPalette } from "@/modules/foundation/components/command-palette";

export function AppShell({ children, session }: { children: React.ReactNode; session: Session | null }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header session={session} />
        <main className="flex-1">{children}</main>
      </div>
      <CommandPalette />
    </div>
  );
}
