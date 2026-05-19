import {
  Activity,
  Building2,
  CheckCircle2,
  Database,
  FileClock,
  LockKeyhole,
  RadioTower,
  ServerCog,
  ShieldCheck,
  Siren,
} from "lucide-react";
import { Suspense } from "react";

import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { StatusIndicator } from "@/components/clinical/status-indicator";
import { clinicalEnvironment, clinicalModules } from "@/config/clinical";
import { featureRegistry } from "@/config/features";
import { LoginForm } from "@/modules/foundation/components/login-form";

const workspaceRows = [
  { label: "Workspace", value: clinicalEnvironment.workspaceName },
  { label: "Environment", value: clinicalEnvironment.environment },
  { label: "Region", value: clinicalEnvironment.region },
  { label: "Security", value: clinicalEnvironment.securityZone },
  { label: "Uptime", value: clinicalEnvironment.uptime },
];

const operationalSignals = [
  { label: "ICU Monitoring", value: "Enabled", icon: Activity, tone: "success" as const },
  { label: "Active Modules", value: `${clinicalModules.length} connected`, icon: ServerCog, tone: "success" as const },
  { label: "Audit Logging", value: "Active", icon: FileClock, tone: "success" as const },
  { label: "HL7/FHIR Layer", value: "Prepared", icon: Database, tone: "info" as const },
  { label: "Ward Sync", value: "Realtime", icon: RadioTower, tone: "success" as const },
  { label: "Escalation", value: "Routing ready", icon: Siren, tone: "warning" as const },
];

export default function LoginPage() {
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[420px_1fr]">
      <section className="flex items-start justify-center border-r border-border bg-panel px-5 py-5 lg:items-center">
        <div className="w-full max-w-[360px]">
          <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Activity className="size-4" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold">Clinical Care HMS</h1>
              <p className="text-[11px] uppercase tracking-normal text-muted-foreground">Protected workstation access</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2">
            <div className="rounded border border-border bg-background px-3 py-2">
              <div className="text-[10px] uppercase text-muted-foreground">Session</div>
              <StatusIndicator label="Secure" tone="online" />
            </div>
            <div className="rounded border border-border bg-background px-3 py-2">
              <div className="text-[10px] uppercase text-muted-foreground">Realtime</div>
              <StatusIndicator label="Operational" tone="idle" pulse />
            </div>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <div className="mt-4 rounded border border-border bg-background p-3 text-xs text-muted-foreground">
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              <LockKeyhole className="size-3.5 text-primary" />
              Access notice
            </div>
            Hospital users are authorized by role, hospital membership, feature grants, and audited clinical actions.
          </div>

          <div className="mt-3 grid gap-2 lg:hidden">
            <div className="rounded border border-border bg-background p-3">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground">Workspace</div>
              <div className="mt-1 text-xs font-medium">{clinicalEnvironment.workspaceName}</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <ClinicalBadge label={clinicalEnvironment.region} severity="success" />
                <ClinicalBadge label={clinicalEnvironment.uptime} severity="info" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {operationalSignals.slice(0, 4).map((signal) => (
                <div key={signal.label} className="rounded border border-border bg-background px-3 py-2">
                  <div className="mb-1 flex items-center gap-1.5">
                    <signal.icon className="size-3.5 text-primary" />
                    <span className="truncate text-[10px] font-semibold uppercase text-muted-foreground">{signal.label}</span>
                  </div>
                  <div className="text-xs font-medium">{signal.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="hidden min-h-screen grid-rows-[auto_1fr_auto] gap-4 p-5 lg:grid">
        <div className="grid gap-3 xl:grid-cols-[1fr_360px]">
          <div className="rounded-md border border-border bg-panel p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">Clinical workspace</div>
                <h2 className="mt-1 text-xl font-semibold tracking-normal">{clinicalEnvironment.workspaceName}</h2>
              </div>
              <ClinicalBadge label={clinicalEnvironment.region} severity="success" />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-5">
              {workspaceRows.map((row) => (
                <div key={row.label} className="rounded border border-border bg-background px-3 py-2">
                  <div className="text-[10px] font-semibold uppercase text-muted-foreground">{row.label}</div>
                  <div className="mt-1 truncate text-xs font-medium">{row.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Compliance state</div>
              <ShieldCheck className="size-4 text-primary" />
            </div>
            <div className="grid gap-2">
              {clinicalEnvironment.compliance.map((item) => (
                <div key={item} className="flex items-center gap-2 rounded border border-border bg-background px-3 py-2 text-xs">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1fr_420px]">
          <div className="rounded-md border border-border bg-panel p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Operational signal board</h3>
                <p className="text-xs text-muted-foreground">System state exposed before authentication for workstation awareness.</p>
              </div>
              <StatusIndicator label="Cluster live" tone="online" pulse />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {operationalSignals.map((signal) => (
                <div key={signal.label} className="rounded border border-border bg-background p-3">
                  <div className="flex items-start justify-between gap-2">
                    <signal.icon className="size-4 text-primary" />
                    <ClinicalBadge label={signal.value} severity={signal.tone === "warning" ? "warning" : signal.tone === "success" ? "success" : "info"} />
                  </div>
                  <div className="mt-3 text-xs font-semibold">{signal.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-md border border-border bg-panel p-4">
            <div className="mb-3 flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <h3 className="text-sm font-semibold">Connected modules</h3>
            </div>
            <div className="grid max-h-[328px] gap-1.5 overflow-hidden text-xs">
              {clinicalModules.map((module) => (
                <div key={module} className="flex items-center justify-between rounded border border-border bg-background px-2.5 py-1.5">
                  <span>{module}</span>
                  <span className="text-[10px] uppercase text-emerald-600 dark:text-emerald-400">Ready</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-5">
          {Object.values(featureRegistry).map((feature) => (
            <div key={feature.key} className="rounded border border-border bg-panel px-3 py-2">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground">{feature.label}</div>
              <div className="mt-1 flex items-center gap-2">
                <StatusIndicator label={feature.enabled ? "Enabled" : "Disabled"} tone={feature.enabled ? "online" : "muted"} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
