"use client";

import { Drawer } from "vaul";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

type DrawerPanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function DrawerPanel({ open, onOpenChange, title, description, children }: DrawerPanelProps) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 right-0 top-0 z-50 flex w-[min(520px,100vw)] flex-col border-l border-border bg-background shadow-2xl">
          <div className="flex items-start justify-between border-b border-border px-4 py-3">
            <div>
              <Drawer.Title className="text-sm font-semibold">{title}</Drawer.Title>
              {description ? <Drawer.Description className="text-xs text-muted-foreground">{description}</Drawer.Description> : null}
            </div>
            <Drawer.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close drawer">
                <X />
              </Button>
            </Drawer.Close>
          </div>
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
