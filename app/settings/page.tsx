import { Activity, Database, MonitorCog, RadioTower, ShieldCheck } from "lucide-react";

import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { StatusIndicator } from "@/components/clinical/status-indicator";
import { clinicalEnvironment } from "@/config/clinical";
import { featureRegistry } from "@/config/features";

export default function SettingsPage() {
  return (
    <div className="mx-auto grid w-full max-w-[1500px] gap-4 p-4 xl:grid-cols-[1fr_360px]">
      <section className="rounded-md border border-border bg-panel p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold uppercase text-muted-foreground">Simulator settings</div>
            <h1 className="mt-1 text-xl font-semibold">Clinical workstation configuration</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Frontend-first controls for the enterprise clinical UI simulator. These settings describe local UI state, seeded datasets, and fake realtime layers.
            </p>
          </div>
          <ClinicalBadge label="Frontend simulator" severity="success" />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: MonitorCog, label: "Workspace", value: clinicalEnvironment.workspaceName },
            { icon: RadioTower, label: "Realtime", value: "Fake pulse active" },
            { icon: Database, label: "Data source", value: "Seeded JSON" },
            { icon: ShieldCheck, label: "Access", value: "Local demo session" },
          ].map((item) => (
            <div key={item.label} className="rounded border border-border bg-background p-3">
              <item.icon className="size-4 text-primary" />
              <div className="mt-3 text-[10px] font-semibold uppercase text-muted-foreground">{item.label}</div>
              <div className="mt-1 text-sm font-semibold">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <aside className="rounded-md border border-border bg-panel p-4">
        <div className="mb-3 flex items-center gap-2">
          <Activity className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Feature flags</h2>
        </div>
        <div className="grid gap-2">
          {Object.values(featureRegistry).map((feature) => (
            <div key={feature.key} className="rounded border border-border bg-background p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{feature.label}</span>
                <StatusIndicator label={feature.enabled ? "Enabled" : "Off"} tone={feature.enabled ? "online" : "muted"} />
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
