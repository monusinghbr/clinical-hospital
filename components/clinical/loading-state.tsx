import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading clinical workspace", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("space-y-3 p-4", className)}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span className="size-2 animate-pulse rounded-full bg-primary" />
        {label}
      </div>
      <div className="grid gap-2">
        <div className="h-8 animate-pulse rounded bg-muted" />
        <div className="h-20 animate-pulse rounded bg-muted" />
        <div className="h-20 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
