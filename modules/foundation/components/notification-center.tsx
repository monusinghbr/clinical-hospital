"use client";

import { Bell, CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusIndicator } from "@/components/clinical/status-indicator";

const channels = [
  { title: "Emergency alerts", detail: "Realtime channel ready", severity: "STAT" },
  { title: "Ward updates", detail: "Supabase/Pusher abstraction available", severity: "NORMAL" },
  { title: "Consultation sync", detail: "Collaboration events routed by hospital", severity: "NORMAL" },
];

export function NotificationCenter() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open notifications">
          <Bell />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80">
        <div className="px-2 py-2">
          <div className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Clinical notifications</div>
          <div className="mt-2">
            <StatusIndicator label="Realtime transport configured" tone="online" pulse />
          </div>
        </div>
        {channels.map((channel) => (
          <DropdownMenuItem key={channel.title} className="items-start">
            <CircleAlert className="mt-0.5" />
            <div>
              <div className="text-sm font-medium">{channel.title}</div>
              <div className="text-xs text-muted-foreground">{channel.detail}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
