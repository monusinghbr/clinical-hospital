import type { PatientTimelineEntry, PatientWorkspaceSummary } from "@/modules/patients/types/patient-workspace";

export const emptyPatientTimeline: PatientTimelineEntry[] = [];

export const unavailablePatientWorkspace: PatientWorkspaceSummary = {
  id: "unavailable",
  uhid: "NO-CONTEXT",
  name: "No patient selected",
  sex: "UNKNOWN",
  ageSex: "No active context",
  allergies: [],
  flags: [],
};
