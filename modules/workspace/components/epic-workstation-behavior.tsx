"use client";

import {
  Activity,
  BadgeCheck,
  BedDouble,
  Clock3,
  Command,
  FileSearch,
  Grip,
  History,
  LayoutPanelTop,
  ListChecks,
  MessageSquareWarning,
  MonitorSmartphone,
  Pin,
  ScanLine,
  Settings2,
  ShieldCheck,
  Sparkles,
  TableProperties,
  UserRoundCog,
  Zap,
} from "lucide-react";
import type React from "react";
import { useState } from "react";

import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  bedFlowItems,
  clinicalDocSnippets,
  orderSets,
  systemTrace,
  workspaceEvents,
} from "@/modules/workspace/data/seeded-workspace";
import type { Acuity, WorkspaceEvent, WorkspacePatient, WorkspaceView } from "@/modules/workspace/types/workspace";

const acuityClasses: Record<Acuity, string> = {
  routine: "border-border bg-background text-muted-foreground",
  watch: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  urgent: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  critical: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

const severityFor = (tone: Acuity) => (tone === "critical" ? "critical" : tone === "urgent" ? "warning" : tone === "watch" ? "info" : "success");

const activities = [
  ["chart", "Patient Chart", "open", "p-001", "Chart review + problem list"],
  ["mar", "MAR", "dirty", "p-001", "Barcode verification pending"],
  ["orders", "Orders", "open", "p-002", "ACS order set staged"],
  ["labs", "Labs", "new", "p-004", "CBC resulted"],
  ["imaging", "Imaging", "open", "p-002", "Echo signed"],
  ["rounds", "Rounds", "active", "p-003", "Overnight events reviewed"],
  ["icu", "ICU Monitor", "alarm", "p-001", "MAP below target"],
] as const;

const roleContexts = {
  ICU: ["Telemetry", "Vasopressors", "Vent bundle", "Rapid response", "ABG"],
  ED: ["Tracking board", "Stroke route", "Trauma bay", "Triage", "Boarding"],
  Rounds: ["My list", "Overnight", "Discharge barriers", "Quick note", "Orders"],
  OR: ["Rooms", "PACU", "Blood bank", "Turnover", "Anesthesia"],
  Nursing: ["MAR", "Flowsheets", "Handoff", "Tasks", "Rover"],
  Command: ["Capacity", "Staffing", "Incident", "Transport", "Broadcast"],
} as const;

type RoleContext = keyof typeof roleContexts;

export function ContextAwareWorkspace({ activeView, role, onRole }: { activeView: WorkspaceView; role: RoleContext; onRole: (role: RoleContext) => void }) {
  return (
    <div className="border-b border-border bg-background px-2 py-1">
      <div className="flex flex-wrap items-center gap-1">
        <RoleContextSwitcher role={role} onRole={onRole} />
        <span className="mx-1 h-4 border-l border-border" />
        <span className="font-mono text-[10px] uppercase text-muted-foreground">Context-aware actions</span>
        {roleContexts[role].map((action) => (
          <span key={action} className="border border-border bg-panel px-2 py-1 text-[10px]">
            {action}
          </span>
        ))}
        <span className="ml-auto font-mono text-[10px] uppercase text-muted-foreground">workspace/{activeView}</span>
      </div>
    </div>
  );
}

export function RoleContextSwitcher({ role, onRole }: { role: RoleContext; onRole: (role: RoleContext) => void }) {
  return (
    <div className="flex items-center gap-1">
      <UserRoundCog className="size-3.5 text-primary" />
      {(Object.keys(roleContexts) as RoleContext[]).map((item) => (
        <button key={item} type="button" onClick={() => onRole(item)} className={cn("border px-2 py-1 text-[10px]", role === item ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent")}>
          {item}
        </button>
      ))}
    </div>
  );
}

export function HyperspaceActivityDock({ activePatient, onAction, onPatient }: { activePatient: WorkspacePatient; onAction: (action: string) => void; onPatient: (patientId: string) => void }) {
  return (
    <div className="border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-2 py-1">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase text-muted-foreground"><LayoutPanelTop className="size-3.5" /> Activity workspace</span>
        <span className="font-mono text-[10px] text-muted-foreground">state retained · tabs memorized · {activePatient.uhid}</span>
      </div>
      <div className="flex gap-1 overflow-x-auto p-1">
        {activities.map(([id, label, state, patientId, detail]) => (
          <button key={id} type="button" onClick={() => { onPatient(patientId); onAction(label); }} className={cn("min-w-44 border px-2 py-1 text-left text-xs hover:border-primary", state === "alarm" ? acuityClasses.critical : state === "dirty" || state === "new" ? acuityClasses.urgent : "border-border bg-panel")}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{label}</span>
              <span className="font-mono text-[10px]">{state}</span>
            </div>
            <div className="mt-1 truncate text-[10px] text-muted-foreground">{detail}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function MultiPatientSessionRail({ patients, activePatientId, onPatient }: { patients: WorkspacePatient[]; activePatientId: string; onPatient: (patientId: string) => void }) {
  return (
    <div className="grid gap-1">
      {patients.map((patient, index) => (
        <button key={patient.id} type="button" onClick={() => onPatient(patient.id)} className={cn("grid grid-cols-[20px_1fr_42px] items-center border px-2 py-1 text-left text-[11px] hover:border-primary", patient.id === activePatientId ? "border-primary bg-primary/10" : acuityClasses[patient.acuity])}>
          <span>{index < 3 ? <Pin className="size-3 text-primary" /> : <Grip className="size-3 text-muted-foreground" />}</span>
          <span className="min-w-0">
            <span className="block truncate font-semibold">{patient.name}</span>
            <span className="block truncate font-mono text-[10px] opacity-75">{patient.bed} · {patient.status}</span>
          </span>
          <span className="font-mono text-[10px]">{patient.pendingTasks}</span>
        </button>
      ))}
    </div>
  );
}

export function StickyEncounterHeader({ patient, role }: { patient: WorkspacePatient; role: RoleContext }) {
  return (
    <div className="sticky top-0 z-10 border border-border bg-background/95 px-2 py-1 backdrop-blur">
      <div className="flex flex-wrap items-center gap-2 text-[11px]">
        <span className="font-mono font-semibold text-primary">{patient.uhid}</span>
        <span className="font-semibold">{patient.name}</span>
        <ClinicalBadge label={patient.acuity} severity={severityFor(patient.acuity)} />
        <span>{patient.encounter}</span>
        <span>{patient.bed}</span>
        <span>{patient.doctor}</span>
        <span className="ml-auto font-mono uppercase text-muted-foreground">{role} context · scroll/session retained</span>
      </div>
    </div>
  );
}

export function PersonalizationManager({ onAction }: { onAction: (action: string) => void }) {
  const presets = ["ICU night shift", "Morning rounds", "ED surge", "OR control", "Discharge huddle"];
  const filters = ["My patients", "Sepsis watch", "Pending discharge", "Telemetry alarms", "Isolation"];

  return (
    <WorkstationBox icon={Settings2} eyebrow="Clinician personalization" title="Workspace presets and saved filters">
      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-1">
          {presets.map((preset) => (
            <button key={preset} type="button" onClick={() => onAction(`Load ${preset}`)} className="border border-border px-2 py-1 text-left text-xs hover:bg-accent">
              {preset}
            </button>
          ))}
        </div>
        <div className="grid gap-1">
          {filters.map((filter) => (
            <button key={filter} type="button" onClick={() => onAction(`Filter ${filter}`)} className="border border-border px-2 py-1 text-left text-xs hover:bg-accent">
              {filter}
            </button>
          ))}
        </div>
      </div>
    </WorkstationBox>
  );
}

export function SmartPhrasePanel({ onAction }: { onAction: (action: string) => void }) {
  const phrases = [
    [".sepsisnote", "Sepsis reassessment with bundle timing and pressor response."],
    [".rounding", "Overnight events, barriers, plan by problem, discharge readiness."],
    [".icuvent", "Vent settings, RASS target, ABG interpretation, weaning readiness."],
    [".dischargesummary", "Diagnosis, course, meds, instructions, follow-up."],
    ...clinicalDocSnippets.map((snippet) => [snippet.shortcut, snippet.content] as const),
  ] as const;

  return (
    <WorkstationBox icon={Sparkles} eyebrow="SmartTools simulation" title="SmartPhrase / SmartText / macros">
      <div className="grid gap-1">
        {phrases.map(([shortcut, content]) => (
          <button key={shortcut} type="button" onClick={() => onAction(shortcut)} className="grid grid-cols-[116px_1fr] border border-border px-2 py-1.5 text-left text-xs hover:bg-accent">
            <span className="font-mono font-semibold text-primary">{shortcut}</span>
            <span className="truncate text-muted-foreground">{content}</span>
          </button>
        ))}
      </div>
    </WorkstationBox>
  );
}

export function SmartOrdersRail({ patient, onAction }: { patient: WorkspacePatient; onAction: (action: string) => void }) {
  return (
    <WorkstationBox icon={Zap} eyebrow="Smart orders" title={`Favorites for ${patient.doctor}`}>
      <div className="grid gap-1">
        {orderSets.map((set) => (
          <button key={set.id} type="button" onClick={() => onAction(`Favorite order ${set.name}`)} className={cn("border px-2 py-1.5 text-left text-xs hover:bg-accent", acuityClasses[set.priority])}>
            <div className="flex justify-between gap-2">
              <span className="font-semibold">{set.name}</span>
              <span className="font-mono">{set.specialty}</span>
            </div>
            <div className="mt-1 truncate text-[10px] opacity-75">{set.items.slice(0, 3).join(" · ")}</div>
          </button>
        ))}
      </div>
    </WorkstationBox>
  );
}

export function EnterprisePatientList({ patients, activePatientId, onPatient, onAction }: { patients: WorkspacePatient[]; activePatientId: string; onPatient: (patientId: string) => void; onAction: (action: string) => void }) {
  const groups = [
    ["Rounding list", patients],
    ["ICU census", patients.filter((patient) => patient.ward.includes("ICU") || patient.acuity === "critical")],
    ["Discharge candidates", patients.filter((patient) => patient.status.toLowerCase().includes("discharge") || patient.pendingTasks <= 3)],
    ["Sepsis watchlist", patients.filter((patient) => patient.status.toLowerCase().includes("sepsis") || patient.flags.includes("Critical labs"))],
    ["Telemetry watchlist", patients.filter((patient) => Number(patient.vitals.pulse) > 100 || Number(patient.vitals.spo2) < 95)],
  ] as const;

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-1">
        {groups.map(([label, rows]) => (
          <button key={label} type="button" onClick={() => onAction(label)} className="border border-border bg-background px-2 py-1 text-[10px] hover:border-primary">
            {label} <span className="font-mono text-muted-foreground">{rows.length}</span>
          </button>
        ))}
      </div>
      <div className="border border-border">
        <div className="grid grid-cols-[24px_1.3fr_70px_82px_72px_70px_54px_90px] border-b border-border bg-muted/40 px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
          <span />
          <span>Patient</span>
          <span>Acuity</span>
          <span>Bed</span>
          <span>Labs</span>
          <span>Nurse</span>
          <span>Risk</span>
          <span>Timeline</span>
        </div>
        {patients.map((patient, index) => (
          <button key={patient.id} type="button" onClick={() => onPatient(patient.id)} className={cn("grid w-full grid-cols-[24px_1.3fr_70px_82px_72px_70px_54px_90px] items-center border-b border-border px-2 py-1.5 text-left text-xs last:border-b-0 hover:bg-accent/40", activePatientId === patient.id && "bg-primary/10")}>
            <span>{index < 3 ? <Pin className="size-3 text-primary" /> : <Grip className="size-3 text-muted-foreground" />}</span>
            <span className="truncate font-semibold">{patient.name}</span>
            <ClinicalBadge label={patient.acuity} severity={severityFor(patient.acuity)} />
            <span className="font-mono">{patient.bed}</span>
            <span>{patient.acuity === "critical" ? "panic" : patient.acuity === "urgent" ? "pending" : "ok"}</span>
            <span>{["Asha", "Robin", "Preeti", "Imran", "Lata"][index]}</span>
            <span className={patient.flags.length ? "text-amber-300" : "text-muted-foreground"}>{patient.flags.length}</span>
            <span className="font-mono text-[10px]">{patient.lastEvent.split(" ").slice(0, 2).join(" ")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function FlowsheetGrid({ patient, onAction }: { patient: WorkspacePatient; onAction: (action: string) => void }) {
  const times = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const rows = [
    ["Temp C", patient.vitals.temp, "37.9", "38.1", "38.4", "38.0", "37.7", "37.4", "37.1"],
    ["HR", patient.vitals.pulse, "122", "126", "132", "128", "118", "110", "102"],
    ["SpO2", patient.vitals.spo2, "94", "92", "91", "93", "94", "95", "96"],
    ["MAP", "61", "63", "64", "66", "68", "70", "72", "74"],
    ["Pain", "3", "4", "4", "2", "2", "1", "1", "1"],
    ["RASS", "-1", "-1", "-2", "-1", "0", "0", "0", "0"],
    ["I/O net", "+410", "+520", "+600", "+480", "+390", "+260", "+190", "+120"],
    ["Neuro", "PERRL", "PERRL", "PERRL", "sleepy", "alert", "alert", "alert", "alert"],
  ];

  return (
    <WorkstationBox icon={TableProperties} eyebrow="Flowsheet documentation" title="Bedside vitals, respiratory, neuro, sedation, I/O">
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          <div className="grid grid-cols-[132px_repeat(8,1fr)] border-b border-border bg-muted/40 text-[10px] font-semibold uppercase text-muted-foreground">
            <div className="sticky left-0 bg-muted/40 px-2 py-1">Measure</div>
            {times.map((time) => <div key={time} className="border-l border-border px-2 py-1 font-mono">{time}</div>)}
          </div>
          {rows.map(([label, ...values]) => (
            <div key={label} className="grid grid-cols-[132px_repeat(8,1fr)] border-b border-border last:border-b-0 text-xs">
              <button type="button" onClick={() => onAction(`Flowsheet ${label}`)} className="sticky left-0 border-r border-border bg-background px-2 py-1 text-left font-semibold hover:bg-accent">{label}</button>
              {values.map((value, index) => (
                <button key={`${label}-${index}`} type="button" onClick={() => onAction(`${label} ${times[index]}`)} className={cn("border-l border-border px-2 py-1 font-mono hover:bg-accent", (label === "SpO2" && Number(value) < 93) || (label === "MAP" && Number(value) < 65) ? "bg-red-500/10 text-red-300" : "")}>
                  {value}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </WorkstationBox>
  );
}

export function ChartReviewWorkspace({ patient, events, onAction }: { patient: WorkspacePatient; events: WorkspaceEvent[]; onAction: (action: string) => void }) {
  const [query, setQuery] = useState("lactate");
  const combinedEvents = [...events, ...workspaceEvents].slice(0, 10);

  return (
    <div className="grid gap-2 2xl:grid-cols-[1fr_300px]">
      <WorkstationBox icon={FileSearch} eyebrow="Chart review" title="Longitudinal filters, search, pinned events">
        <div className="mb-2 grid gap-2 md:grid-cols-[220px_1fr]">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-8" placeholder="Search chart..." />
          <div className="flex flex-wrap gap-1">
            {["All encounters", "Notes", "Labs", "Imaging", "Meds", "Problems", "Pinned"].map((filter) => (
              <button key={filter} type="button" onClick={() => onAction(filter)} className="border border-border px-2 py-1 text-[10px] hover:border-primary">{filter}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-1">
          {combinedEvents.map((event, index) => (
            <button key={`${event.id}-${index}`} type="button" onClick={() => onAction(event.title)} className={cn("grid grid-cols-[58px_92px_1fr_58px] border px-2 py-1.5 text-left text-xs hover:bg-accent/40", event.title.toLowerCase().includes(query.toLowerCase()) ? "border-primary bg-primary/10" : "border-border")}>
              <span className="font-mono">{event.time}</span>
              <ClinicalBadge label={event.type} severity={severityFor(event.acuity)} />
              <span className="truncate">{event.title} · {event.summary}</span>
              <span className="font-mono text-[10px] text-muted-foreground">E-{index + 1}</span>
            </button>
          ))}
        </div>
      </WorkstationBox>
      <WorkstationBox icon={History} eyebrow="Compare encounters" title={patient.encounter}>
        <div className="grid gap-1">
          {["Current IPD", "Prior OPD", "External summary", "Medication history", "Imaging timeline"].map((item, index) => (
            <button key={item} type="button" onClick={() => onAction(item)} className="border border-border px-2 py-1.5 text-left text-xs hover:bg-accent">
              <div className="flex justify-between">
                <span className="font-semibold">{item}</span>
                <span className="font-mono text-muted-foreground">{index === 0 ? "open" : `${index + 2}d`}</span>
              </div>
            </button>
          ))}
        </div>
      </WorkstationBox>
    </div>
  );
}

export function RoverMobileOverlay({ active, patient, onClose, onAction }: { active: boolean; patient: WorkspacePatient; onClose: () => void; onAction: (action: string) => void }) {
  if (!active) return null;

  return (
    <div className="fixed right-5 top-24 z-40 w-[310px] border border-primary/50 bg-background shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-2 py-1">
        <span className="flex items-center gap-1 text-xs font-semibold"><MonitorSmartphone className="size-4 text-primary" /> Rover bedside mode</span>
        <Button size="sm" variant="ghost" onClick={onClose}>Close</Button>
      </div>
      <div className="grid gap-2 p-2 text-xs">
        <div className="border border-border bg-panel p-2">
          <div className="font-semibold">{patient.name}</div>
          <div className="font-mono text-[10px] text-muted-foreground">{patient.uhid} · {patient.bed}</div>
        </div>
        {([
          ["Wristband", "verified", BadgeCheck],
          ["Medication scan", "pending", ScanLine],
          ["Bedside vitals", "capture", Activity],
          ["Task complete", "rapid sign", ListChecks],
        ] as const).map(([label, state, Icon]) => (
          <button key={label} type="button" onClick={() => onAction(label)} className="flex items-center justify-between border border-border px-2 py-1.5 hover:bg-accent">
            <span className="flex items-center gap-2"><Icon className="size-3.5" /> {label}</span>
            <span className="font-mono text-[10px]">{state}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function BedHuddleBoard({ onAction }: { onAction: (action: string) => void }) {
  return (
    <WorkstationBox icon={BedDouble} eyebrow="Bed huddle / patient flow" title="Forecasting, bottlenecks, boarding, EVS, PACU">
      <div className="grid gap-2 2xl:grid-cols-[1fr_260px]">
        <div className="grid gap-1">
          {bedFlowItems.map((item) => (
            <button key={item.id} type="button" onClick={() => onAction(item.bed)} className={cn("grid grid-cols-[78px_1fr_104px_64px] border px-2 py-1.5 text-left text-xs hover:bg-accent/40", acuityClasses[item.pressure])}>
              <span className="font-mono font-semibold">{item.bed}</span>
              <span className="truncate">{item.state} · {item.patient}</span>
              <span className="truncate">{item.blocker}</span>
              <span className="font-mono text-right">{item.eta}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 48 }).map((_, index) => {
            const tone: Acuity = index % 13 === 0 ? "critical" : index % 7 === 0 ? "urgent" : index % 5 === 0 ? "watch" : "routine";
            return <button key={index} type="button" onClick={() => onAction(`Flow cell ${index + 1}`)} className={cn("h-6 border text-[9px]", acuityClasses[tone])}>{index + 1}</button>;
          })}
        </div>
      </div>
    </WorkstationBox>
  );
}

export function ClinicalInterruptOverlay({ events, onAction }: { events: WorkspaceEvent[]; onAction: (action: string) => void }) {
  const interruptItems = [
    ["PAGE", "Dr. Meera: review ICU-2A now", "critical"],
    ["LAB PANIC", "Lactate repeat due, K+ callback pending", "critical"],
    ["MED OVERRIDE", "Penicillin allergy verification", "urgent"],
    ["CONSULT", "Neurology accepted stroke route", "urgent"],
    ...events.slice(0, 2).map((event) => [event.type.toUpperCase(), event.title, event.acuity] as const),
  ] as const;

  return (
    <div className="fixed left-1/2 top-14 z-30 w-[min(760px,calc(100vw-32px))] -translate-x-1/2 border border-red-500/30 bg-background/95 shadow-2xl backdrop-blur">
      <div className="flex items-center justify-between border-b border-border px-2 py-1">
        <span className="flex items-center gap-1 text-xs font-semibold text-red-300"><MessageSquareWarning className="size-4 animate-pulse" /> Clinical interruption stack</span>
        <span className="font-mono text-[10px] text-muted-foreground">focus rerouting · duplicate suppression on</span>
      </div>
      <div className="grid gap-1 p-1 md:grid-cols-3">
        {interruptItems.slice(0, 6).map(([kind, label, tone]) => (
          <button key={`${kind}-${label}`} type="button" onClick={() => onAction(`${kind}: ${label}`)} className={cn("border px-2 py-1 text-left text-[11px] hover:bg-accent", acuityClasses[tone as Acuity])}>
            <div className="font-mono font-semibold">{kind}</div>
            <div className="truncate opacity-80">{label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AuditTraceViewer({ onAction }: { onAction: (action: string) => void }) {
  const auditRows = [
    ["09:57:02", "Dr. Meera Iyer", "Opened chart", "p-001", "latency 180ms", "routine"],
    ["09:57:08", "Nurse Asha", "Acknowledged MAP alert", "ICU-2A", "latency 42s", "critical"],
    ["09:57:19", "Ritika S", "Medication override reviewed", "RX-1", "latency 02m", "urgent"],
    ["09:57:27", "Transport desk", "Transfer ETA changed", "ED -> ICU", "latency 09m", "urgent"],
    ...systemTrace.map((trace) => [trace.time, trace.source, trace.message, "system", "auto", trace.pressure] as const),
  ] as const;

  return (
    <div className="grid gap-2 2xl:grid-cols-[1fr_280px]">
      <WorkstationBox icon={ShieldCheck} eyebrow="Enterprise traceability" title="Access logs, acknowledgements, lifecycle, latency">
        <div className="grid gap-1">
          {auditRows.map(([time, actor, action, target, latency, tone]) => (
            <button key={`${time}-${action}`} type="button" onClick={() => onAction(action)} className={cn("grid grid-cols-[70px_130px_1fr_100px_90px] border px-2 py-1.5 text-left text-xs hover:bg-accent/40", acuityClasses[tone as Acuity])}>
              <span className="font-mono">{time}</span>
              <span className="truncate font-semibold">{actor}</span>
              <span className="truncate">{action}</span>
              <span className="font-mono">{target}</span>
              <span className="font-mono text-right">{latency}</span>
            </button>
          ))}
        </div>
      </WorkstationBox>
      <WorkflowLatencyPanel />
    </div>
  );
}

export function WorkflowLatencyPanel() {
  return (
    <WorkstationBox icon={Clock3} eyebrow="Workflow latency" title="Operational delay map">
      {[
        ["Alert ack", "42s", "critical"],
        ["Order verify", "02m", "urgent"],
        ["Transport assign", "09m", "urgent"],
        ["Lab critical call", "01m", "watch"],
        ["Chart open", "180ms", "routine"],
      ].map(([label, value, tone]) => (
        <div key={label} className={cn("mb-1 grid grid-cols-[1fr_62px] border px-2 py-1.5 text-xs last:mb-0", acuityClasses[tone as Acuity])}>
          <span>{label}</span>
          <span className="font-mono text-right">{value}</span>
        </div>
      ))}
    </WorkstationBox>
  );
}

export function AdvancedCommandHints() {
  return (
    <div className="border-t border-border bg-muted/30 px-3 py-2 text-[11px] text-muted-foreground">
      <div className="mb-1 flex items-center gap-1 font-semibold uppercase"><Command className="size-3.5" /> Workstation command engine</div>
      <div className="grid gap-1 md:grid-cols-3">
        {["jump patient / open recent chart", "switch role / launch chart review", "assign transport / trigger rapid response"].map((hint) => (
          <span key={hint} className="border border-border bg-background px-2 py-1">{hint}</span>
        ))}
      </div>
    </div>
  );
}

function WorkstationBox({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-background">
      <div className="flex items-center gap-2 border-b border-border px-2 py-1.5">
        <Icon className="size-3.5 text-primary" />
        <div className="min-w-0">
          <div className="text-[9px] font-semibold uppercase text-muted-foreground">{eyebrow}</div>
          <div className="truncate text-xs font-semibold">{title}</div>
        </div>
      </div>
      <div className="p-2">{children}</div>
    </section>
  );
}
