"use client";

import { Command } from "cmdk";
import {
  Activity,
  Ambulance,
  BedDouble,
  BellRing,
  ChevronRight,
  ClipboardList,
  ClipboardPlus,
  FileSearch,
  FileText,
  FlaskConical,
  GripVertical,
  HeartPulse,
  LayoutGrid,
  MonitorDot,
  Pill,
  Radio,
  Search,
  Siren,
  Stethoscope,
  UsersRound,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AlertBanner } from "@/components/clinical/alert-banner";
import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { DrawerPanel } from "@/components/clinical/drawer-panel";
import { MedicalTable } from "@/components/clinical/medical-table";
import { StatusIndicator } from "@/components/clinical/status-indicator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clinicalEnvironment } from "@/config/clinical";
import { cn } from "@/lib/utils";
import {
  BedFlowMap,
  ClinicalEventStream,
  EmergencyAlertStack,
  EscalationTimeline,
  HospitalCommandCenter,
  NursingHandoffPanel,
  ORCommandBoard,
  PharmacyQueue,
  RapidResponseOverlay,
  SOAPWorkspace,
  TelemetryWall,
} from "@/modules/workspace/components/advanced-operational-panels";
import { CpoeOrdersPanel, MedicationAdministrationPanel, RadiologyDiagnosticsPanel } from "@/modules/workspace/components/clinical-workflow-panels";
import {
  AdvancedCommandHints,
  AuditTraceViewer,
  BedHuddleBoard,
  ChartReviewWorkspace,
  ClinicalInterruptOverlay,
  ContextAwareWorkspace,
  EnterprisePatientList,
  FlowsheetGrid,
  HyperspaceActivityDock,
  MultiPatientSessionRail,
  PersonalizationManager,
  RoverMobileOverlay,
  SmartOrdersRail,
  SmartPhrasePanel,
  StickyEncounterHeader,
} from "@/modules/workspace/components/epic-workstation-behavior";
import {
  AlarmFatigueMeter,
  BedPressureForecast,
  ClinicalMessagingFeed,
  ClinicalTaskOrchestrator,
  DepartmentSignalMatrix,
  DisasterSurgeOverlay,
  EscalationEngine,
  IncidentCommandOverlay,
  LabCommandCenter,
  LongitudinalPatientChart,
  MultiPatientTelemetryWall,
  PhysicianRoundsPanel,
  SurgicalFlowBoard,
  TelemetryDock,
  WorkstationStatusTape,
} from "@/modules/workspace/components/hyper-dense-workstation";
import {
  commandActions,
  encounterOptions,
  emergencyIncidents,
  hospitalMetrics,
  icuBeds,
  liveEventTemplates,
  orderQueue,
  wardUnits,
  workspaceEvents,
  workspacePatients,
  workspaceViews,
} from "@/modules/workspace/data/seeded-workspace";
import { useClinicalWorkspaceStore } from "@/modules/workspace/store/workspace-store";
import type { Acuity, WorkspaceEvent, WorkspacePatient, WorkspaceView } from "@/modules/workspace/types/workspace";

const acuityClasses: Record<Acuity, string> = {
  routine: "border-border bg-background text-muted-foreground",
  watch: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  urgent: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  critical: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
};

const viewIcons: Partial<Record<WorkspaceView, React.ComponentType<{ className?: string }>>> = {
  overview: LayoutGrid,
  patients: UsersRound,
  opd: Stethoscope,
  admissions: ClipboardList,
  nursing: HeartPulse,
  vitals: Activity,
  medications: Pill,
  lab: FlaskConical,
  radiology: Radio,
  icu: MonitorDot,
  wards: BedDouble,
  or: Activity,
  pharmacy: Pill,
  handoff: UsersRound,
  documentation: ClipboardPlus,
  command: LayoutGrid,
  discharge: FileText,
  alerts: BellRing,
  escalation: Siren,
  audit: FileSearch,
};

const nestedTabs = [
  "overview",
  "timeline",
  "orders",
  "vitals",
  "medications",
  "documents",
  "carePlans",
] as const;

export function ClinicalWorkspace() {
  const activeView = useClinicalWorkspaceStore((state) => state.activeView);
  const activePatientId = useClinicalWorkspaceStore((state) => state.activePatientId);
  const emergencyMode = useClinicalWorkspaceStore((state) => state.emergencyMode);
  const query = useClinicalWorkspaceStore((state) => state.query);
  const commandOpen = useClinicalWorkspaceStore((state) => state.commandOpen);
  const patientNestedTab = useClinicalWorkspaceStore((state) => state.patientNestedTab);
  const leftPanelWidth = useClinicalWorkspaceStore((state) => state.leftPanelWidth);
  const rightPanelWidth = useClinicalWorkspaceStore((state) => state.rightPanelWidth);
  const rightRailOpen = useClinicalWorkspaceStore((state) => state.rightRailOpen);
  const setActiveView = useClinicalWorkspaceStore((state) => state.setActiveView);
  const setActivePatientId = useClinicalWorkspaceStore((state) => state.setActivePatientId);
  const setEmergencyMode = useClinicalWorkspaceStore((state) => state.setEmergencyMode);
  const setQuery = useClinicalWorkspaceStore((state) => state.setQuery);
  const setCommandOpen = useClinicalWorkspaceStore((state) => state.setCommandOpen);
  const setPatientNestedTab = useClinicalWorkspaceStore((state) => state.setPatientNestedTab);
  const setLeftPanelWidth = useClinicalWorkspaceStore((state) => state.setLeftPanelWidth);
  const setRightPanelWidth = useClinicalWorkspaceStore((state) => state.setRightPanelWidth);
  const setRightRailOpen = useClinicalWorkspaceStore((state) => state.setRightRailOpen);
  const [drawer, setDrawer] = useState<string | null>(null);
  const [liveEvents, setLiveEvents] = useState<WorkspaceEvent[]>(workspaceEvents);
  const [simPatients, setSimPatients] = useState<WorkspacePatient[]>(workspacePatients);
  const [simIcuBeds, setSimIcuBeds] = useState(icuBeds);
  const [simHospitalMetrics, setSimHospitalMetrics] = useState(hospitalMetrics);
  const [alertPressure, setAlertPressure] = useState(3);
  const [roleContext, setRoleContext] = useState<"ICU" | "ED" | "Rounds" | "OR" | "Nursing" | "Command">("ICU");
  const [roverOpen, setRoverOpen] = useState(false);

  useEffect(() => {
    function applyViewFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const view = params.get("view") as WorkspaceView | null;
      if (view && workspaceViews.some((item) => item.id === view)) {
        setActiveView(view);
      }
    }

    applyViewFromUrl();
    const hydrationTimers = [100, 700, 1600].map((delay) => window.setTimeout(applyViewFromUrl, delay));
    window.addEventListener("popstate", applyViewFromUrl);

    return () => {
      hydrationTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("popstate", applyViewFromUrl);
    };
  }, [setActiveView]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen(true);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setCommandOpen]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const template = liveEventTemplates[Math.floor(Math.random() * liveEventTemplates.length)];
      const now = new Date();
      const event: WorkspaceEvent = {
        ...template,
        id: `live-${now.getTime()}`,
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setLiveEvents((events) => [event, ...events].slice(0, 12));
      setAlertPressure((count) => Math.min(9, Math.max(1, count + (event.acuity === "critical" ? 1 : event.acuity === "routine" ? -1 : 0))));
      setSimPatients((patients) =>
        patients.map((patient) =>
          patient.id === event.patientId
            ? {
                ...patient,
                acuity: event.acuity === "critical" ? "critical" : event.acuity === "urgent" && patient.acuity === "routine" ? "urgent" : patient.acuity,
                lastEvent: `${event.title} just now`,
                pendingTasks: Math.min(9, patient.pendingTasks + (event.acuity === "critical" ? 2 : event.acuity === "urgent" ? 1 : 0)),
                flags: event.acuity === "critical" ? Array.from(new Set([...patient.flags, "Escalation watch"])) : patient.flags,
                vitals:
                  event.type === "ICU alert"
                    ? {
                        ...patient.vitals,
                        pulse: String(Math.min(144, Number(patient.vitals.pulse) + 4)),
                        spo2: String(Math.max(88, Number(patient.vitals.spo2) - 1)),
                      }
                    : patient.vitals,
              }
            : patient,
        ),
      );
      setSimIcuBeds((beds) =>
        beds.map((bed) =>
          bed.patientId === event.patientId
            ? {
                ...bed,
                severity: event.acuity,
                map: event.acuity === "critical" ? Math.max(55, bed.map - 2) : bed.map,
                spo2: event.acuity === "critical" ? Math.max(88, bed.spo2 - 1) : bed.spo2,
                infusion: event.type === "ICU alert" ? "Norad titrate" : bed.infusion,
              }
            : bed,
        ),
      );
      setSimHospitalMetrics((metrics) =>
        metrics.map((metric) =>
          metric.id === "hm-3" && event.acuity === "critical"
            ? { ...metric, value: "12 / 14", detail: "4 critical, 3 ventilated", tone: "critical" }
            : metric.id === "hm-2" && event.type === "Emergency"
              ? { ...metric, value: "21 wait", detail: "5 high-acuity triage", tone: "critical" }
              : metric,
        ),
      );
      if (event.type === "Emergency") {
        setEmergencyMode(true);
      }
    }, 5200);

    return () => window.clearInterval(timer);
  }, [setEmergencyMode]);

  const filteredPatients = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    if (!normalized) return simPatients;
    return simPatients.filter((patient) =>
      [patient.name, patient.uhid, patient.encounter, patient.ward, patient.bed, patient.status].some((value) =>
        value.toLowerCase().includes(normalized),
      ),
    );
  }, [query, simPatients]);

  const activePatient = simPatients.find((patient) => patient.id === activePatientId) ?? simPatients[0];
  const visibleEvents = liveEvents.filter((event) => event.patientId === activePatient.id || ["overview", "command", "alerts", "escalation"].includes(activeView));

  const selectView = useCallback(
    (view: WorkspaceView) => {
      setActiveView(view);
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("view", view);
      window.history.replaceState(null, "", nextUrl);
    },
    [setActiveView],
  );

  const beginResize = useCallback(
    (side: "left" | "right", startEvent: React.PointerEvent<HTMLButtonElement>) => {
      startEvent.preventDefault();
      const startX = startEvent.clientX;
      const startWidth = side === "left" ? leftPanelWidth : rightPanelWidth;

      function onMove(event: PointerEvent) {
        const delta = event.clientX - startX;
        if (side === "left") {
          setLeftPanelWidth(Math.min(420, Math.max(240, startWidth + delta)));
        } else {
          setRightPanelWidth(Math.min(460, Math.max(280, startWidth - delta)));
        }
      }

      function onUp() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [leftPanelWidth, rightPanelWidth, setLeftPanelWidth, setRightPanelWidth],
  );

  function executeCommand(commandId: string) {
    const command = commandActions.find((item) => item.id === commandId);
    if (!command) return;
    if (command.patientId) setActivePatientId(command.patientId);
    if (command.view) selectView(command.view);
    if (command.action) {
      setDrawer(command.action);
      if (command.group === "Emergency") setEmergencyMode(true);
      if (command.action.includes("Rover")) setRoverOpen(true);
    }
    setCommandOpen(false);
  }

  return (
    <div className={cn("clinical-terminal min-h-screen bg-background text-foreground", emergencyMode && "bg-red-950/10")}>
      <div className="border-b border-border bg-panel px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded border border-border bg-background px-2 py-1 text-[11px]">
            <span className="font-semibold">{clinicalEnvironment.workspaceName}</span>
            <Separator orientation="vertical" className="h-4" />
            <StatusIndicator label="WARD-04 synced" tone="online" pulse />
          </div>
          <MicroChip label="SHIFT-A" value="Day" />
          <MicroChip label="ENGINE" value="ON" tone="watch" />
          <MicroChip label="ICU LOAD" value={simHospitalMetrics.find((metric) => metric.id === "hm-3")?.value ?? "11/14"} tone="urgent" />
          <MicroChip label="CRITICAL" value={String(alertPressure)} tone="critical" />
          <MicroChip label="PENDING LABS" value="64" tone="watch" />
          <MicroChip label="ED WAIT" value="18m" tone="urgent" />
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => setCommandOpen(true)}>
            <Search />
            Command
            <kbd className="rounded border border-border px-1 text-[10px] text-muted-foreground">Ctrl K</kbd>
          </Button>
          <Button size="sm" variant={emergencyMode ? "destructive" : "outline"} onClick={() => setEmergencyMode(!emergencyMode)}>
            <Siren />
            Emergency
          </Button>
        </div>
      </div>
      <ContextAwareWorkspace activeView={activeView} role={roleContext} onRole={setRoleContext} />

      <div className="overflow-x-auto">
        <div
          className="grid min-h-[calc(100vh-42px)] min-w-[1220px]"
          style={{
            gridTemplateColumns: `${leftPanelWidth}px 8px minmax(640px,1fr) ${rightRailOpen ? `8px ${rightPanelWidth}px` : "0px 0px"}`,
          }}
        >
          <LeftCommandRail
            activeView={activeView}
            activePatient={activePatient}
            filteredPatients={filteredPatients}
            query={query}
            onPatient={setActivePatientId}
            onQuery={setQuery}
            onView={selectView}
          />
          <ResizeHandle label="Resize patient rail" onPointerDown={(event) => beginResize("left", event)} />
          <MainCommandSurface
            activeView={activeView}
            activePatient={activePatient}
            activePatientId={activePatientId}
            roleContext={roleContext}
            nestedTab={patientNestedTab}
            liveEvents={visibleEvents}
            patientState={simPatients}
            icuBedState={simIcuBeds}
            hospitalMetricState={simHospitalMetrics}
            onAction={setDrawer}
            onPatient={setActivePatientId}
            onNestedTab={setPatientNestedTab}
            onView={selectView}
          />
          {rightRailOpen ? <ResizeHandle label="Resize activity rail" onPointerDown={(event) => beginResize("right", event)} /> : <div />}
          {rightRailOpen ? (
            <RightActivityRail activePatient={activePatient} liveEvents={visibleEvents} onAction={setDrawer} onPatient={setActivePatientId} onClose={() => setRightRailOpen(false)} />
          ) : null}
        </div>
      </div>

      {!rightRailOpen ? (
        <Button className="fixed bottom-4 right-4 shadow-xl" onClick={() => setRightRailOpen(true)}>
          <BellRing />
          Open alerts
        </Button>
      ) : null}

      <WorkspaceCommandPalette open={commandOpen} onOpenChange={setCommandOpen} onExecute={executeCommand} />
      <ClinicalInterruptOverlay events={liveEvents} onAction={setDrawer} />
      <EmergencyAlertStack onAction={setDrawer} />
      <TelemetryDock onAction={setDrawer} />
      <WorkstationStatusTape events={liveEvents} onAction={setDrawer} />
      <RapidResponseOverlay active={emergencyMode} incident={emergencyIncidents[0]} onClose={() => setEmergencyMode(false)} onAction={setDrawer} />
      <RoverMobileOverlay active={roverOpen} patient={activePatient} onClose={() => setRoverOpen(false)} onAction={setDrawer} />

      <DrawerPanel open={Boolean(drawer)} onOpenChange={(open) => !open && setDrawer(null)} title={drawer ?? "Clinical action"} description={`${activePatient.name} · ${activePatient.uhid}`}>
        <div className="grid gap-3">
          <AlertBanner title="Clinical simulator action" detail="This workflow updates local UI state and reinforces command-center behavior without backend persistence." severity={drawer?.includes("Code") ? "critical" : "info"} />
          <div className="grid gap-2">
            {["Optimistic local update", "Activity stream pulse", "Audit marker visualized", "Realtime state simulated"].map((item) => (
              <div key={item} className="rounded border border-border bg-background px-3 py-2 text-sm">
                {item}
              </div>
            ))}
          </div>
          <Button
            onClick={() => {
              toast.success("Workflow simulated", { description: `${drawer} completed inside the local clinical workstation.` });
              setDrawer(null);
            }}
          >
            Complete simulated action
          </Button>
        </div>
      </DrawerPanel>
    </div>
  );
}

function LeftCommandRail({
  activeView,
  activePatient,
  filteredPatients,
  query,
  onPatient,
  onQuery,
  onView,
}: {
  activeView: WorkspaceView;
  activePatient: WorkspacePatient;
  filteredPatients: WorkspacePatient[];
  query: string;
  onPatient: (patientId: string) => void;
  onQuery: (query: string) => void;
  onView: (view: WorkspaceView) => void;
}) {
  return (
    <aside className="min-w-0 border-r border-border bg-panel">
      <div className="border-b border-border p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => onQuery(event.target.value)} className="pl-9" placeholder="Patient, UHID, bed, order..." />
        </div>
      </div>
      <div className="border-b border-border p-2">
        <div className="grid grid-cols-2 gap-1">
          {workspaceViews.map((view) => {
            const Icon = viewIcons[view.id] ?? LayoutGrid;
            return (
              <button
                key={view.id}
                className={cn("flex h-8 items-center justify-between rounded px-2 text-xs text-muted-foreground hover:bg-accent", activeView === view.id && "bg-primary/10 text-primary")}
                onClick={() => onView(view.id)}
                type="button"
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <Icon className="size-3.5 shrink-0" />
                  <span className="truncate">{view.label}</span>
                </span>
                {view.count ? <span className="font-mono text-[10px]">{view.count}</span> : null}
              </button>
            );
          })}
        </div>
      </div>
      <div className="max-h-[calc(100vh-178px)] overflow-auto p-2">
        <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-semibold uppercase text-muted-foreground">
          Patient context
          <span>{filteredPatients.length}</span>
        </div>
        <div className="grid gap-2">
          {filteredPatients.map((patient) => (
            <PatientQueueItem key={patient.id} patient={patient} active={patient.id === activePatient.id} onClick={() => onPatient(patient.id)} />
          ))}
        </div>
      </div>
    </aside>
  );
}

function MainCommandSurface({
  activeView,
  activePatient,
  activePatientId,
  roleContext,
  nestedTab,
  liveEvents,
  patientState,
  icuBedState,
  hospitalMetricState,
  onAction,
  onPatient,
  onNestedTab,
  onView,
}: {
  activeView: WorkspaceView;
  activePatient: WorkspacePatient;
  activePatientId: string;
  roleContext: "ICU" | "ED" | "Rounds" | "OR" | "Nursing" | "Command";
  nestedTab: (typeof nestedTabs)[number];
  liveEvents: WorkspaceEvent[];
  patientState: WorkspacePatient[];
  icuBedState: typeof icuBeds;
  hospitalMetricState: typeof hospitalMetrics;
  onAction: (action: string) => void;
  onPatient: (patientId: string) => void;
  onNestedTab: (tab: (typeof nestedTabs)[number]) => void;
  onView: (view: WorkspaceView) => void;
}) {
  return (
    <main className="min-w-0 p-3">
      <StickyEncounterHeader patient={activePatient} role={roleContext} />
      <PatientHeader patient={activePatient} />
      <div className="mt-2">
        <PatientAcuityLedger patient={activePatient} liveEvents={liveEvents} />
      </div>
      <div className="mt-2 grid gap-2 2xl:grid-cols-[1fr_240px]">
        <HyperspaceActivityDock activePatient={activePatient} onAction={onAction} onPatient={onPatient} />
        <MultiPatientSessionRail patients={patientState} activePatientId={activePatientId} onPatient={onPatient} />
      </div>
      <div className="mt-3 grid gap-3 2xl:grid-cols-[1fr_340px]">
        <section className="min-w-0 rounded-md border border-border bg-panel">
          <Tabs value={activeView} onValueChange={(value) => onView(value as WorkspaceView)}>
            <div className="border-b border-border p-2">
              <TabsList className="flex h-auto flex-wrap justify-start bg-background">
                {workspaceViews.map((view) => (
                  <TabsTrigger key={view.id} value={view.id} className="gap-1.5">
                    {view.label}
                    {view.count ? <span className="rounded bg-muted px-1 font-mono text-[10px]">{view.count}</span> : null}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="p-3">
              <WorkspacePanel view={activeView} patient={activePatient} patientState={patientState} activePatientId={activePatientId} nestedTab={nestedTab} liveEvents={liveEvents} icuBedState={icuBedState} onAction={onAction} onPatient={onPatient} onNestedTab={onNestedTab} />
            </div>
          </Tabs>
        </section>
        <HospitalEcosystemPanel metrics={hospitalMetricState} />
      </div>
    </main>
  );
}

function PatientHeader({ patient }: { patient: WorkspacePatient }) {
  const encounters = encounterOptions.filter((encounter) => encounter.patientId === patient.id);

  return (
    <section className="grid gap-3 2xl:grid-cols-[1fr_360px]">
      <div className="rounded-md border border-border bg-panel p-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-semibold text-primary">{patient.uhid}</span>
              <ClinicalBadge label={patient.acuity} severity={patient.acuity === "critical" ? "critical" : patient.acuity === "urgent" ? "warning" : "info"} />
              <StatusIndicator label={patient.status} tone={patient.acuity === "critical" ? "critical" : "idle"} pulse={patient.acuity === "critical"} />
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">{patient.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {patient.ageSex} · {patient.encounter} · {patient.doctor}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-semibold uppercase text-muted-foreground">Encounter</span>
              <select className="h-7 rounded border border-border bg-background px-2 text-xs">
                {(encounters.length ? encounters : [{ id: patient.encounter, label: patient.encounter, location: patient.bed, attending: patient.doctor, status: patient.status, patientId: patient.id }]).map((encounter) => (
                  <option key={encounter.id}>{encounter.label}</option>
                ))}
              </select>
              <span className="text-[11px] text-muted-foreground">{encounters[0]?.location ?? patient.bed}</span>
              <span className="text-[11px] text-muted-foreground">{encounters[0]?.attending ?? patient.doctor}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Metric label="Ward" value={patient.ward} />
            <Metric label="Bed" value={patient.bed} />
            <Metric label="Tasks" value={String(patient.pendingTasks)} tone={patient.pendingTasks > 3 ? "urgent" : "watch"} />
          </div>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-5">
          <Vital label="Temp" value={patient.vitals.temp} unit="C" acuity={Number(patient.vitals.temp) > 38 ? "urgent" : "routine"} />
          <Vital label="Pulse" value={patient.vitals.pulse} unit="bpm" acuity={Number(patient.vitals.pulse) > 115 ? "critical" : "routine"} />
          <Vital label="BP" value={patient.vitals.bp} unit="mmHg" acuity={patient.vitals.bp.startsWith("88") ? "critical" : "routine"} />
          <Vital label="SpO2" value={patient.vitals.spo2} unit="%" acuity={Number(patient.vitals.spo2) < 94 ? "urgent" : "routine"} />
          <Vital label="RR" value={patient.vitals.rr} unit="/min" acuity={Number(patient.vitals.rr) > 24 ? "urgent" : "routine"} />
        </div>
      </div>
      <div className="rounded-md border border-border bg-panel p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">Immediate context</div>
        <MedicalTable
          rows={[
            { label: "Allergies", value: patient.allergies.join(", ") || "None", flag: patient.allergies.length ? "high" : "normal" },
            { label: "Flags", value: patient.flags.join(", ") || "None", flag: patient.flags.length ? "high" : "normal" },
            { label: "Insurance", value: patient.insurance },
            { label: "Open orders", value: String(patient.activeOrders) },
          ]}
        />
      </div>
    </section>
  );
}

function PatientAcuityLedger({ patient, liveEvents }: { patient: WorkspacePatient; liveEvents: WorkspaceEvent[] }) {
  const rows = [
    ["ACTIVE PT", patient.bed, patient.acuity],
    ["OPEN ORDERS", String(patient.activeOrders), patient.activeOrders > 5 ? "urgent" : "watch"],
    ["TASKS", String(patient.pendingTasks), patient.pendingTasks > 3 ? "urgent" : "routine"],
    ["LAST EVENT", liveEvents[0]?.time ?? "--", liveEvents[0]?.acuity ?? "routine"],
    ["ALLERGY", patient.allergies[0] ?? "none", patient.allergies.length ? "critical" : "routine"],
    ["RISK FLAGS", String(patient.flags.length), patient.flags.length > 1 ? "urgent" : "watch"],
    ["CARE TEAM", patient.doctor.replace("Dr. ", ""), patient.acuity],
    ["SYNC", "live", "watch"],
  ] as const;

  return (
    <div className="grid grid-cols-2 gap-1 md:grid-cols-4 xl:grid-cols-8">
      {rows.map(([label, value, tone]) => (
        <div key={label} className={cn("border px-2 py-1 text-[10px]", acuityClasses[tone as Acuity])}>
          <div className="font-semibold uppercase opacity-70">{label}</div>
          <div className="truncate font-mono text-xs font-semibold">{value}</div>
        </div>
      ))}
    </div>
  );
}

function WorkspacePanel({
  view,
  patient,
  patientState,
  activePatientId,
  nestedTab,
  liveEvents,
  icuBedState,
  onAction,
  onPatient,
  onNestedTab,
}: {
  view: WorkspaceView;
  patient: WorkspacePatient;
  patientState: WorkspacePatient[];
  activePatientId: string;
  nestedTab: (typeof nestedTabs)[number];
  liveEvents: WorkspaceEvent[];
  icuBedState: typeof icuBeds;
  onAction: (action: string) => void;
  onPatient: (patientId: string) => void;
  onNestedTab: (tab: (typeof nestedTabs)[number]) => void;
}) {
  if (view === "command" || view === "overview") {
    return (
      <div className="grid gap-2">
        <IncidentCommandOverlay active onAction={onAction} />
        <DisasterSurgeOverlay />
        <HospitalCommandCenter onAction={onAction} />
        <DepartmentSignalMatrix onAction={onAction} />
        <ClinicalTaskOrchestrator onAction={onAction} />
        <PersonalizationManager onAction={onAction} />
        <ClinicalMessagingFeed onAction={onAction} />
      </div>
    );
  }

  if (view === "patients") {
    return (
      <div className="grid gap-2">
        <EnterprisePatientList patients={patientState} activePatientId={activePatientId} onPatient={onPatient} onAction={onAction} />
        <ChartReviewWorkspace patient={patient} events={liveEvents} onAction={onAction} />
      </div>
    );
  }

  if (view === "icu") {
    return (
      <div className="grid gap-2">
        <MultiPatientTelemetryWall beds={icuBedState} patients={patientState} onAction={onAction} />
        <AlarmFatigueMeter />
        <TelemetryWall beds={icuBedState} onAction={onAction} />
        <IcuMonitoringBoard beds={icuBedState} onAction={onAction} />
      </div>
    );
  }

  if (view === "wards") {
    return (
      <div className="grid gap-3">
        <BedHuddleBoard onAction={onAction} />
        <BedFlowMap onAction={onAction} />
        <WardMap />
      </div>
    );
  }

  if (view === "or") {
    return (
      <div className="grid gap-2">
        <SurgicalFlowBoard onAction={onAction} />
        <ORCommandBoard onAction={onAction} />
      </div>
    );
  }

  if (view === "pharmacy") {
    return <PharmacyQueue onAction={onAction} />;
  }

  if (view === "handoff") {
    return <NursingHandoffPanel patient={patient} onAction={onAction} />;
  }

  if (view === "documentation") {
    return (
      <div className="grid gap-2 2xl:grid-cols-[1fr_320px]">
        <SOAPWorkspace patient={patient} onAction={onAction} />
        <div className="grid gap-2">
          <SmartPhrasePanel onAction={onAction} />
          <SmartOrdersRail patient={patient} onAction={onAction} />
        </div>
      </div>
    );
  }

  if (view === "alerts" || view === "escalation") {
    return (
      <div className="grid gap-2">
        <IncidentCommandOverlay active onAction={onAction} />
        <EmergencyCommandMode onAction={onAction} />
        <EscalationEngine events={liveEvents} onAction={onAction} />
        <EscalationTimeline incident={emergencyIncidents[0]} />
        <ClinicalEventStream events={liveEvents} onAction={onAction} />
      </div>
    );
  }

  if (view === "nursing" || view === "vitals") {
    return (
      <div className="grid gap-2">
        <FlowsheetGrid patient={patient} onAction={onAction} />
        <MedicationAdministrationPanel patient={patient} onAction={onAction} />
      </div>
    );
  }

  if (view === "medications") {
    return (
      <div className="grid gap-2 2xl:grid-cols-[1fr_300px]">
        <MedicationAdministrationPanel patient={patient} onAction={onAction} />
        <SmartOrdersRail patient={patient} onAction={onAction} />
      </div>
    );
  }

  if (view === "lab") {
    return (
      <div className="grid gap-2">
        <LabCommandCenter onAction={onAction} />
        <CpoeOrdersPanel patient={patient} onAction={onAction} />
      </div>
    );
  }

  if (view === "opd" || view === "admissions") {
    return (
      <div className="grid gap-2">
        <PhysicianRoundsPanel patients={patientState} onPatient={onPatient} onAction={onAction} />
        <CpoeOrdersPanel patient={patient} onAction={onAction} />
      </div>
    );
  }

  if (view === "radiology") {
    return <RadiologyDiagnosticsPanel patient={patient} onAction={onAction} />;
  }

  if (view === "audit") {
    return <AuditTraceViewer onAction={onAction} />;
  }

  return (
    <div className="grid gap-3 2xl:grid-cols-[minmax(0,1fr)_300px]">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {nestedTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onNestedTab(tab)}
              className={cn("h-8 rounded border border-border px-2 text-xs text-muted-foreground hover:bg-accent", nestedTab === tab && "border-primary bg-primary/10 text-primary")}
            >
              {tab === "carePlans" ? "Care Plans" : tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <NestedPatientSurface tab={nestedTab} patient={patient} liveEvents={liveEvents} onAction={onAction} />
      </div>
      <div className="grid gap-2">
        <InlineActionRail onAction={onAction} />
        <BedPressureForecast />
      </div>
    </div>
  );
}

function NestedPatientSurface({ tab, patient, liveEvents, onAction }: { tab: (typeof nestedTabs)[number]; patient: WorkspacePatient; liveEvents: WorkspaceEvent[]; onAction: (action: string) => void }) {
  if (tab === "overview") {
    return <LongitudinalPatientChart patient={patient} events={liveEvents} onAction={onAction} />;
  }

  if (tab === "timeline") {
    return <ClinicalEventStream events={liveEvents} onAction={onAction} />;
  }

  if (tab === "medications") {
    return <MedicationAdministrationPanel patient={patient} onAction={() => undefined} />;
  }

  if (tab === "orders") {
    return <CpoeOrdersPanel patient={patient} onAction={() => undefined} />;
  }

  const rows = [
    ["Current plan", patient.status, "Continuity plan attached to active encounter."],
    ["Orders", `${patient.activeOrders} active`, "Medication, lab, radiology, and nursing tasks."],
    ["Tasks", `${patient.pendingTasks} pending`, "Shift worklist and escalation-sensitive items."],
    ["Last event", patient.lastEvent, "Live stream sync from clinical activity."],
    ["Care team", patient.doctor, "Attending and role-based handoff state."],
    ["Payer", patient.insurance, "Coverage context visible during care operations."],
  ];

  return (
    <div className="grid gap-2 md:grid-cols-3">
      {rows.map(([title, value, detail]) => (
        <div key={title} className="rounded border border-border bg-background p-3">
          <div className="text-[10px] font-semibold uppercase text-muted-foreground">{title}</div>
          <div className="mt-1 text-sm font-semibold">{value}</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function InlineActionRail({ onAction }: { onAction: (action: string) => void }) {
  const actions = [
    ["Add vitals", Activity],
    ["SOAP note", ClipboardPlus],
    ["Medication", Pill],
    ["Lab order", FlaskConical],
    ["Radiology", Radio],
    ["Escalate", Siren],
  ] as const;

  return (
    <div className="rounded-md border border-border bg-background p-3">
      <div className="mb-3 text-[11px] font-semibold uppercase text-muted-foreground">Inline actions</div>
      <div className="grid gap-2">
        {actions.map(([label, Icon]) => (
          <Button key={label} variant={label === "Escalate" ? "destructive" : "outline"} className="justify-between" onClick={() => onAction(label)}>
            <span className="flex items-center gap-2">
              <Icon />
              {label}
            </span>
            <ChevronRight className="size-4" />
          </Button>
        ))}
      </div>
    </div>
  );
}

function IcuMonitoringBoard({ beds, onAction }: { beds: typeof icuBeds; onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2 md:grid-cols-4">
        <Metric label="Ventilated" value="2" tone="critical" />
        <Metric label="Pressors" value="3" tone="urgent" />
        <Metric label="Isolation" value="2" tone="watch" />
        <Metric label="Alarm fatigue" value="18/HR" tone="urgent" />
      </div>
      <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-3">
        {beds.map((bed) => (
          <button key={bed.id} type="button" onClick={() => onAction(`${bed.bed} bedside review`)} className={cn("rounded-md border p-3 text-left hover:border-primary", acuityClasses[bed.severity])}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm font-semibold">{bed.bed}</span>
              <ClinicalBadge label={bed.ventilator} severity={bed.severity === "critical" ? "critical" : bed.severity === "urgent" ? "warning" : "info"} />
            </div>
            <div className="mt-2 text-base font-semibold">{bed.patientName}</div>
            <TelemetryWaveform severity={bed.severity} rhythm={bed.rhythm} />
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <Metric label="MAP" value={String(bed.map || "--")} tone={bed.map && bed.map < 65 ? "critical" : "routine"} />
              <Metric label="SpO2" value={bed.spo2 ? `${bed.spo2}%` : "--"} tone={bed.spo2 && bed.spo2 < 94 ? "urgent" : "routine"} />
              <Metric label="Rhythm" value={bed.rhythm} tone={bed.rhythm.includes("VT") ? "critical" : "routine"} />
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted-foreground">
              <span>{bed.nurse}</span>
              <span>{bed.infusion}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function WardMap() {
  return (
    <div className="grid gap-3">
      <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-5">
        {wardUnits.map((ward) => (
          <div key={ward.id} className="rounded-md border border-border bg-background p-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{ward.name}</div>
              <StatusIndicator label={ward.sync} tone={ward.sync === "synced" ? "online" : "warning"} />
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded bg-muted">
              <div className="h-full bg-primary" style={{ width: `${(ward.occupancy / ward.capacity) * 100}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{ward.occupancy}/{ward.capacity} occupied</span>
              <span>{ward.critical} critical</span>
            </div>
            <div className="mt-3 text-xs">{ward.nurseLead}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1">
        {Array.from({ length: 64 }).map((_, index) => {
          const tone: Acuity = index % 17 === 0 ? "critical" : index % 9 === 0 ? "urgent" : index % 5 === 0 ? "watch" : "routine";
          return <div key={index} className={cn("h-8 rounded border", acuityClasses[tone])} title={`Bed ${index + 1}`} />;
        })}
      </div>
    </div>
  );
}

function EmergencyCommandMode({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="grid gap-3">
      <AlertBanner title="Emergency command mode" detail="Simulated escalation layer for code response, rapid response, and ICU saturation control." severity="critical" />
      <div className="grid gap-2 md:grid-cols-3">
        {["Code Blue drill", "Rapid response team", "Open crash cart route", "Assign ICU nurse", "Notify intensivist", "Lock bed transfer"].map((action) => (
          <Button key={action} variant={action.includes("Code") ? "destructive" : "outline"} className="justify-start" onClick={() => onAction(action)}>
            <Ambulance />
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
}

function HospitalEcosystemPanel({ metrics }: { metrics: typeof hospitalMetrics }) {
  return (
    <aside className="rounded-md border border-border bg-panel p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase text-muted-foreground">Hospital ecosystem</div>
          <h2 className="text-sm font-semibold">Operational pressure</h2>
        </div>
        <StatusIndicator label="Live" tone="online" pulse />
      </div>
      <div className="grid gap-2">
        {metrics.map((metric) => (
          <div key={metric.id} className={cn("rounded border p-2", acuityClasses[metric.tone])}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold">{metric.label}</span>
              <span className="font-mono text-sm font-semibold">{metric.value}</span>
            </div>
            <p className="mt-1 text-[11px] opacity-80">{metric.detail}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function TelemetryWaveform({ severity, rhythm }: { severity: Acuity; rhythm: string }) {
  const color = severity === "critical" ? "#ef4444" : severity === "urgent" ? "#f59e0b" : "#2dd4bf";
  const points =
    severity === "critical"
      ? "0,22 12,22 17,8 22,36 29,18 36,22 52,22 58,10 64,33 71,20 82,22 96,22"
      : "0,24 14,24 20,14 25,30 31,22 42,24 58,24 64,16 69,29 75,23 96,24";

  return (
    <div className="mt-3 rounded border border-border bg-black/30 px-2 py-1">
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase text-muted-foreground">
        <span>Telemetry</span>
        <span>{rhythm}</span>
      </div>
      <svg viewBox="0 0 96 44" className="h-12 w-full overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-pulse"
        />
        <line x1="0" y1="22" x2="96" y2="22" stroke="currentColor" strokeOpacity="0.12" />
      </svg>
    </div>
  );
}

function RightActivityRail({
  activePatient,
  liveEvents,
  onAction,
  onPatient,
  onClose,
}: {
  activePatient: WorkspacePatient;
  liveEvents: WorkspaceEvent[];
  onAction: (action: string) => void;
  onPatient: (patientId: string) => void;
  onClose: () => void;
}) {
  return (
    <aside className="min-w-0 border-l border-border bg-panel p-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase text-muted-foreground">Live activity</div>
          <h2 className="text-sm font-semibold">Hospital stream</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close activity rail">
          <X />
        </Button>
      </div>
      <div className="grid max-h-[38vh] gap-2 overflow-auto">
        {liveEvents.map((event) => (
          <div key={event.id} className={cn("rounded-md border p-2", acuityClasses[event.acuity])}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[11px]">{event.time}</span>
              <ClinicalBadge label={event.type} severity={event.acuity === "critical" ? "critical" : event.acuity === "urgent" ? "warning" : "info"} />
            </div>
            <div className="mt-2 text-sm font-semibold">{event.title}</div>
            <p className="mt-1 text-xs leading-5 opacity-80">{event.summary}</p>
          </div>
        ))}
      </div>
      <Separator className="my-3" />
      <div className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">Order queue</div>
      <div className="grid gap-2">
        {orderQueue.map((order) => (
          <button
            key={order.id}
            type="button"
            className="rounded border border-border bg-background p-2 text-left hover:border-primary/50"
            onClick={() => {
              onPatient(order.patientId);
              onAction(order.label);
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold">{order.queue}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{order.eta}</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{order.label}</div>
          </button>
        ))}
      </div>
      <Separator className="my-3" />
      <div className="text-[11px] font-semibold uppercase text-muted-foreground">Active context</div>
      <div className="mt-2 rounded border border-border bg-background p-2 text-xs">
        <div className="font-semibold">{activePatient.name}</div>
        <div className="mt-1 text-muted-foreground">{activePatient.ward} · {activePatient.bed}</div>
      </div>
    </aside>
  );
}

function WorkspaceCommandPalette({ open, onOpenChange, onExecute }: { open: boolean; onOpenChange: (open: boolean) => void; onExecute: (commandId: string) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0">
        <Command>
          <div className="flex items-center border-b border-border px-3">
            <Search className="mr-2 size-4 text-muted-foreground" />
            <Command.Input className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" placeholder="Jump patient, open ICU bed, assign nurse, trigger emergency..." />
          </div>
          <Command.List className="max-h-96 overflow-auto p-2">
            <Command.Empty className="px-3 py-8 text-center text-sm text-muted-foreground">No command found.</Command.Empty>
            {["Patient", "Navigation", "Operations", "Ward", "Orders", "Emergency"].map((group) => (
              <Command.Group key={group} heading={group} className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:text-muted-foreground">
                {commandActions
                  .filter((action) => action.group === group)
                  .map((action) => (
                    <Command.Item key={action.id} value={`${action.label} ${action.hint}`} onSelect={() => onExecute(action.id)} className="flex cursor-pointer items-center justify-between rounded px-3 py-2 text-sm data-[selected=true]:bg-accent">
                      <span>{action.label}</span>
                      <span className="text-xs text-muted-foreground">{action.hint}</span>
                    </Command.Item>
                  ))}
              </Command.Group>
            ))}
          </Command.List>
          <AdvancedCommandHints />
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function ResizeHandle({ label, onPointerDown }: { label: string; onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => void }) {
  return (
    <button type="button" aria-label={label} onPointerDown={onPointerDown} className="flex cursor-col-resize items-center justify-center border-x border-border bg-muted/40 text-muted-foreground hover:bg-accent">
      <GripVertical className="size-3.5" />
    </button>
  );
}

function MicroChip({ label, value, tone = "routine" }: { label: string; value: string; tone?: Acuity }) {
  return (
    <div className={cn("flex items-center gap-1 rounded border px-2 py-1 text-[11px]", acuityClasses[tone])}>
      <span className="font-semibold opacity-75">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

function Metric({ label, value, tone = "routine" }: { label: string; value: string; tone?: Acuity }) {
  return (
    <div className={cn("rounded border px-2 py-1.5", acuityClasses[tone])}>
      <div className="text-[10px] uppercase opacity-70">{label}</div>
      <div className="mt-0.5 truncate font-semibold">{value}</div>
    </div>
  );
}

function Vital({ label, value, unit, acuity }: { label: string; value: string; unit: string; acuity: Acuity }) {
  return (
    <div className={cn("rounded border px-3 py-2", acuityClasses[acuity])}>
      <div className="text-[10px] font-semibold uppercase opacity-70">{label}</div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-mono text-lg font-semibold">{value}</span>
        <span className="text-[11px] opacity-70">{unit}</span>
      </div>
    </div>
  );
}

function PatientQueueItem({ patient, active, onClick }: { patient: WorkspacePatient; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("rounded-md border border-border bg-background p-2 text-left hover:border-primary/60", active && "border-primary bg-accent/50")}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-semibold">{patient.name}</span>
        <span className={cn("size-2 rounded-full", patient.acuity === "critical" ? "bg-red-500" : patient.acuity === "urgent" ? "bg-amber-500" : "bg-emerald-500")} />
      </div>
      <div className="mt-1 font-mono text-[11px] text-primary">{patient.uhid}</div>
      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">{patient.ward} · {patient.bed}</span>
        <span>{patient.pendingTasks} tasks</span>
      </div>
    </button>
  );
}
