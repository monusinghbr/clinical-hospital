"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Hospital } from "lucide-react";

import { primaryNavigation, systemNavigation } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/hooks/use-permissions";
import { useLayoutStore } from "@/store/layout-store";

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useLayoutStore((state) => state.sidebarCollapsed);
  const setCollapsed = useLayoutStore((state) => state.setSidebarCollapsed);
  const { can } = usePermissions();

  const renderItem = (item: (typeof primaryNavigation)[number]) => {
    if (item.permission && !can(item.permission)) {
      return null;
    }

    const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

    return (
      <Tooltip key={item.href}>
        <TooltipTrigger asChild>
          <Link
            href={item.href}
            className={cn(
              "flex h-9 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground",
              active && "bg-primary/10 text-primary",
              collapsed && "justify-center",
            )}
          >
            <item.icon className="size-4 shrink-0" />
            {!collapsed ? <span className="truncate">{item.title}</span> : null}
            {!collapsed && item.badge ? <Badge className="ml-auto" variant="success">{item.badge}</Badge> : null}
          </Link>
        </TooltipTrigger>
        {collapsed ? <TooltipContent side="right">{item.title}</TooltipContent> : null}
      </Tooltip>
    );
  };

  return (
    <aside className={cn("hidden border-r border-border bg-sidebar transition-[width] duration-200 lg:flex lg:flex-col", collapsed ? "w-16" : "w-64")}>
      <div className="flex h-14 items-center gap-2 border-b border-border px-3">
        <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Hospital className="size-4" />
        </div>
        {!collapsed ? (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">Clinical Care</div>
            <div className="truncate text-[11px] text-muted-foreground">HMS operations</div>
          </div>
        ) : null}
      </div>
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-1">{primaryNavigation.map(renderItem)}</nav>
        <Separator className="my-3" />
        <nav className="space-y-1">{systemNavigation.map(renderItem)}</nav>
      </ScrollArea>
      <div className="border-t border-border p-2">
        <Button variant="ghost" size={collapsed ? "icon" : "default"} className="w-full justify-start" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
          {!collapsed ? "Collapse" : null}
        </Button>
      </div>
    </aside>
  );
}
