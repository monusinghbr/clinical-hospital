export type WorkspaceView =
  | "overview"
  | "patients"
  | "opd"
  | "admissions"
  | "nursing"
  | "vitals"
  | "medications"
  | "lab"
  | "radiology"
  | "icu"
  | "wards"
  | "discharge"
  | "schedules"
  | "alerts"
  | "escalation"
  | "or"
  | "pharmacy"
  | "handoff"
  | "documentation"
  | "command"
  | "audit";

export type Acuity = "routine" | "watch" | "urgent" | "critical";

export type WorkspacePatient = {
  id: string;
  uhid: string;
  name: string;
  ageSex: string;
  bloodGroup: string;
  phone: string;
  ward: string;
  bed: string;
  doctor: string;
  encounter: string;
  status: string;
  acuity: Acuity;
  allergies: string[];
  flags: string[];
  insurance: string;
  lastEvent: string;
  vitals: {
    temp: string;
    pulse: string;
    bp: string;
    spo2: string;
    rr: string;
  };
  activeOrders: number;
  pendingTasks: number;
};

export type WorkspaceEvent = {
  id: string;
  time: string;
  type: string;
  patientId: string;
  title: string;
  summary: string;
  acuity: Acuity;
  source: string;
};

export type WardUnit = {
  id: string;
  name: string;
  occupancy: number;
  capacity: number;
  critical: number;
  nurseLead: string;
  sync: "synced" | "degraded" | "offline";
};

export type OrderQueueItem = {
  id: string;
  queue: "Lab" | "Radiology" | "Medication" | "Nursing" | "Discharge";
  patientId: string;
  label: string;
  status: string;
  priority: Acuity;
  eta: string;
};

export type IcuBed = {
  id: string;
  bed: string;
  patientId?: string;
  patientName: string;
  severity: Acuity;
  ventilator: "none" | "invasive" | "non-invasive" | "standby";
  nurse: string;
  rhythm: string;
  map: number;
  spo2: number;
  infusion: string;
  hr?: number;
  rr?: number;
  temp?: number;
  icp?: number;
  ventilatorMode?: string;
  oxygenFlow?: string;
  sedationScore?: string;
  alarmState?: "acknowledged" | "active" | "fatigue" | "disconnect";
};

export type HospitalMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: Acuity;
};

export type CommandAction = {
  id: string;
  label: string;
  hint: string;
  group: "Patient" | "Ward" | "Emergency" | "Orders" | "Navigation" | "Operations";
  view?: WorkspaceView;
  patientId?: string;
  action?: string;
};

export type MedicationAdministration = {
  id: string;
  patientId: string;
  medication: string;
  dose: string;
  route: string;
  schedule: string;
  due: string;
  status: "due" | "administered" | "held" | "late";
  nurse: string;
  warning?: string;
};

export type OrderSet = {
  id: string;
  name: string;
  specialty: string;
  priority: Acuity;
  items: string[];
};

export type RadiologyStudy = {
  id: string;
  patientId: string;
  accession: string;
  modality: "XR" | "CT" | "MRI" | "US" | "ECHO";
  study: string;
  status: "ordered" | "protocolled" | "in-progress" | "reported" | "critical";
  radiologist: string;
  timestamp: string;
  impression: string;
};

export type EncounterOption = {
  id: string;
  patientId: string;
  label: string;
  location: string;
  attending: string;
  status: string;
};

export type EmergencyIncident = {
  id: string;
  protocol: "CODE BLUE" | "RAPID RESPONSE" | "TRAUMA" | "STROKE" | "SEPSIS" | "ICU DETERIORATION";
  patientId: string;
  location: string;
  status: "paging" | "assembling" | "intervention" | "handoff";
  countdown: string;
  severity: Acuity;
  route: string;
  overheadPage: string;
  responders: Array<{ role: string; name: string; eta: string; state: "paged" | "enroute" | "arrived" }>;
  interventions: Array<{ time: string; label: string; actor: string }>;
};

export type ORCase = {
  id: string;
  room: string;
  patient: string;
  procedure: string;
  status: "PREP" | "INDUCTION" | "INCISION" | "CLOSING" | "RECOVERY" | "TURNOVER";
  surgeon: string;
  anesthetist: string;
  elapsed: string;
  turnover: string;
  sterilePrep: "pending" | "ready" | "break";
  alert?: string;
};

export type BedFlowItem = {
  id: string;
  unit: string;
  bed: string;
  patient: string;
  state: "transfer-requested" | "cleaning" | "isolation" | "boarding" | "discharge-pending" | "ready";
  eta: string;
  pressure: Acuity;
  blocker: string;
};

export type PharmacyQueueItem = {
  id: string;
  patientId: string;
  medication: string;
  status: "VERIFYING" | "COMPOUNDING" | "DISPENSED" | "HELD" | "INTERVENTION" | "STAT";
  risk: Acuity;
  queue: "STAT" | "IV room" | "Clinical check" | "Narcotics" | "Discharge";
  safety: string;
  eta: string;
};

export type NursingAssignment = {
  id: string;
  nurse: string;
  unit: string;
  load: string;
  pressure: Acuity;
  outgoingSummary: string;
  incomingAck: string;
  tasks: string[];
};

export type ClinicalDocSnippet = {
  id: string;
  label: string;
  shortcut: string;
  content: string;
};

export type StaffingZone = {
  id: string;
  unit: string;
  required: number;
  assigned: number;
  acuityLoad: string;
  pressure: Acuity;
};

export type DepartmentSignal = {
  id: string;
  unit: string;
  signal: string;
  queue: string;
  owner: string;
  sla: string;
  pressure: Acuity;
};

export type SystemTrace = {
  id: string;
  time: string;
  source: string;
  message: string;
  pressure: Acuity;
};

export type WorkstationWindow = {
  id: string;
  title: string;
  mode: "telemetry" | "orders" | "handoff" | "infrastructure";
  status: string;
  pressure: Acuity;
  lines: string[];
};
