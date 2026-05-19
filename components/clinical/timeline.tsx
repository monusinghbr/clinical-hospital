import { cn } from "@/lib/utils";

export type TimelineItem = {
  id: string;
  time: string;
  title: string;
  description?: string;
  tone?: "neutral" | "success" | "warning" | "critical";
};

const toneClasses = {
  neutral: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
};

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn("space-y-1", className)}>
      {items.map((item) => (
        <li key={item.id} className="grid grid-cols-[76px_1fr] gap-3">
          <time className="pt-1 text-[11px] text-muted-foreground">{item.time}</time>
          <div className="relative border-l border-border pb-4 pl-4">
            <span className={cn("absolute -left-1 top-1 size-2 rounded-full", toneClasses[item.tone ?? "neutral"])} />
            <div className="text-sm font-medium">{item.title}</div>
            {item.description ? <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{item.description}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
