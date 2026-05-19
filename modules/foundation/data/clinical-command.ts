import { Activity, BedDouble, BellRing, ClipboardCheck, FileWarning, HeartPulse } from "lucide-react";

export const operationalQueues = [
  {
    title: "Triage handoff",
    description: "Patients waiting for first clinical review",
    icon: ClipboardCheck,
    permission: "encounters.read",
  },
  {
    title: "Nursing surveillance",
    description: "Vitals, medication administration, and handover worklist",
    icon: HeartPulse,
    permission: "nursing.chart",
  },
  {
    title: "Critical alerts",
    description: "STAT lab/radiology and patient safety notifications",
    icon: BellRing,
    permission: "icu.monitor",
  },
  {
    title: "Ward capacity",
    description: "Bed state, isolation needs, and transfer readiness",
    icon: BedDouble,
    permission: "ipd.manage",
  },
  {
    title: "Clinical documentation",
    description: "Unsigned SOAP notes, care plans, and discharge drafts",
    icon: FileWarning,
    permission: "encounters.write",
  },
  {
    title: "Realtime vitals",
    description: "ICU-ready monitoring channel abstraction",
    icon: Activity,
    permission: "vitals.write",
  },
] as const;

export const foundationTimeline = [
  {
    id: "schema",
    time: "Phase 1",
    title: "Clinical data model installed",
    description: "Multi-hospital Prisma schema covers patients, encounters, wards, orders, discharge, notifications, and audit logs.",
    tone: "success" as const,
  },
  {
    id: "auth",
    time: "Phase 1",
    title: "RBAC guardrails active",
    description: "Permissions resolve at API, page, component, and action boundaries.",
    tone: "success" as const,
  },
  {
    id: "next",
    time: "Phase 2",
    title: "Patient registration workspace",
    description: "UHID generation, demographics, insurance, allergies, documents, and longitudinal patient timeline.",
    tone: "neutral" as const,
  },
];
