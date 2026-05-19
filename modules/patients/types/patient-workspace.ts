import type { AlertSeverity, EncounterStatus, EncounterType, Sex } from "@/lib/generated/prisma/client";

export type PatientSearchResult = {
  id: string;
  uhid: string;
  name: string;
  ageSex: string;
  phone?: string;
  bloodGroup?: string;
  activeEncounter?: {
    id: string;
    encounterNo: string;
    type: EncounterType;
    status: EncounterStatus;
    ward?: string;
    bed?: string;
  };
  alertCount: number;
  flags: Array<{ label: string; severity: AlertSeverity }>;
};

export type PatientWorkspaceSummary = {
  id: string;
  uhid: string;
  name: string;
  sex: Sex;
  ageSex: string;
  phone?: string;
  email?: string;
  bloodGroup?: string;
  address?: string;
  allergies: Array<{ substance: string; reaction?: string; severity: AlertSeverity }>;
  flags: Array<{ label: string; severity: AlertSeverity; category: string }>;
  insurance?: { payerName: string; policyNumber: string; planName?: string; verified: boolean };
  activeEncounter?: {
    id: string;
    encounterNo: string;
    type: EncounterType;
    status: EncounterStatus;
    attendingDoctor?: string;
    ward?: string;
    bed?: string;
    triageAcuity?: string;
  };
};

export type PatientTimelineEntry = {
  id: string;
  occurredAt: string;
  eventType: string;
  title: string;
  summary?: string;
  severity: AlertSeverity;
  source: string;
};
