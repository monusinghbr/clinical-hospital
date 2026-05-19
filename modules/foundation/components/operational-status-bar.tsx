"use client";

import { Activity, AlertTriangle, Building2, Clock3, RadioTower, ShieldCheck } from "lucide-react";

import { clinicalEnvironment } from "@/config/clinical";
import { StatusIndicator } from "@/components/clinical/status-indicator";

const shiftName = "Day shift";
const activeWardContext = "General Ward A";

export function OperationalStatusBar() {
  return (
    <div className="hidden min-w-0 items-center gap-2 xl:flex">
      <div className="flex items-center gap-1.5 rounded border border-border bg-panel px-2 py-1 text-[11px] text-muted-foreground">
        <Building2 className="size-3.5 text-primary" />
        <span className="max-w-40 truncate">{clinicalEnvironment.workspaceName}</span>
      </div>
      <div className="flex items-center gap-1.5 rounded border border-border bg-panel px-2 py-1 text-[11px] text-muted-foreground">
        <Clock3 className="size-3.5 text-primary" />
        {shiftName}
      </div>
      <div className="flex items-center gap-1.5 rounded border border-border bg-panel px-2 py-1 text-[11px] text-muted-foreground">
        <Activity className="size-3.5 text-primary" />
        {activeWardContext}
      </div>
      <div className="flex items-center gap-1.5 rounded border border-emerald-500/25 bg-emerald-500/10 px-2 py-1">
        <RadioTower className="size-3.5 text-emerald-500" />
        <StatusIndicator label="Sync live" tone="online" pulse />
      </div>
      <div className="flex items-center gap-1.5 rounded border border-amber-500/25 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-700 dark:text-amber-300">
        <AlertTriangle className="size-3.5" />
        3 active alerts
      </div>
      <div className="flex items-center gap-1.5 rounded border border-border bg-panel px-2 py-1 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-3.5 text-primary" />
        {clinicalEnvironment.securityZone}
      </div>
    </div>
  );
}
