"use client";

import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { primaryNavigation, systemNavigation } from "@/config/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLayoutStore } from "@/store/layout-store";
import { usePermissions } from "@/hooks/use-permissions";

export function CommandPalette() {
  const router = useRouter();
  const open = useLayoutStore((state) => state.commandOpen);
  const setOpen = useLayoutStore((state) => state.setCommandOpen);
  const { can } = usePermissions();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, setOpen]);

  const items = [...primaryNavigation, ...systemNavigation].filter((item) => !item.permission || can(item.permission));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-muted-foreground">
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 size-4 text-muted-foreground" />
            <Command.Input className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Search patient, order, ward, workflow..." />
          </div>
          <Command.List className="max-h-96 overflow-y-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">No workflow found.</Command.Empty>
            <Command.Group heading="Navigation">
              {items.map((item) => (
                <Command.Item
                  key={item.href}
                  value={item.title}
                  onSelect={() => {
                    router.push(item.href);
                    setOpen(false);
                  }}
                  className="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm data-[selected=true]:bg-accent"
                >
                  <item.icon className="size-4 text-muted-foreground" />
                  {item.title}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export function CommandButton() {
  const setOpen = useLayoutStore((state) => state.setCommandOpen);

  return (
    <Button variant="outline" className="h-9 w-[min(320px,42vw)] justify-start gap-2 text-muted-foreground" onClick={() => setOpen(true)}>
      <Search />
      <span className="hidden sm:inline">Search workflows</span>
      <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline">Ctrl K</kbd>
    </Button>
  );
}
