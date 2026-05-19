import { AlertTriangle, BadgeCheck, BedDouble, Droplet, Phone, ShieldAlert, UserRound } from "lucide-react";

import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { StatusIndicator } from "@/components/clinical/status-indicator";
import type { PatientWorkspaceSummary } from "@/modules/patients/types/patient-workspace";

export function PatientSummaryPanel({ patient }: { patient: PatientWorkspaceSummary }) {
  return (
    <aside className="sticky top-16 space-y-3 self-start rounded-md border border-border bg-panel p-3">
      <div className="flex items-start gap-3">
        <div className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary">
          <UserRound className="size-6" />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[11px] font-semibold text-primary">{patient.uhid}</div>
          <h1 className="truncate text-base font-semibold">{patient.name}</h1>
          <p className="text-xs text-muted-foreground">{patient.ageSex}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {patient.phone ? (
          <div className="rounded border border-border bg-background px-2 py-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="size-3.5" />
              Phone
            </div>
            <div className="mt-1 font-medium">{patient.phone}</div>
          </div>
        ) : null}
        {patient.bloodGroup ? (
          <div className="rounded border border-border bg-background px-2 py-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Droplet className="size-3.5" />
              Blood
            </div>
            <div className="mt-1 font-medium">{patient.bloodGroup}</div>
          </div>
        ) : null}
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        <div className="text-[11px] font-semibold uppercase text-muted-foreground">Active encounter</div>
        {patient.activeEncounter ? (
          <div className="rounded border border-border bg-background p-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-semibold text-primary">{patient.activeEncounter.encounterNo}</span>
              <ClinicalBadge label={patient.activeEncounter.type} severity="info" />
            </div>
            <div className="mt-2 grid gap-1 text-muted-foreground">
              <StatusIndicator label={patient.activeEncounter.status.replaceAll("_", " ")} tone="idle" />
              <span className="flex items-center gap-1.5">
                <BedDouble className="size-3.5" />
                {[patient.activeEncounter.ward, patient.activeEncounter.bed].filter(Boolean).join(" / ") || "No bed assigned"}
              </span>
              {patient.activeEncounter.attendingDoctor ? <span>{patient.activeEncounter.attendingDoctor}</span> : null}
            </div>
          </div>
        ) : (
          <div className="rounded border border-dashed border-border bg-background p-2 text-xs text-muted-foreground">No active encounter</div>
        )}
      </div>

      <div className="space-y-2 border-t border-border pt-3">
        <div className="text-[11px] font-semibold uppercase text-muted-foreground">Risks and allergies</div>
        {patient.allergies.length || patient.flags.length ? (
          <div className="grid gap-1.5">
            {patient.allergies.map((allergy) => (
              <div key={allergy.substance} className="flex items-center gap-2 rounded border border-border bg-background px-2 py-1.5">
                <AlertTriangle className="size-3.5 text-amber-500" />
                <ClinicalBadge label={allergy.substance} severity={allergy.severity === "CRITICAL" ? "critical" : "warning"} />
              </div>
            ))}
            {patient.flags.map((flag) => (
              <div key={flag.label} className="flex items-center gap-2 rounded border border-border bg-background px-2 py-1.5">
                <ShieldAlert className="size-3.5 text-primary" />
                <ClinicalBadge label={flag.label} severity={flag.severity === "CRITICAL" ? "critical" : flag.severity === "HIGH" ? "warning" : "info"} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded border border-border bg-background px-2 py-1.5 text-xs text-muted-foreground">No active flags recorded</div>
        )}
      </div>

      {patient.insurance ? (
        <div className="space-y-2 border-t border-border pt-3">
          <div className="text-[11px] font-semibold uppercase text-muted-foreground">Insurance</div>
          <div className="rounded border border-border bg-background p-2 text-xs">
            <div className="flex items-center gap-2 font-medium">
              <BadgeCheck className="size-3.5 text-primary" />
              {patient.insurance.payerName}
            </div>
            <div className="mt-1 text-muted-foreground">{patient.insurance.policyNumber}</div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
