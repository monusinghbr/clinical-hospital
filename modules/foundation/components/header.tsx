"use client";

import type { Session } from "next-auth";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommandButton } from "@/modules/foundation/components/command-palette";
import { NotificationCenter } from "@/modules/foundation/components/notification-center";
import { OperationalStatusBar } from "@/modules/foundation/components/operational-status-bar";
import { ThemeToggle } from "@/modules/foundation/components/theme-toggle";
import { UserMenu } from "@/modules/foundation/components/user-menu";

export function Header({ session }: { session: Session | null }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-3 backdrop-blur">
      <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
        <Menu />
      </Button>
      <div className="min-w-0 flex-1">
        <CommandButton />
      </div>
      <OperationalStatusBar />
      <div className="flex items-center gap-1">
        <NotificationCenter />
        <ThemeToggle />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <UserMenu session={session} />
      </div>
    </header>
  );
}
