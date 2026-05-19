export const clinicalEnvironment = {
  workspaceName: "St. Mary's Clinical Network",
  hospitalCode: "SMCN",
  region: "AP-SOUTH-1",
  environment: "Production Clinical Cluster",
  compliance: ["HIPAA Ready", "NABH Ready", "Audit Retention Active"],
  uptime: "99.98%",
  securityZone: "Clinical Protected Zone",
} as const;

export const clinicalModules = [
  "Patient Registry",
  "OPD Consultation",
  "Admissions",
  "Nursing Worklist",
  "Vitals Monitoring",
  "Medication Administration",
  "Laboratory Orders",
  "Radiology Orders",
  "ICU Monitoring",
  "Ward Operations",
  "Discharge Planning",
  "Audit Trail",
] as const;

export const encounterStatuses = {
  REGISTERED: "Registered",
  TRIAGED: "Triaged",
  IN_CONSULTATION: "In consultation",
  ADMITTED: "Admitted",
  ON_HOLD: "On hold",
  DISCHARGE_PLANNED: "Discharge planned",
  DISCHARGED: "Discharged",
  CANCELLED: "Cancelled",
} as const;

export const acuityLevels = {
  ROUTINE: { label: "Routine", priority: 1 },
  URGENT: { label: "Urgent", priority: 2 },
  HIGH_RISK: { label: "High risk", priority: 3 },
  STAT: { label: "STAT", priority: 4 },
  CODE: { label: "Code response", priority: 5 },
} as const;

export const vitalRanges = {
  pulseBpm: { low: 50, high: 120, unit: "bpm" },
  respiratoryRate: { low: 10, high: 24, unit: "/min" },
  systolicBp: { low: 90, high: 160, unit: "mmHg" },
  spo2Percent: { low: 94, high: 100, unit: "%" },
  temperatureC: { low: 35.5, high: 38, unit: "C" },
} as const;
