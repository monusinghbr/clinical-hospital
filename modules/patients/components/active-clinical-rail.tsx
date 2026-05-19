"use client";

import { Activity, Ambulance, BedDouble, ClipboardPlus, FlaskConical, Pill, Stethoscope } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DrawerPanel } from "@/components/clinical/drawer-panel";
import { MedicalTable } from "@/components/clinical/medical-table";
import { Button } from "@/components/ui/button";
import type { PatientWorkspaceSummary } from "@/modules/patients/types/patient-workspace";

const actions = [
  { label: "Add vitals", icon: Activity, kind: "Vitals" },
  { label: "Prescribe", icon: Pill, kind: "Prescription" },
  { label: "Order labs", icon: FlaskConical, kind: "Lab order" },
  { label: "Add note", icon: ClipboardPlus, kind: "Clinical note" },
  { label: "Transfer ward", icon: BedDouble, kind: "Ward transfer" },
  { label: "Escalate", icon: Ambulance, kind: "Emergency escalation" },
] as const;

export function ActiveClinicalRail({ patient }: { patient: PatientWorkspaceSummary }) {
  const [drawer, setDrawer] = useState<(typeof actions)[number] | null>(null);

  return (
    <aside className="space-y-3">
      <div className="rounded-md border border-border bg-panel p-3">
        <div className="mb-3 flex items-center gap-2">
          <Stethoscope className="size-4 text-primary" />
          <div>
            <div className="text-sm font-semibold">Active care rail</div>
            <div className="text-xs text-muted-foreground">Contextual actions for this patient</div>
          </div>
        </div>
        <div className="grid gap-2">
          {actions.map((action) => (
            <Button key={action.label} variant={action.label === "Escalate" ? "destructive" : "outline"} className="justify-start" onClick={() => setDrawer(action)}>
              <action.icon />
              {action.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border border-border bg-panel p-3">
        <div className="mb-2 text-[11px] font-semibold uppercase text-muted-foreground">Current care metadata</div>
        <MedicalTable
          rows={[
            { label: "Patient", value: patient.uhid },
            { label: "Encounter", value: patient.activeEncounter?.encounterNo ?? "No active encounter" },
            { label: "Status", value: patient.activeEncounter?.status.replaceAll("_", " ") ?? "Unassigned" },
            { label: "Ward/Bed", value: [patient.activeEncounter?.ward, patient.activeEncounter?.bed].filter(Boolean).join(" / ") || "None" },
          ]}
        />
      </div>

      <DrawerPanel
        open={Boolean(drawer)}
        onOpenChange={(open) => !open && setDrawer(null)}
        title={drawer?.kind ?? "Clinical action"}
        description={`${patient.name} · ${patient.uhid}`}
      >
        <div className="grid gap-3">
          <div className="rounded border border-border bg-muted/40 p-3 text-sm">
            This action surface is wired as a contextual drawer. Phase-specific writes will use optimistic UI, autosave, audit capture, and timeline events.
          </div>
          <Button
            onClick={() => {
              toast.info("Action pipeline ready", {
                description: `${drawer?.kind} will emit audit, activity, realtime, and timeline events.`,
              });
              setDrawer(null);
            }}
          >
            Confirm workflow stub
          </Button>
        </div>
      </DrawerPanel>
    </aside>
  );
}
