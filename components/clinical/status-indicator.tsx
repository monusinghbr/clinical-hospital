import { cn } from "@/lib/utils";

type StatusTone = "online" | "idle" | "warning" | "critical" | "muted";

const toneClasses: Record<StatusTone, string> = {
  online: "bg-emerald-500 shadow-emerald-500/30",
  idle: "bg-sky-500 shadow-sky-500/30",
  warning: "bg-amber-500 shadow-amber-500/30",
  critical: "bg-red-500 shadow-red-500/30",
  muted: "bg-muted-foreground",
};

export function StatusIndicator({ label, tone = "online", pulse = false }: { label: string; tone?: StatusTone; pulse?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn("size-2 rounded-full shadow-[0_0_0_4px]", toneClasses[tone], pulse && "animate-pulse")} />
      {label}
    </span>
  );
}
