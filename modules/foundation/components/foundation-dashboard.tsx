import { ArrowRight, Database, LockKeyhole, RadioTower, Rows3, ShieldCheck } from "lucide-react";

import { AlertBanner } from "@/components/clinical/alert-banner";
import { EmptyState } from "@/components/clinical/empty-state";
import { StatusIndicator } from "@/components/clinical/status-indicator";
import { Timeline } from "@/components/clinical/timeline";
import { Button } from "@/components/ui/button";
import { operationalQueues, foundationTimeline } from "@/modules/foundation/data/clinical-command";

export function FoundationDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 p-4">
      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-md border border-border bg-panel p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">Phase 1 foundation architecture</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal">Clinical operations shell</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                A Vercel-native HMS clinical module foundation with Auth.js RBAC, Prisma on Supabase PostgreSQL, realtime event abstraction,
                audit-ready server utilities, and dense workflow components for the next care phases.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <StatusIndicator label="RBAC" tone="online" />
              <StatusIndicator label="Audit" tone="online" />
              <StatusIndicator label="Realtime" tone="idle" />
              <StatusIndicator label="Supabase" tone="idle" />
            </div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <AlertBanner title="Protected by default" detail="Route, API, action, and component guard layers are wired for role permissions." severity="info" />
            <AlertBanner title="Serverless compatible" detail="No Docker, Redis, VPS, or self-hosted services required for the target architecture." severity="info" />
            <AlertBanner title="Clinical phases staged" detail="Data model is already prepared for OPD, IPD, nursing, ICU, orders, and discharge." severity="warning" />
          </div>
        </div>
        <div className="rounded-md border border-border bg-panel p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Implementation timeline</h2>
              <p className="text-xs text-muted-foreground">Foundation state and next clinical phase</p>
            </div>
            <Button variant="outline" size="sm">
              Phase 2
              <ArrowRight />
            </Button>
          </div>
          <Timeline items={foundationTimeline} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-md border border-border bg-panel p-4">
          <div className="mb-3 flex items-center gap-2">
            <Rows3 className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Operational queues</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {operationalQueues.map((queue) => (
              <div key={queue.title} className="rounded-md border border-border bg-background p-3">
                <div className="flex items-start gap-3">
                  <queue.icon className="mt-0.5 size-4 text-primary" />
                  <div>
                    <div className="text-sm font-semibold">{queue.title}</div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{queue.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <EmptyState
            icon={Database}
            title="Supabase schema ready"
            description="Run Prisma migrations against Supabase PostgreSQL after setting DATABASE_URL and DIRECT_URL."
          />
          <EmptyState
            icon={LockKeyhole}
            title="Seed access required"
            description="Create the first Super Admin and hospital membership before clinical users can sign in."
          />
          <EmptyState
            icon={RadioTower}
            title="Realtime channel pending"
            description="Connect Supabase Realtime or Pusher credentials to deliver ward, alert, and consultation events."
          />
        </div>
      </section>

      <section className="rounded-md border border-border bg-panel p-4">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <h2 className="text-sm font-semibold">Security and compliance posture</h2>
        </div>
        <div className="grid gap-2 text-sm md:grid-cols-4">
          {["Multi-hospital tenancy", "Soft-delete records", "Audit log events", "Feature permissions"].map((item) => (
            <div key={item} className="rounded border border-border bg-background px-3 py-2 text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
