import { ActiveClinicalRail } from "@/modules/patients/components/active-clinical-rail";
import { PatientContextHydrator } from "@/modules/patients/components/patient-context-hydrator";
import { PatientSummaryPanel } from "@/modules/patients/components/patient-summary-panel";
import { PatientTimelineStream } from "@/modules/patients/components/patient-timeline-stream";
import type { PatientTimelineEntry, PatientWorkspaceSummary } from "@/modules/patients/types/patient-workspace";

export function PatientWorkspace({ patient, timeline }: { patient: PatientWorkspaceSummary; timeline: PatientTimelineEntry[] }) {
  return (
    <div className="mx-auto grid w-full max-w-[1800px] gap-4 p-4 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
      <PatientContextHydrator patient={patient} />
      <PatientSummaryPanel patient={patient} />
      <PatientTimelineStream entries={timeline} />
      <ActiveClinicalRail patient={patient} />
    </div>
  );
}
