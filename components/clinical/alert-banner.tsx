import { AlertTriangle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

type AlertBannerProps = {
  title: string;
  detail?: string;
  severity?: "info" | "warning" | "critical";
};

export function AlertBanner({ title, detail, severity = "info" }: AlertBannerProps) {
  const Icon = severity === "info" ? Info : AlertTriangle;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border px-3 py-2 text-sm",
        severity === "info" && "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-400/20 dark:bg-sky-400/10 dark:text-sky-200",
        severity === "warning" &&
          "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
        severity === "critical" &&
          "border-red-200 bg-red-50 text-red-950 dark:border-red-400/20 dark:bg-red-400/10 dark:text-red-200",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div>
        <div className="font-semibold">{title}</div>
        {detail ? <div className="mt-0.5 text-xs opacity-80">{detail}</div> : null}
      </div>
    </div>
  );
}
