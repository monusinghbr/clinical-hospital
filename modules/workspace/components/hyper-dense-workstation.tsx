"use client";

import {
  Activity,
  BellRing,
  BedDouble,
  BrainCircuit,
  ClipboardCheck,
  FlaskConical,
  MessageSquareWarning,
  Microscope,
  MonitorDot,
  Route,
  ShieldAlert,
  Siren,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import type React from "react";

import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  bedFlowItems,
  departmentSignals,
  orCases,
  staffingZones,
  systemTrace,
  workstationWindows,
} from "@/modules/workspace/data/seeded-workspace";
import type { Acuity, IcuBed, WorkspaceEvent, WorkspacePatient } from "@/modules/workspace/types/workspace";

const acuityClasses: Record<Acuity, string> = {
  routine: "border-border bg-background text-muted-foreground",
  watch: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  urgent: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  critical: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

const severityFor = (tone: Acuity) => (tone === "critical" ? "critical" : tone === "urgent" ? "warning" : tone === "watch" ? "info" : "success");

export function MultiPatientTelemetryWall({ beds, patients, onAction }: { beds: IcuBed[]; patients: WorkspacePatient[]; onAction: (action: string) => void }) {
  const tiles = Array.from({ length: 18 }).map((_, index) => {
    const bed = beds[index % beds.length];
    const patient = patients[index % patients.length];
    const unstable = index % 7 === 0 || bed.severity === "critical";
    const disconnect = index % 11 === 0 || bed.alarmState === "disconnect";
    return {
      id: `${bed.id}-${index}`,
      zone: index < 6 ? "ICU-A" : index < 12 ? "ICU-B" : "Telemetry overflow",
      bed: index < beds.length ? bed.bed : `${index < 12 ? "ICU" : "MON"}-${String(index + 1).padStart(2, "0")}`,
      patient: index < beds.length ? bed.patientName : patient.name,
      nurse: index < beds.length ? bed.nurse : ["Nurse Asha", "Nurse Priya", "Nurse Robin", "Nurse Preeti"][index % 4],
      severity: unstable ? "critical" : index % 5 === 0 ? "urgent" : index % 3 === 0 ? "watch" : "routine",
      hr: Math.max(58, (bed.hr || Number(patient.vitals.pulse)) + (index % 4) * 3),
      spo2: Math.max(87, (bed.spo2 || Number(patient.vitals.spo2)) - (unstable ? 2 : 0)),
      rr: Math.max(12, (bed.rr || Number(patient.vitals.rr)) + (unstable ? 3 : 0)),
      map: Math.max(54, (bed.map || 76) - (unstable ? 4 : 0)),
      temp: bed.temp || Number(patient.vitals.temp),
      rhythm: unstable ? (index % 2 ? "VT WATCH" : "AF RVR") : bed.rhythm || "NSR",
      vent: bed.ventilatorMode || (index % 4 === 0 ? "NIV PSV" : "Room air"),
      signal: disconnect ? "DISCONNECT" : unstable ? "NOISY" : index % 4 === 0 ? "FAIR" : "GOOD",
      ack: unstable ? `${index + 1}m` : "ACK",
    };
  }).sort((a, b) => (a.severity === "critical" ? -1 : b.severity === "critical" ? 1 : 0));

  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-6 gap-1">
        <CompactCounter label="Beds" value="18" tone="watch" />
        <CompactCounter label="Critical" value={String(tiles.filter((tile) => tile.severity === "critical").length)} tone="critical" />
        <CompactCounter label="Unacked" value="7" tone="urgent" />
        <CompactCounter label="Disconnect" value={String(tiles.filter((tile) => tile.signal === "DISCONNECT").length)} tone="critical" />
        <CompactCounter label="Vent" value="5" tone="urgent" />
        <CompactCounter label="Storm" value="ON" tone="critical" />
      </div>
      <div className="grid gap-1 xl:grid-cols-3 2xl:grid-cols-6">
        {tiles.map((tile) => (
          <button key={tile.id} type="button" onClick={() => onAction(`${tile.bed} telemetry tile`)} className={cn("border bg-[#030607] p-1.5 text-left text-slate-100 hover:border-primary", tile.severity === "critical" && "animate-pulse", acuityClasses[tile.severity as Acuity])}>
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[11px] font-semibold">{tile.zone} · {tile.bed}</span>
              <span className={cn("font-mono text-[10px]", tile.signal === "DISCONNECT" ? "text-red-300" : "text-emerald-300")}>{tile.signal}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-1">
              <span className="truncate text-xs font-semibold">{tile.patient}</span>
              <span className="font-mono text-[10px] text-slate-400">{tile.ack}</span>
            </div>
            <WaveformMonitor rhythm={tile.rhythm} severity={tile.severity as Acuity} degraded={tile.signal !== "GOOD"} compact />
            <div className="mt-1 grid grid-cols-5 gap-px font-mono text-[10px]">
              <TelemetryValue label="HR" value={String(tile.hr)} tone={tile.hr > 125 ? "critical" : "routine"} />
              <TelemetryValue label="SpO2" value={String(tile.spo2)} tone={tile.spo2 < 93 ? "critical" : "routine"} />
              <TelemetryValue label="RR" value={String(tile.rr)} tone={tile.rr > 26 ? "urgent" : "routine"} />
              <TelemetryValue label="MAP" value={String(tile.map)} tone={tile.map < 65 ? "critical" : "routine"} />
              <TelemetryValue label="T" value={String(tile.temp)} tone={tile.temp > 38 ? "urgent" : "routine"} />
            </div>
            <div className="mt-1 grid grid-cols-[1fr_1fr] gap-1 text-[10px] text-slate-400">
              <span className="truncate">{tile.rhythm}</span>
              <span className="truncate text-right">{tile.vent}</span>
              <span className="truncate">{tile.nurse}</span>
              <span className="text-right">ACK {tile.ack}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function WaveformMonitor({ rhythm, severity, degraded = false, compact = false }: { rhythm: string; severity: Acuity; degraded?: boolean; compact?: boolean }) {
  const color = severity === "critical" ? "#f87171" : severity === "urgent" ? "#fbbf24" : "#34d399";
  const paths = degraded
    ? ["0,22 8,23 14,20 20,26 26,16 30,34 36,22 52,24 56,8 62,36 70,22 84,23 96,22", "0,30 10,26 18,31 28,28 39,34 48,26 60,31 76,29 88,35 96,30"]
    : ["0,24 12,24 18,8 23,38 29,20 38,24 54,24 60,12 66,34 73,22 96,24", "0,30 12,28 24,30 36,26 48,30 60,28 72,30 84,27 96,30"];

  return (
    <svg viewBox="0 0 96 42" className={cn("w-full bg-black/40", compact ? "h-10" : "h-16")}>
      {Array.from({ length: 9 }).map((_, index) => (
        <line key={index} x1={index * 12} y1="0" x2={index * 12} y2="42" stroke="currentColor" strokeOpacity="0.07" />
      ))}
      {paths.map((points, index) => (
        <polyline key={points} points={points} fill="none" stroke={index === 0 ? color : "#38bdf8"} strokeOpacity={index === 0 ? 1 : 0.58} strokeWidth={index === 0 ? 1.8 : 1.1} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="130" strokeDashoffset="0">
          <animate attributeName="stroke-dashoffset" values="130;0;130" dur={severity === "critical" ? "1.2s" : "2.2s"} repeatCount="indefinite" />
        </polyline>
      ))}
      <text x="2" y="9" fill="currentColor" opacity="0.5" fontSize="6">{rhythm}</text>
    </svg>
  );
}

export function IncidentCommandOverlay({ active, onAction }: { active: boolean; onAction: (action: string) => void }) {
  if (!active) return null;

  return (
    <div className="border border-red-500/40 bg-red-950/20 p-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-red-200"><Siren className="size-4 animate-pulse" /> HOSPITAL INCIDENT COMMAND · MCI STANDBY</span>
        <div className="flex gap-1">
          {["Trauma surge", "Pandemic load", "O2 shortage", "Network degrade"].map((item) => (
            <Button key={item} size="sm" variant="destructive" onClick={() => onAction(item)}>{item}</Button>
          ))}
        </div>
      </div>
      <div className="mt-2 grid gap-1 md:grid-cols-4">
        {["Ambulance ETA 06m", "Surge beds +18", "Power UPS 71%", "Regional feed active"].map((item, index) => (
          <div key={item} className={cn("border px-2 py-1 font-mono text-[11px]", index < 2 ? acuityClasses.critical : acuityClasses.urgent)}>{item}</div>
        ))}
      </div>
    </div>
  );
}

export function EscalationEngine({ events, onAction }: { events: WorkspaceEvent[]; onAction: (action: string) => void }) {
  const alertRows = [
    ["CRITICAL", "MAP breach + lactate panic", "Intensivist -> Charge nurse -> Pharmacy", "UNACK 02m", "critical"],
    ["VENT FAILURE", "ICU-4B disconnect / VT watch", "RT -> Biomedical -> ICU", "ACTIVE", "critical"],
    ["MED OVERRIDE", "Penicillin allergy route", "Pharmacy -> Physician", "DUP suppressed", "urgent"],
    ["FALL RISK", "Ward A nighttime task", "Nurse station", "ACK", "watch"],
    ...events.slice(0, 2).map((event) => [event.type.toUpperCase(), event.title, event.source, event.time, event.acuity] as const),
  ] as const;

  return (
    <WorkstationPanel icon={BellRing} eyebrow="Smart clinical alert engine" title="Cascading escalation routes">
      <div className="grid gap-1">
        {alertRows.map(([type, label, route, state, tone]) => (
          <button key={`${type}-${label}`} type="button" onClick={() => onAction(`${type} alert route`)} className={cn("grid grid-cols-[112px_1fr_220px_86px] items-center border px-2 py-1.5 text-left text-xs hover:bg-accent/40", acuityClasses[tone as Acuity])}>
            <span className="font-mono font-semibold">{type}</span>
            <span className="truncate font-semibold">{label}</span>
            <span className="truncate text-[11px] opacity-80">{route}</span>
            <span className="font-mono text-right">{state}</span>
          </button>
        ))}
      </div>
    </WorkstationPanel>
  );
}

export function ClinicalTaskOrchestrator({ onAction }: { onAction: (action: string) => void }) {
  const tasks = [
    ["STAT", "Antibiotic delivery", "Pharmacy -> ICU-2A", "02m", "critical"],
    ["ESCALATED", "Transport ED sepsis transfer", "Porter + ICU accept", "11m", "critical"],
    ["BLOCKED", "PACU bed release", "Recovery hold", "19m", "urgent"],
    ["DELAYED", "EVS isolation clean", "PED-09", "28m", "urgent"],
    ["IN_PROGRESS", "Repeat lactate specimen", "Lab runner", "04m", "watch"],
    ["QUEUED", "Discharge medication reconciliation", "Pharmacy", "45m", "routine"],
  ] as const;

  return (
    <WorkstationPanel icon={ClipboardCheck} eyebrow="Enterprise task orchestration" title="Cross-department work routing">
      <div className="grid gap-1">
        {tasks.map(([status, task, owner, eta, tone]) => (
          <button key={task} type="button" onClick={() => onAction(task)} className={cn("grid grid-cols-[96px_1fr_170px_54px] border px-2 py-1.5 text-left text-xs hover:bg-accent/40", acuityClasses[tone])}>
            <span className="font-mono font-semibold">{status}</span>
            <span className="font-semibold">{task}</span>
            <span className="text-[11px] opacity-80">{owner}</span>
            <span className="font-mono text-right">{eta}</span>
          </button>
        ))}
      </div>
    </WorkstationPanel>
  );
}

export function LongitudinalPatientChart({ patient, events, onAction }: { patient: WorkspacePatient; events: WorkspaceEvent[]; onAction: (action: string) => void }) {
  return (
    <div className="grid gap-2 2xl:grid-cols-[1fr_260px]">
      <WorkstationPanel icon={Stethoscope} eyebrow="Enterprise chart" title={`${patient.name} · longitudinal record`}>
        <div className="grid gap-1">
          {["Problem list", "Allergies", "Medication reconciliation", "Care team", "Multidisciplinary notes"].map((section, index) => (
            <details key={section} open={index < 3} className="border border-border bg-background">
              <summary className="cursor-pointer px-2 py-1 text-xs font-semibold">{section}</summary>
              <div className="border-t border-border px-2 py-1.5 text-[11px] text-muted-foreground">
                {index === 0 ? patient.status : index === 1 ? patient.allergies.join(", ") || "No known allergies" : `${events[index % Math.max(1, events.length)]?.summary ?? patient.lastEvent}`}
              </div>
            </details>
          ))}
        </div>
        <div className="mt-2 border border-border">
          {events.map((event) => (
            <button key={event.id} type="button" onClick={() => onAction(event.title)} className="grid w-full grid-cols-[56px_96px_1fr] border-t border-border px-2 py-1.5 text-left text-xs first:border-t-0 hover:bg-accent/40">
              <span className="font-mono text-muted-foreground">{event.time}</span>
              <ClinicalBadge label={event.type} severity={severityFor(event.acuity)} />
              <span className="truncate">{event.title}</span>
            </button>
          ))}
        </div>
      </WorkstationPanel>
      <AIAssistRail patient={patient} onAction={onAction} />
    </div>
  );
}

export function PhysicianRoundsPanel({ patients, onPatient, onAction }: { patients: WorkspacePatient[]; onPatient: (patientId: string) => void; onAction: (action: string) => void }) {
  return (
    <WorkstationPanel icon={UsersRound} eyebrow="Physician rounds mode" title="Rounding list and discharge barriers">
      <div className="grid gap-1">
        {patients.map((patient, index) => (
          <button key={patient.id} type="button" onClick={() => onPatient(patient.id)} className={cn("grid grid-cols-[42px_1fr_120px_90px] items-center border px-2 py-1.5 text-left text-xs hover:bg-accent/40", acuityClasses[patient.acuity])}>
            <span className="font-mono">{index + 1}/5</span>
            <span>
              <span className="font-semibold">{patient.name}</span>
              <span className="block text-[11px] opacity-80">{patient.bed} · overnight: {patient.lastEvent}</span>
            </span>
            <span>{patient.pendingTasks} unresolved</span>
            <Button size="sm" variant="outline" onClick={(event) => { event.stopPropagation(); onAction(`Round ${patient.name}`); }}>Round</Button>
          </button>
        ))}
      </div>
    </WorkstationPanel>
  );
}

export function AIAssistRail({ patient, onAction }: { patient: WorkspacePatient; onAction: (action: string) => void }) {
  const suggestions = [
    ["Deterioration prediction", patient.acuity === "critical" ? "87%" : "42%", "MAP, HR, lactate, oxygen trend explain this risk.", "critical"],
    ["Discharge readiness", patient.pendingTasks > 3 ? "18%" : "64%", "Pending tasks and medication reconciliation reduce readiness.", "watch"],
    ["Smart order suggestion", "Sepsis bundle", "Repeat lactate, ABG, cultures, antibiotic timing.", "urgent"],
  ] as const;

  return (
    <WorkstationPanel icon={BrainCircuit} eyebrow="AI assist simulation" title="Predictive clinical layer">
      <div className="grid gap-2">
        {suggestions.map(([label, score, explanation, tone]) => (
          <button key={label} type="button" onClick={() => onAction(label)} className={cn("border p-2 text-left text-xs hover:bg-accent/40", acuityClasses[tone])}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{label}</span>
              <span className="font-mono">{score}</span>
            </div>
            <p className="mt-1 text-[11px] opacity-80">{explanation}</p>
          </button>
        ))}
      </div>
    </WorkstationPanel>
  );
}

export function LabCommandCenter({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="grid gap-2 2xl:grid-cols-[1fr_320px]">
      <WorkstationPanel icon={Microscope} eyebrow="Pathology command center" title="Specimen lifecycle and analyzer load">
        <div className="grid gap-1">
          {["Collected", "In transit", "Centrifuge", "Analyzer", "Delta check", "Critical call"].map((stage, index) => (
            <button key={stage} type="button" onClick={() => onAction(`Lab ${stage}`)} className={cn("grid grid-cols-[120px_1fr_80px_70px] border px-2 py-1.5 text-left text-xs", acuityClasses[index > 3 ? "critical" : index > 1 ? "urgent" : "watch"])}>
              <span className="font-semibold">{stage}</span>
              <span>{["CBC pediatric", "Lactate repeat", "Troponin serial", "Blood culture", "CRP trend", "K+ panic call"][index]}</span>
              <span className="font-mono">{[12, 7, 4, 18, 3, 1][index]} samples</span>
              <span className="font-mono text-right">{["08m", "04m", "19m", "31m", "06m", "NOW"][index]}</span>
            </button>
          ))}
        </div>
      </WorkstationPanel>
      <AnalyzerQueueMap />
    </div>
  );
}

export function SurgicalFlowBoard({ onAction }: { onAction: (action: string) => void }) {
  return (
    <WorkstationPanel icon={Activity} eyebrow="Surgical operations control" title="Delay propagation and downstream effects">
      <div className="grid gap-1">
        {orCases.map((item, index) => (
          <button key={item.id} type="button" onClick={() => onAction(`${item.room} surgical flow`)} className={cn("grid grid-cols-[70px_92px_1fr_120px_100px_100px] border px-2 py-1.5 text-left text-xs hover:bg-accent/40", acuityClasses[item.alert ? "urgent" : index % 3 === 0 ? "watch" : "routine"])}>
            <span className="font-mono font-semibold">{item.room}</span>
            <ClinicalBadge label={item.status} severity={item.alert ? "warning" : "info"} />
            <span className="truncate font-semibold">{item.procedure}</span>
            <span>{index % 2 ? "Robot standby" : "Implant tracked"}</span>
            <span>{index % 3 ? "Blood xmatch" : "No blood"}</span>
            <span className="font-mono text-right">{item.turnover}</span>
          </button>
        ))}
      </div>
    </WorkstationPanel>
  );
}

export function ClinicalMessagingFeed({ onAction }: { onAction: (action: string) => void }) {
  const messages = [
    ["Rapid-response", "@ICU team RT ETA 01:12. Pharmacy enroute.", "read 3/5", "critical"],
    ["Consult", "@Neuro stroke protocol CT-1 ready.", "read 2/4", "urgent"],
    ["Broadcast", "ED boarding redline, discharge lounge activation requested.", "sent", "critical"],
    ["Pharmacy", "Override review pending physician confirmation.", "read 1/2", "urgent"],
  ] as const;

  return (
    <WorkstationPanel icon={MessageSquareWarning} eyebrow="Clinical communication layer" title="Secure messages and broadcasts">
      <div className="grid gap-1">
        {messages.map(([channel, message, receipt, tone]) => (
          <button key={message} type="button" onClick={() => onAction(`${channel} message`)} className={cn("border px-2 py-1.5 text-left text-xs hover:bg-accent/40", acuityClasses[tone])}>
            <div className="flex justify-between gap-2">
              <span className="font-semibold">{channel}</span>
              <span className="font-mono opacity-70">{receipt}</span>
            </div>
            <div className="mt-1 text-[11px] opacity-80">{message}</div>
          </button>
        ))}
      </div>
    </WorkstationPanel>
  );
}

export function TelemetryDock({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="fixed inset-x-4 bottom-3 z-20 grid pointer-events-none gap-1 lg:grid-cols-4">
      {workstationWindows.map((item) => (
        <button key={item.id} type="button" onClick={() => onAction(item.title)} className={cn("pointer-events-auto border bg-background/95 p-2 text-left shadow-2xl backdrop-blur hover:border-primary", acuityClasses[item.pressure])}>
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-[11px] font-semibold">{item.title}</span>
            <span className="font-mono text-[10px]">{item.status}</span>
          </div>
          <div className="mt-1 grid gap-0.5">
            {item.lines.map((line) => (
              <span key={line} className="truncate text-[10px] opacity-80">{line}</span>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
}

export function StaffingCrisisPanel() {
  return (
    <WorkstationPanel icon={UsersRound} eyebrow="Staffing crisis" title="Load balancing and strain">
      {staffingZones.map((zone) => (
        <div key={zone.id} className={cn("mb-1 grid grid-cols-[1fr_64px_70px] border px-2 py-1.5 text-xs last:mb-0", acuityClasses[zone.pressure])}>
          <span className="font-semibold">{zone.unit}</span>
          <span className="font-mono">{zone.assigned}/{zone.required}</span>
          <span className="font-mono text-right">{Math.round((zone.assigned / zone.required) * 100)}%</span>
        </div>
      ))}
    </WorkstationPanel>
  );
}

export function DisasterSurgeOverlay() {
  return (
    <div className="border border-red-500/40 bg-red-500/10 p-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-2 font-semibold text-red-300"><ShieldAlert className="size-4 animate-pulse" /> MCI / TRAUMA SURGE / PANDEMIC LOAD SIMULATION</span>
        <span className="font-mono">SURGE CAP +18 · O2 71% · NET DEGRADED · ED RED</span>
      </div>
    </div>
  );
}

export function AnalyzerQueueMap() {
  return (
    <WorkstationPanel icon={FlaskConical} eyebrow="Analyzer queue map" title="Bottlenecks">
      {["Hematology XN-1", "Chemistry AU-2", "Blood gas ICU", "Blood bank crossmatch", "Micro incubator"].map((name, index) => (
        <div key={name} className={cn("mb-1 border px-2 py-1.5 text-xs last:mb-0", acuityClasses[index === 2 ? "critical" : index % 2 ? "urgent" : "watch"])}>
          <div className="flex justify-between gap-2">
            <span className="font-semibold">{name}</span>
            <span className="font-mono">{[91, 78, 96, 64, 48][index]}%</span>
          </div>
          <div className="mt-1 h-1 bg-muted">
            <div className={cn("h-full", index === 2 ? "bg-red-400" : index % 2 ? "bg-amber-400" : "bg-sky-400")} style={{ width: `${[91, 78, 96, 64, 48][index]}%` }} />
          </div>
        </div>
      ))}
    </WorkstationPanel>
  );
}

export function BedPressureForecast() {
  return (
    <WorkstationPanel icon={BedDouble} eyebrow="Bed pressure forecast" title="Next 90 minutes">
      {bedFlowItems.map((item) => (
        <div key={item.id} className={cn("mb-1 grid grid-cols-[72px_1fr_44px] border px-2 py-1.5 text-xs last:mb-0", acuityClasses[item.pressure])}>
          <span className="font-mono">{item.bed}</span>
          <span className="truncate">{item.state} · {item.blocker}</span>
          <span className="font-mono text-right">{item.eta}</span>
        </div>
      ))}
    </WorkstationPanel>
  );
}

export function AlarmFatigueMeter() {
  return (
    <WorkstationPanel icon={MonitorDot} eyebrow="Alarm fatigue meter" title="Suppression and duplicate burden">
      <div className="grid grid-cols-4 gap-1">
        {["18/hr", "7 dup", "4 unack", "2 routed"].map((value, index) => (
          <CompactCounter key={value} label={["Rate", "Supp", "Unack", "Route"][index]} value={value} tone={index === 2 ? "critical" : "urgent"} />
        ))}
      </div>
      <div className="mt-2 grid gap-1">
        {systemTrace.map((trace) => (
          <div key={trace.id} className={cn("grid grid-cols-[62px_74px_1fr] border px-2 py-1 text-[11px]", acuityClasses[trace.pressure])}>
            <span className="font-mono">{trace.time}</span>
            <span className="font-semibold">{trace.source}</span>
            <span className="truncate">{trace.message}</span>
          </div>
        ))}
      </div>
    </WorkstationPanel>
  );
}

export function DepartmentSignalMatrix({ onAction }: { onAction: (action: string) => void }) {
  return (
    <WorkstationPanel icon={Route} eyebrow="Cross-department coordination" title="Signal matrix">
      <div className="grid gap-1 md:grid-cols-2">
        {departmentSignals.map((signal) => (
          <button key={signal.id} type="button" onClick={() => onAction(signal.signal)} className={cn("grid grid-cols-[66px_1fr_56px] border px-2 py-1.5 text-left text-xs hover:bg-accent/40", acuityClasses[signal.pressure])}>
            <span className="font-mono font-semibold">{signal.unit}</span>
            <span className="truncate">
              <span className="font-semibold">{signal.signal}</span>
              <span className="block text-[10px] opacity-80">{signal.queue} · {signal.owner}</span>
            </span>
            <span className="font-mono text-right">{signal.sla}</span>
          </button>
        ))}
      </div>
    </WorkstationPanel>
  );
}

export function WorkstationStatusTape({ events, onAction }: { events: WorkspaceEvent[]; onAction: (action: string) => void }) {
  const items = [
    "MCI: standby",
    "ICU overflow: +2",
    "ED boarders: 5 high-acuity",
    "OR delay: PACU hold",
    "Pharmacy STAT: 2",
    "Lab panic: K+ route",
    ...events.slice(0, 4).map((event) => `${event.type}: ${event.title}`),
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-black/90 text-slate-100">
      <div className="flex overflow-hidden whitespace-nowrap font-mono text-[11px]">
        {items.map((item, index) => (
          <button key={`${item}-${index}`} type="button" onClick={() => onAction(item)} className={cn("border-r border-slate-800 px-3 py-1.5 hover:bg-slate-800", index % 3 === 0 ? "text-red-300" : index % 3 === 1 ? "text-amber-300" : "text-emerald-300")}>
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function TelemetryValue({ label, value, tone }: { label: string; value: string; tone: Acuity }) {
  return (
    <span className={cn("border border-slate-800 px-1 py-0.5", tone === "critical" ? "text-red-300" : tone === "urgent" ? "text-amber-300" : "text-slate-200")}>
      <span className="opacity-50">{label}</span> {value}
    </span>
  );
}

function CompactCounter({ label, value, tone }: { label: string; value: string; tone: Acuity }) {
  return (
    <div className={cn("border px-2 py-1", acuityClasses[tone])}>
      <div className="text-[9px] font-semibold uppercase opacity-70">{label}</div>
      <div className="font-mono text-sm font-semibold">{value}</div>
    </div>
  );
}

function WorkstationPanel({
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
