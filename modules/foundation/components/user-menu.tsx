"use client";

import { LogOut, ShieldCheck, UserRound } from "lucide-react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { initials } from "@/lib/utils";

export function UserMenu({ session }: { session: Session | null }) {
  const userName = session?.user.name ?? "Dr. Meera Iyer";
  const role = session?.user.role?.replaceAll("_", " ") ?? "ICU CONSULTANT";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-1.5 py-1 outline-none hover:bg-accent">
        <Avatar>
          {session?.user.image ? <AvatarImage src={session.user.image} alt={userName} /> : null}
          <AvatarFallback>{initials(userName)}</AvatarFallback>
        </Avatar>
        <div className="hidden min-w-0 text-left lg:block">
          <div className="truncate text-xs font-semibold">{userName}</div>
          <div className="truncate text-[11px] text-muted-foreground">{role}</div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserRound />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ShieldCheck />
          Access policy
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut({ callbackUrl: "/login" })}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
