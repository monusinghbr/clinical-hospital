"use client";

import { AlertTriangle, CheckCircle2, ClipboardPlus, FileSearch, FlaskConical, Pill, Radio, ScanLine } from "lucide-react";

import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { StatusIndicator } from "@/components/clinical/status-indicator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { medicationAdministrations, orderQueue, orderSets, radiologyStudies } from "@/modules/workspace/data/seeded-workspace";
import type { Acuity, WorkspacePatient } from "@/modules/workspace/types/workspace";

const acuityClasses: Record<Acuity, string> = {
  routine: "border-border bg-background text-muted-foreground",
  watch: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  urgent: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  critical: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

export function MedicationAdministrationPanel({ patient, onAction }: { patient: WorkspacePatient; onAction: (action: string) => void }) {
  const rows = medicationAdministrations.filter((item) => item.patientId === patient.id || item.status === "late" || item.status === "due");

  return (
    <div className="rounded-md border border-border bg-background">
      <PanelHeader icon={Pill} eyebrow="eMAR / bedside medication" title="Medication Administration Record" right={<StatusIndicator label="barcode scan ready" tone="online" />} />
      <div className="grid grid-cols-[88px_1fr_72px_80px_96px_120px] border-b border-border px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
        <span>Due</span>
        <span>Medication</span>
        <span>Dose</span>
        <span>Route</span>
        <span>Status</span>
        <span>Nurse</span>
      </div>
      {rows.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onAction(`MAR ${item.medication}`)}
          className={cn(
            "grid w-full grid-cols-[88px_1fr_72px_80px_96px_120px] items-center border-b border-border px-2 py-2 text-left text-xs last:border-0 hover:bg-accent/40",
            item.status === "late" && "bg-red-500/10",
            item.status === "due" && "bg-amber-500/10",
          )}
        >
          <span className="font-mono">{item.due}</span>
          <span>
            <span className="font-semibold">{item.medication}</span>
            {item.warning ? (
              <span className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-300">
                <AlertTriangle className="size-3" />
                {item.warning}
              </span>
            ) : null}
          </span>
          <span>{item.dose}</span>
          <span>{item.route}</span>
          <ClinicalBadge label={item.status} severity={item.status === "late" ? "critical" : item.status === "due" ? "warning" : "success"} />
          <span className="text-muted-foreground">{item.nurse}</span>
        </button>
      ))}
      <div className="flex items-center justify-between border-t border-border px-3 py-2">
        <div className="text-[11px] text-muted-foreground">Simulates barcode workflow, due-now medication safety, holds, and bedside administration state.</div>
        <Button size="sm" variant="outline" onClick={() => onAction("Open barcode MAR scan")}>
          <ScanLine />
          Scan
        </Button>
      </div>
    </div>
  );
}

export function CpoeOrdersPanel({ patient, onAction }: { patient: WorkspacePatient; onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3">
      <div className="rounded-md border border-border bg-background">
        <PanelHeader icon={ClipboardPlus} eyebrow="CPOE / order entry" title="Order sets and active queues" right={<ClinicalBadge label={`${patient.activeOrders} active`} severity="info" />} />
        <div className="grid gap-2 p-3 md:grid-cols-2">
          {orderSets.map((set) => (
            <button key={set.id} type="button" onClick={() => onAction(`Order set: ${set.name}`)} className={cn("rounded border p-3 text-left hover:border-primary", acuityClasses[set.priority])}>
              <div className="flex items-center justify-between gap-2">
                <div className="font-semibold">{set.name}</div>
                <ClinicalBadge label={set.specialty} severity={set.priority === "critical" ? "critical" : set.priority === "urgent" ? "warning" : "info"} />
              </div>
              <div className="mt-2 grid gap-1">
                {set.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="size-3 text-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border bg-background">
        <PanelHeader icon={FlaskConical} eyebrow="live queue" title="Orders requiring action" right={<StatusIndicator label="routing active" tone="online" pulse />} />
        {orderQueue.map((order) => (
          <button key={order.id} type="button" onClick={() => onAction(order.label)} className="grid w-full grid-cols-[88px_1fr_92px_72px] items-center border-t border-border px-3 py-2 text-left text-xs hover:bg-accent/40">
            <span className="font-semibold">{order.queue}</span>
            <span>{order.label}</span>
            <ClinicalBadge label={order.status} severity={order.priority === "critical" ? "critical" : order.priority === "urgent" ? "warning" : "info"} />
            <span className="font-mono text-muted-foreground">{order.eta}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function RadiologyDiagnosticsPanel({ patient, onAction }: { patient: WorkspacePatient; onAction: (action: string) => void }) {
  const studies = radiologyStudies.filter((study) => study.patientId === patient.id || study.status === "critical");
  const selected = studies[0] ?? radiologyStudies[0];

  return (
    <div className="grid gap-3 2xl:grid-cols-[280px_1fr_320px]">
      <div className="rounded-md border border-border bg-background">
        <PanelHeader icon={Radio} eyebrow="diagnostic queue" title="Radiology worklist" />
        {studies.map((study) => (
          <button key={study.id} type="button" onClick={() => onAction(`Open study ${study.accession}`)} className="w-full border-t border-border px-3 py-2 text-left text-xs hover:bg-accent/40">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-semibold">{study.accession}</span>
              <ClinicalBadge label={study.modality} severity={study.status === "critical" ? "critical" : "info"} />
            </div>
            <div className="mt-1 font-semibold">{study.study}</div>
            <div className="mt-1 text-muted-foreground">{study.status} · {study.timestamp}</div>
          </button>
        ))}
      </div>

      <div className="min-h-[420px] rounded-md border border-border bg-[#050708] p-3 text-slate-200">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-mono">{selected.accession}</span>
          <span>{selected.modality} · {selected.study}</span>
        </div>
        <div className="grid h-[360px] grid-cols-2 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="relative overflow-hidden rounded border border-slate-700 bg-[radial-gradient(circle_at_center,#334155_0,#111827_42%,#020617_78%)]">
              <div className="absolute left-2 top-2 font-mono text-[10px] text-emerald-300">IMG {index + 1}</div>
              <div className="absolute inset-x-6 top-1/2 h-px bg-emerald-400/40" />
              <div className="absolute inset-y-6 left-1/2 w-px bg-emerald-400/40" />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border bg-background">
        <PanelHeader icon={FileSearch} eyebrow="reporting" title="Diagnostic report" />
        <div className="grid gap-3 p-3 text-xs">
          <div>
            <div className="text-[10px] font-semibold uppercase text-muted-foreground">Radiologist</div>
            <div className="mt-1 font-semibold">{selected.radiologist}</div>
          </div>
          <div>
            <div className="text-[10px] font-semibold uppercase text-muted-foreground">Impression</div>
            <p className="mt-1 leading-5 text-muted-foreground">{selected.impression}</p>
          </div>
          <Button variant={selected.status === "critical" ? "destructive" : "outline"} onClick={() => onAction("Sign diagnostic report")}>
            Sign report
          </Button>
        </div>
      </div>
    </div>
  );
}

function PanelHeader({
  icon: Icon,
  eyebrow,
  title,
  right,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-primary" />
        <div>
          <div className="text-[10px] font-semibold uppercase text-muted-foreground">{eyebrow}</div>
          <div className="text-sm font-semibold">{title}</div>
        </div>
      </div>
      {right}
    </div>
  );
}
