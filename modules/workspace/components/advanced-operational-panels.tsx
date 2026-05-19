"use client";

import {
  Activity,
  Ambulance,
  BedDouble,
  Brain,
  ClipboardCheck,
  Droplets,
  FilePenLine,
  Hospital,
  Pill,
  RadioTower,
  Route,
  ShieldAlert,
  Siren,
  Syringe,
  UsersRound,
  Waves,
} from "lucide-react";
import type React from "react";

import { AlertBanner } from "@/components/clinical/alert-banner";
import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { StatusIndicator } from "@/components/clinical/status-indicator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  bedFlowItems,
  clinicalDocSnippets,
  emergencyIncidents,
  hospitalMetrics,
  nursingAssignments,
  orCases,
  pharmacyQueueItems,
  staffingZones,
} from "@/modules/workspace/data/seeded-workspace";
import type { Acuity, EmergencyIncident, IcuBed, WorkspaceEvent, WorkspacePatient } from "@/modules/workspace/types/workspace";

const acuityClasses: Record<Acuity, string> = {
  routine: "border-border bg-background text-muted-foreground",
  watch: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  urgent: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  critical: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

const severityFor = (tone: Acuity) => (tone === "critical" ? "critical" : tone === "urgent" ? "warning" : tone === "watch" ? "info" : "success");

export function RapidResponseOverlay({
  active,
  incident = emergencyIncidents[0],
  onClose,
  onAction,
}: {
  active: boolean;
  incident?: EmergencyIncident;
  onClose: () => void;
  onAction: (action: string) => void;
}) {
  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 bg-red-950/20 ring-4 ring-inset ring-red-500/20">
      <div className="absolute inset-x-0 top-0 h-1 animate-pulse bg-red-500" />
      <div className="pointer-events-auto absolute left-1/2 top-16 w-[min(920px,calc(100vw-32px))] -translate-x-1/2 border border-red-500/50 bg-background shadow-2xl shadow-red-950/50">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-red-500/30 bg-red-500/15 px-3 py-2">
          <div className="flex items-center gap-2">
            <Siren className="size-5 animate-pulse text-red-500" />
            <div>
              <div className="text-[10px] font-semibold uppercase text-red-300">Overhead page simulation</div>
              <div className="text-sm font-semibold">{incident.overheadPage}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xl font-semibold text-red-300">{incident.countdown}</span>
            <Button size="sm" variant="destructive" onClick={() => onAction(`${incident.protocol} intervention acknowledged`)}>
              Acknowledge
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              Dim
            </Button>
          </div>
        </div>
        <div className="grid gap-3 p-3 lg:grid-cols-[1fr_280px]">
          <EscalationTimeline incident={incident} />
          <div className="grid gap-3">
            <OperationPanel icon={Route} eyebrow="Room routing" title={incident.location} right={<ClinicalBadge label={incident.status} severity="critical" />}>
              <p className="text-xs leading-5 text-muted-foreground">{incident.route}</p>
              <div className="mt-2 grid gap-2">
                {incident.responders.map((responder) => (
                  <div key={`${responder.role}-${responder.name}`} className="flex items-center justify-between border border-border bg-background px-2 py-1.5 text-xs">
                    <span>
                      <span className="font-semibold">{responder.role}</span> · {responder.name}
                    </span>
                    <StatusIndicator label={responder.eta} tone={responder.state === "arrived" ? "online" : "warning"} pulse={responder.state === "enroute"} />
                  </div>
                ))}
              </div>
            </OperationPanel>
            <div className="grid grid-cols-2 gap-2">
              {["Crash cart route", "ABG stat", "Notify family", "ICU bed lock"].map((action) => (
                <Button key={action} size="sm" variant="outline" onClick={() => onAction(action)} className="justify-start">
                  <Ambulance />
                  {action}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmergencyAlertStack({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="fixed bottom-4 left-4 z-30 grid w-[340px] gap-2">
      {emergencyIncidents.map((incident) => (
        <button key={incident.id} type="button" onClick={() => onAction(incident.protocol)} className={cn("border p-2 text-left shadow-xl backdrop-blur", acuityClasses[incident.severity])}>
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-xs font-semibold">
              <RadioTower className="size-4 animate-pulse" />
              {incident.protocol}
            </span>
            <span className="font-mono text-xs">{incident.countdown}</span>
          </div>
          <div className="mt-1 text-[11px] opacity-80">{incident.location} · {incident.status}</div>
        </button>
      ))}
    </div>
  );
}

export function EscalationTimeline({ incident }: { incident: EmergencyIncident }) {
  return (
    <OperationPanel icon={Siren} eyebrow="Escalation chain" title={`${incident.protocol} · ${incident.location}`}>
      <div className="grid gap-0">
        {incident.interventions.map((item) => (
          <div key={`${item.time}-${item.label}`} className="grid grid-cols-[56px_1fr_110px] border-t border-border py-2 text-xs first:border-t-0">
            <span className="font-mono text-muted-foreground">{item.time}</span>
            <span className="font-semibold">{item.label}</span>
            <span className="truncate text-right text-muted-foreground">{item.actor}</span>
          </div>
        ))}
      </div>
    </OperationPanel>
  );
}

export function ClinicalEventStream({ events, onAction }: { events: WorkspaceEvent[]; onAction: (action: string) => void }) {
  const grouped = events.reduce<Record<string, WorkspaceEvent[]>>((acc, event) => {
    const key = event.acuity === "critical" ? "Immediate" : event.acuity === "urgent" ? "Active follow-up" : "Continuity";
    acc[key] = [...(acc[key] ?? []), event];
    return acc;
  }, {});

  return (
    <OperationPanel icon={Activity} eyebrow="Longitudinal clinical stream" title="Realtime patient chronology" right={<StatusIndicator label="streaming" tone="online" pulse />}>
      <div className="grid gap-2">
        {Object.entries(grouped).map(([group, items]) => (
          <div key={group} className="border border-border">
            <div className="flex items-center justify-between bg-muted/40 px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">
              <span>{group}</span>
              <span>{items.length}</span>
            </div>
            {items.map((event) => (
              <button key={event.id} type="button" onClick={() => onAction(event.title)} className="grid w-full grid-cols-[58px_34px_1fr_120px] border-t border-border px-2 py-2 text-left text-xs hover:bg-accent/40">
                <span className="font-mono text-muted-foreground">{event.time}</span>
                <span className={cn("mt-1 size-5 rounded-full border text-center text-[10px] leading-5", acuityClasses[event.acuity])}>{event.source.slice(0, 1)}</span>
                <span>
                  <span className="font-semibold">{event.title}</span>
                  <span className="mt-0.5 block text-[11px] text-muted-foreground">{event.summary}</span>
                  <span className="mt-1 flex gap-1">
                    {["Act", "Route", "Note"].map((chip) => (
                      <span key={chip} className="border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {chip}
                      </span>
                    ))}
                  </span>
                </span>
                <ClinicalBadge label={event.type} severity={severityFor(event.acuity)} />
              </button>
            ))}
          </div>
        ))}
      </div>
    </OperationPanel>
  );
}

export function TelemetryWall({ beds, onAction }: { beds: IcuBed[]; onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2 md:grid-cols-5">
        <TinyMetric label="Ventilated" value={String(beds.filter((bed) => bed.ventilator === "invasive").length)} tone="critical" />
        <TinyMetric label="Pressors" value={String(beds.filter((bed) => bed.infusion !== "None").length)} tone="urgent" />
        <TinyMetric label="MAP < 65" value={String(beds.filter((bed) => bed.map > 0 && bed.map < 65).length)} tone="critical" />
        <TinyMetric label="Alarm fatigue" value="18/hr" tone="urgent" />
        <TinyMetric label="Disconnects" value={String(beds.filter((bed) => bed.alarmState === "disconnect").length)} tone="critical" />
      </div>
      <div className="grid gap-2 xl:grid-cols-2 2xl:grid-cols-3">
        {beds.map((bed) => (
          <button key={bed.id} type="button" onClick={() => onAction(`${bed.bed} bedside telemetry review`)} className={cn("border bg-[#050708] p-2 text-left text-slate-100 hover:border-primary", bed.alarmState === "active" && "animate-pulse", acuityClasses[bed.severity])}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-semibold">{bed.bed}</span>
              <ClinicalBadge label={bed.alarmState ?? "ack"} severity={bed.alarmState === "disconnect" || bed.alarmState === "active" ? "critical" : "info"} />
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <span className="truncate font-semibold">{bed.patientName}</span>
              <span className="font-mono text-[11px] text-slate-400">{bed.nurse}</span>
            </div>
            <EcgStrip bed={bed} />
            <div className="mt-2 grid grid-cols-4 gap-1 text-xs">
              <TinyMetric label="HR" value={String(bed.hr || "--")} tone={(bed.hr ?? 0) > 120 ? "critical" : "routine"} />
              <TinyMetric label="MAP" value={String(bed.map || "--")} tone={bed.map && bed.map < 65 ? "critical" : "routine"} />
              <TinyMetric label="SpO2" value={bed.spo2 ? `${bed.spo2}%` : "--"} tone={bed.spo2 && bed.spo2 < 94 ? "urgent" : "routine"} />
              <TinyMetric label="RR" value={String(bed.rr || "--")} tone={(bed.rr ?? 0) > 26 ? "urgent" : "routine"} />
              <TinyMetric label="Temp" value={bed.temp ? `${bed.temp}` : "--"} tone={(bed.temp ?? 0) > 38 ? "urgent" : "routine"} />
              <TinyMetric label="ICP" value={String(bed.icp || "--")} tone={(bed.icp ?? 0) > 20 ? "critical" : "routine"} />
              <TinyMetric label="O2" value={bed.oxygenFlow ?? "--"} tone={bed.severity === "critical" ? "urgent" : "routine"} />
              <TinyMetric label="Sed" value={bed.sedationScore ?? "--"} tone="watch" />
            </div>
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              <VentilatorPanel bed={bed} />
              <InfusionPumpCard bed={bed} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function VentilatorPanel({ bed }: { bed: IcuBed }) {
  return (
    <div className="border border-slate-700 bg-black/30 p-2 text-[11px]">
      <div className="mb-1 flex items-center justify-between text-slate-400">
        <span className="flex items-center gap-1"><Waves className="size-3" /> Vent</span>
        <span>{bed.ventilator}</span>
      </div>
      <div className="font-mono text-slate-100">{bed.ventilatorMode ?? "--"}</div>
      <div className="mt-1 h-1 bg-slate-800">
        <div className={cn("h-full", bed.ventilator === "invasive" ? "w-3/4 bg-red-400" : "w-1/3 bg-emerald-400")} />
      </div>
    </div>
  );
}

export function InfusionPumpCard({ bed }: { bed: IcuBed }) {
  return (
    <div className="border border-slate-700 bg-black/30 p-2 text-[11px]">
      <div className="mb-1 flex items-center justify-between text-slate-400">
        <span className="flex items-center gap-1"><Syringe className="size-3" /> Pump</span>
        <span>{bed.infusion === "None" ? "idle" : "running"}</span>
      </div>
      <div className="truncate font-mono text-slate-100">{bed.infusion}</div>
      <div className="mt-1 grid grid-cols-8 gap-px">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className={cn("h-1", bed.infusion !== "None" && index < 5 ? "bg-amber-400" : "bg-slate-800")} />
        ))}
      </div>
    </div>
  );
}

export function ORCommandBoard({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2 md:grid-cols-4">
        <TinyMetric label="Rooms active" value="6" tone="watch" />
        <TinyMetric label="PACU queue" value="4 hold" tone="urgent" />
        <TinyMetric label="Blood alerts" value="1" tone="critical" />
        <TinyMetric label="Turnover avg" value="24m" tone="watch" />
      </div>
      <div className="grid gap-2">
        {orCases.map((item) => (
          <button key={item.id} type="button" onClick={() => onAction(`${item.room} ${item.procedure}`)} className={cn("grid grid-cols-[78px_96px_1fr_132px_96px_112px] items-center border px-2 py-2 text-left text-xs hover:bg-accent/40", item.alert ? acuityClasses.urgent : "border-border bg-background")}>
            <span className="font-mono font-semibold">{item.room}</span>
            <ClinicalBadge label={item.status} severity={item.status === "INDUCTION" || item.status === "INCISION" ? "warning" : "info"} />
            <span>
              <span className="font-semibold">{item.procedure}</span>
              <span className="block text-[11px] text-muted-foreground">{item.patient} · {item.surgeon}</span>
            </span>
            <span>{item.anesthetist}</span>
            <span className="font-mono">{item.elapsed}</span>
            <span className={cn("font-mono", item.turnover === "Blocked" || item.turnover === "STAT" ? "text-red-400" : "text-muted-foreground")}>{item.turnover}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function BedFlowMap({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3 2xl:grid-cols-[1fr_300px]">
      <OperationPanel icon={BedDouble} eyebrow="Bed management" title="Patient flow and occupancy control" right={<StatusIndicator label="forecasting" tone="warning" pulse />}>
        <div className="grid gap-2">
          {bedFlowItems.map((item) => (
            <button key={item.id} type="button" onClick={() => onAction(`${item.bed} flow action`)} className={cn("grid grid-cols-[84px_1fr_118px_68px] items-center border px-2 py-2 text-left text-xs hover:bg-accent/40", acuityClasses[item.pressure])}>
              <span className="font-mono font-semibold">{item.bed}</span>
              <span>
                <span className="font-semibold">{item.patient}</span>
                <span className="block text-[11px] opacity-80">{item.unit} · {item.blocker}</span>
              </span>
              <ClinicalBadge label={item.state} severity={severityFor(item.pressure)} />
              <span className="font-mono text-right">{item.eta}</span>
            </button>
          ))}
        </div>
      </OperationPanel>
      <TransportQueue onAction={onAction} />
    </div>
  );
}

export function PharmacyQueue({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3">
      <AlertBanner title="Medication safety operations" detail="STAT dispense, high-risk verification, IV room, and pharmacist intervention queues are simulated locally." severity="warning" />
      <div className="grid gap-2">
        {pharmacyQueueItems.map((item) => (
          <button key={item.id} type="button" onClick={() => onAction(`${item.medication} pharmacy review`)} className={cn("grid grid-cols-[112px_1fr_132px_90px_72px] items-center border px-2 py-2 text-left text-xs hover:bg-accent/40", acuityClasses[item.risk])}>
            <ClinicalBadge label={item.status} severity={severityFor(item.risk)} />
            <span>
              <span className="font-semibold">{item.medication}</span>
              <span className="block text-[11px] opacity-80">{item.safety}</span>
            </span>
            <span>{item.queue}</span>
            <span className="font-mono">{item.eta}</span>
            <Pill className="size-4 justify-self-end" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function NursingHandoffPanel({ patient, onAction }: { patient: WorkspacePatient; onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2 md:grid-cols-3">
        {["06:18 to shift change", "2 float nurses needed", "7 unresolved meds"].map((value, index) => (
          <TinyMetric key={value} label={["Shift countdown", "Staffing pressure", "Pending MAR"][index]} value={value} tone={index === 1 ? "urgent" : "watch"} />
        ))}
      </div>
      <div className="grid gap-3 2xl:grid-cols-[1fr_300px]">
        <OperationPanel icon={ClipboardCheck} eyebrow="Nursing continuity" title={`Bedside handoff · ${patient.ward}`}>
          <div className="grid gap-2">
            {nursingAssignments.map((assignment) => (
              <button key={assignment.id} type="button" onClick={() => onAction(`${assignment.nurse} handoff`)} className={cn("border px-2 py-2 text-left text-xs hover:bg-accent/40", acuityClasses[assignment.pressure])}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{assignment.nurse}</span>
                  <span className="font-mono">{assignment.load}</span>
                </div>
                <div className="mt-1 text-[11px] opacity-80">{assignment.unit} · {assignment.outgoingSummary}</div>
                <div className="mt-2 grid gap-1">
                  {assignment.tasks.map((task) => (
                    <span key={task} className="border border-border bg-background px-2 py-1 text-[11px]">
                      {task}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </OperationPanel>
        <OperationPanel icon={UsersRound} eyebrow="Incoming acknowledgement" title="Unresolved shift risk">
          <div className="grid gap-2">
            {nursingAssignments.map((assignment) => (
              <div key={`${assignment.id}-ack`} className={cn("border p-2 text-xs", acuityClasses[assignment.pressure])}>
                <div className="font-semibold">{assignment.incomingAck}</div>
                <div className="mt-1 text-[11px] opacity-80">{assignment.unit} · burnout index {assignment.pressure === "critical" ? "82%" : assignment.pressure === "urgent" ? "68%" : "43%"}</div>
              </div>
            ))}
          </div>
        </OperationPanel>
      </div>
    </div>
  );
}

export function SOAPWorkspace({ patient, onAction }: { patient: WorkspacePatient; onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3 2xl:grid-cols-[1fr_300px]">
      <OperationPanel icon={FilePenLine} eyebrow="Physician documentation" title={`SOAP note · ${patient.encounter}`} right={<StatusIndicator label="autosaved 00:12" tone="online" pulse />}>
        <div className="grid gap-2">
          {[
            ["Subjective", "Fever, respiratory distress, family reports reduced intake overnight."],
            ["Objective", `Vitals: T ${patient.vitals.temp}, HR ${patient.vitals.pulse}, BP ${patient.vitals.bp}, SpO2 ${patient.vitals.spo2}.`],
            ["Assessment", `${patient.status}. Differential and risk flags remain active.`],
            ["Plan", "Continue protocolized care, reconcile medications, repeat investigations, reassess escalation criteria."],
          ].map(([label, value]) => (
            <label key={label} className="grid gap-1 text-xs">
              <span className="font-semibold uppercase text-muted-foreground">{label}</span>
              <textarea className="min-h-20 resize-y border border-border bg-background p-2 outline-none focus:border-primary" defaultValue={value} />
            </label>
          ))}
        </div>
      </OperationPanel>
      <OperationPanel icon={Brain} eyebrow="Smart charting" title="Macros and coding">
        <div className="grid gap-2">
          {clinicalDocSnippets.map((snippet) => (
            <button key={snippet.id} type="button" onClick={() => onAction(snippet.label)} className="border border-border bg-background p-2 text-left text-xs hover:border-primary">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold">{snippet.label}</span>
                <span className="font-mono text-primary">{snippet.shortcut}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{snippet.content}</p>
            </button>
          ))}
          <div className="border border-primary/30 bg-primary/10 p-2 text-xs">
            <div className="font-semibold">AI-assist placeholder</div>
            <p className="mt-1 text-muted-foreground">Predicts ICD-ready tags, note gaps, and smart phrase insertions without external AI calls.</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {["A41.9", "R65.21", "J18.9", "I25.10"].map((code) => (
              <span key={code} className="border border-border px-2 py-1 font-mono text-[11px]">{code}</span>
            ))}
          </div>
        </div>
      </OperationPanel>
    </div>
  );
}

export function HospitalCommandCenter({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3">
      <DisasterModeOverlay />
      <div className="grid gap-2 md:grid-cols-4">
        {hospitalMetrics.slice(0, 4).map((metric) => (
          <TinyMetric key={metric.id} label={metric.label} value={metric.value} tone={metric.tone} />
        ))}
      </div>
      <div className="grid gap-3 2xl:grid-cols-[1fr_320px]">
        <OperationPanel icon={Hospital} eyebrow="Mission control" title="Hospital-wide operational heatmap" right={<StatusIndicator label="regional watch" tone="warning" pulse />}>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 84 }).map((_, index) => {
              const tone: Acuity = index % 19 === 0 ? "critical" : index % 11 === 0 ? "urgent" : index % 7 === 0 ? "watch" : "routine";
              return <button key={index} type="button" onClick={() => onAction(`Open bed sector ${index + 1}`)} className={cn("h-7 border text-[9px] hover:border-primary", acuityClasses[tone])}>{index + 1}</button>;
            })}
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-3">
            <CriticalLabFeed onAction={onAction} />
            <TransportQueue onAction={onAction} />
            <StaffingPressureMap />
          </div>
        </OperationPanel>
        <OperationPanel icon={ShieldAlert} eyebrow="Infrastructure warnings" title="Surge readiness">
          <div className="grid gap-2">
            {["ED boarding approaching red threshold", "Oxygen manifold B maintenance warning", "PACU queue is holding OR turnover", "Regional incident mode standby"].map((item, index) => (
              <div key={item} className={cn("border p-2 text-xs", index === 0 ? acuityClasses.critical : index === 1 ? acuityClasses.urgent : acuityClasses.watch)}>
                {item}
              </div>
            ))}
          </div>
        </OperationPanel>
      </div>
    </div>
  );
}

export function DisasterModeOverlay() {
  return (
    <div className="border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 font-semibold"><ShieldAlert className="size-4" /> Disaster surge simulation standby</span>
        <span className="font-mono text-amber-300">REGIONAL INCIDENT MODE · PANDEMIC LOAD READY · INFRA WATCH</span>
      </div>
    </div>
  );
}

export function StaffingPressureMap() {
  return (
    <OperationPanel icon={UsersRound} eyebrow="Staffing" title="Assignment pressure">
      <div className="grid gap-1">
        {staffingZones.map((zone) => (
          <div key={zone.id} className={cn("border px-2 py-1.5 text-xs", acuityClasses[zone.pressure])}>
            <div className="flex items-center justify-between">
              <span className="font-semibold">{zone.unit}</span>
              <span className="font-mono">{zone.assigned}/{zone.required}</span>
            </div>
            <div className="mt-1 text-[11px] opacity-80">{zone.acuityLoad}</div>
          </div>
        ))}
      </div>
    </OperationPanel>
  );
}

export function CriticalLabFeed({ onAction }: { onAction: (action: string) => void }) {
  const labs = [
    ["p-001", "Lactate 4.2", "repeat due 04m", "critical"],
    ["p-004", "Platelets 72k", "peds review", "urgent"],
    ["p-003", "CRP rising", "ward watch", "watch"],
  ] as const;

  return (
    <OperationPanel icon={Droplets} eyebrow="Critical labs" title="Result feed">
      {labs.map(([id, label, detail, tone]) => (
        <button key={`${id}-${label}`} type="button" onClick={() => onAction(label)} className={cn("mb-1 w-full border px-2 py-1.5 text-left text-xs last:mb-0", acuityClasses[tone])}>
          <div className="font-semibold">{label}</div>
          <div className="text-[11px] opacity-80">{id} · {detail}</div>
        </button>
      ))}
    </OperationPanel>
  );
}

export function TransportQueue({ onAction }: { onAction: (action: string) => void }) {
  const rows = [
    ["ED -> CT", "Stroke route", "04m", "urgent"],
    ["Ward A -> ICU", "Sepsis transfer", "11m", "critical"],
    ["OBG -> Discharge", "Wheelchair", "28m", "routine"],
  ] as const;

  return (
    <OperationPanel icon={Route} eyebrow="Transport" title="Movement queue">
      {rows.map(([route, label, eta, tone]) => (
        <button key={`${route}-${label}`} type="button" onClick={() => onAction(label)} className={cn("mb-1 grid w-full grid-cols-[1fr_42px] border px-2 py-1.5 text-left text-xs last:mb-0", acuityClasses[tone])}>
          <span>
            <span className="font-semibold">{route}</span>
            <span className="block text-[11px] opacity-80">{label}</span>
          </span>
          <span className="font-mono">{eta}</span>
        </button>
      ))}
    </OperationPanel>
  );
}

function EcgStrip({ bed }: { bed: IcuBed }) {
  const color = bed.severity === "critical" ? "#ef4444" : bed.severity === "urgent" ? "#f59e0b" : "#2dd4bf";
  const points =
    bed.alarmState === "disconnect"
      ? "0,24 18,24 19,24 20,24 50,24 51,24 52,24 96,24"
      : bed.severity === "critical"
        ? "0,24 8,24 12,7 16,38 21,18 28,24 39,24 44,8 49,39 55,20 66,24 74,24 80,10 86,34 96,24"
        : "0,24 14,24 20,14 25,30 31,22 42,24 58,24 64,16 69,29 75,23 96,24";

  return (
    <div className="mt-2 border border-slate-700 bg-black/40 px-2 py-1">
      <div className="mb-1 flex justify-between font-mono text-[10px] text-slate-400">
        <span>ECG · {bed.rhythm}</span>
        <span>{bed.alarmState?.toUpperCase()}</span>
      </div>
      <svg viewBox="0 0 96 44" className="h-14 w-full overflow-visible">
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={bed.severity === "critical" ? "animate-pulse" : ""} />
        {Array.from({ length: 8 }).map((_, index) => (
          <line key={index} x1={index * 12} y1="0" x2={index * 12} y2="44" stroke="currentColor" strokeOpacity="0.08" />
        ))}
      </svg>
    </div>
  );
}

function TinyMetric({ label, value, tone = "routine" }: { label: string; value: string; tone?: Acuity }) {
  return (
    <div className={cn("border px-2 py-1.5", acuityClasses[tone])}>
      <div className="text-[10px] font-semibold uppercase opacity-70">{label}</div>
      <div className="mt-0.5 truncate font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

function OperationPanel({
  icon: Icon,
  eyebrow,
  title,
  right,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border bg-background">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-primary" />
          <div>
            <div className="text-[10px] font-semibold uppercase text-muted-foreground">{eyebrow}</div>
            <div className="text-sm font-semibold">{title}</div>
          </div>
        </div>
        {right}
      </div>
      <div className="p-3">{children}</div>
    </section>
  );
}
