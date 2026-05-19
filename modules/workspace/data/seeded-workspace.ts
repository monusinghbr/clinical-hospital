import type {
  BedFlowItem,
  CommandAction,
  ClinicalDocSnippet,
  DepartmentSignal,
  EncounterOption,
  EmergencyIncident,
  HospitalMetric,
  IcuBed,
  MedicationAdministration,
  NursingAssignment,
  OrderQueueItem,
  OrderSet,
  ORCase,
  PharmacyQueueItem,
  RadiologyStudy,
  StaffingZone,
  SystemTrace,
  WardUnit,
  WorkstationWindow,
  WorkspaceEvent,
  WorkspacePatient,
  WorkspaceView,
} from "@/modules/workspace/types/workspace";

export const workspaceViews: Array<{ id: WorkspaceView; label: string; count?: string }> = [
  { id: "overview", label: "Overview" },
  { id: "patients", label: "Patients", count: "186" },
  { id: "opd", label: "OPD", count: "42" },
  { id: "admissions", label: "Admissions", count: "17" },
  { id: "nursing", label: "Nursing", count: "28" },
  { id: "vitals", label: "Vitals", count: "9" },
  { id: "medications", label: "Medications", count: "31" },
  { id: "lab", label: "Lab", count: "64" },
  { id: "radiology", label: "Radiology", count: "13" },
  { id: "icu", label: "ICU", count: "11" },
  { id: "wards", label: "Wards" },
  { id: "or", label: "OR", count: "6" },
  { id: "pharmacy", label: "Pharmacy", count: "19" },
  { id: "handoff", label: "Handoff", count: "28" },
  { id: "documentation", label: "Docs", count: "12" },
  { id: "command", label: "Command", count: "LIVE" },
  { id: "discharge", label: "Discharge", count: "8" },
  { id: "schedules", label: "Schedules" },
  { id: "alerts", label: "Alerts", count: "3" },
  { id: "audit", label: "Audit", count: "LIVE" },
];

export const workspacePatients: WorkspacePatient[] = [
  {
    id: "p-001",
    uhid: "SMCN-00018421",
    name: "Ananya Rao",
    ageSex: "38y / Female",
    bloodGroup: "B+",
    phone: "+91 98765 11002",
    ward: "ICU-2",
    bed: "ICU-2A",
    doctor: "Dr. Meera Iyer",
    encounter: "IPD-24091",
    status: "Sepsis protocol",
    acuity: "critical",
    allergies: ["Penicillin"],
    flags: ["Fall risk", "Critical labs"],
    insurance: "MediShield Corporate",
    lastEvent: "Noradrenaline titrated 8 min ago",
    vitals: { temp: "38.9", pulse: "126", bp: "88/54", spo2: "92", rr: "28" },
    activeOrders: 7,
    pendingTasks: 4,
  },
  {
    id: "p-002",
    uhid: "SMCN-00018410",
    name: "Raghav Menon",
    ageSex: "64y / Male",
    bloodGroup: "O+",
    phone: "+91 98222 44119",
    ward: "Cardiac Ward",
    bed: "CW-14",
    doctor: "Dr. Arvind Shah",
    encounter: "IPD-24076",
    status: "Post PCI observation",
    acuity: "urgent",
    allergies: ["Contrast watch"],
    flags: ["Anticoagulant"],
    insurance: "Star Health",
    lastEvent: "ECG reviewed 14 min ago",
    vitals: { temp: "36.8", pulse: "88", bp: "132/84", spo2: "97", rr: "18" },
    activeOrders: 4,
    pendingTasks: 2,
  },
  {
    id: "p-003",
    uhid: "SMCN-00018398",
    name: "Mary D'Souza",
    ageSex: "72y / Female",
    bloodGroup: "A-",
    phone: "+91 99101 88222",
    ward: "General Ward A",
    bed: "A-22",
    doctor: "Dr. Neel Kapoor",
    encounter: "IPD-24055",
    status: "Pneumonia care plan",
    acuity: "watch",
    allergies: [],
    flags: ["Oxygen therapy"],
    insurance: "Self pay",
    lastEvent: "Nebulization due in 22 min",
    vitals: { temp: "37.7", pulse: "96", bp: "118/72", spo2: "94", rr: "22" },
    activeOrders: 5,
    pendingTasks: 5,
  },
  {
    id: "p-004",
    uhid: "SMCN-00018381",
    name: "Kabir Sethi",
    ageSex: "9y / Male",
    bloodGroup: "AB+",
    phone: "+91 90044 78122",
    ward: "Pediatrics",
    bed: "PED-07",
    doctor: "Dr. Farah Khan",
    encounter: "OPD-88312",
    status: "Dengue observation",
    acuity: "urgent",
    allergies: ["Ibuprofen"],
    flags: ["Pediatric dose"],
    insurance: "Family floater",
    lastEvent: "Platelet count resulted 5 min ago",
    vitals: { temp: "39.1", pulse: "118", bp: "96/60", spo2: "98", rr: "24" },
    activeOrders: 3,
    pendingTasks: 1,
  },
  {
    id: "p-005",
    uhid: "SMCN-00018366",
    name: "Saira Ali",
    ageSex: "29y / Female",
    bloodGroup: "O-",
    phone: "+91 98877 45601",
    ward: "OBG",
    bed: "OB-11",
    doctor: "Dr. Kavya Raman",
    encounter: "IPD-24038",
    status: "Postpartum monitoring",
    acuity: "watch",
    allergies: [],
    flags: ["Rh negative"],
    insurance: "CGHS",
    lastEvent: "Nursing handover complete",
    vitals: { temp: "36.6", pulse: "82", bp: "110/70", spo2: "99", rr: "16" },
    activeOrders: 2,
    pendingTasks: 3,
  },
];

export const workspaceEvents: WorkspaceEvent[] = [
  { id: "e-1", time: "09:42", type: "Critical lab", patientId: "p-001", title: "Lactate 4.2 mmol/L", summary: "Escalated to ICU consultant and sepsis bundle tracker.", acuity: "critical", source: "Lab" },
  { id: "e-2", time: "09:37", type: "Medication", patientId: "p-001", title: "Vasopressor titration", summary: "Noradrenaline adjusted; MAP remains under watch threshold.", acuity: "critical", source: "ICU pump" },
  { id: "e-3", time: "09:31", type: "Radiology", patientId: "p-002", title: "Echo report signed", summary: "EF 45%, cardiology follow-up note pending.", acuity: "urgent", source: "Radiology" },
  { id: "e-4", time: "09:26", type: "Vitals", patientId: "p-003", title: "SpO2 drift", summary: "Oxygen saturation below ward target for two readings.", acuity: "watch", source: "Nursing" },
  { id: "e-5", time: "09:20", type: "Admission", patientId: "p-004", title: "Pediatric dengue observation", summary: "Platelets trending down; repeat CBC scheduled.", acuity: "urgent", source: "OPD" },
  { id: "e-6", time: "09:14", type: "Discharge", patientId: "p-005", title: "Discharge checklist opened", summary: "Medication reconciliation and newborn instructions pending.", acuity: "routine", source: "Ward clerk" },
];

export const wardUnits: WardUnit[] = [
  { id: "w-icu", name: "ICU", occupancy: 11, capacity: 14, critical: 3, nurseLead: "Nurse Lead Asha", sync: "synced" },
  { id: "w-card", name: "Cardiac Ward", occupancy: 31, capacity: 36, critical: 1, nurseLead: "Nurse Lead Robin", sync: "synced" },
  { id: "w-gen-a", name: "General Ward A", occupancy: 42, capacity: 48, critical: 0, nurseLead: "Nurse Lead Preeti", sync: "synced" },
  { id: "w-ped", name: "Pediatrics", occupancy: 18, capacity: 22, critical: 1, nurseLead: "Nurse Lead Imran", sync: "degraded" },
  { id: "w-obg", name: "OBG", occupancy: 24, capacity: 30, critical: 0, nurseLead: "Nurse Lead Lata", sync: "synced" },
];

export const orderQueue: OrderQueueItem[] = [
  { id: "o-1", queue: "Lab", patientId: "p-001", label: "Repeat lactate", status: "STAT draw pending", priority: "critical", eta: "4 min" },
  { id: "o-2", queue: "Medication", patientId: "p-001", label: "Antibiotic dose", status: "Due now", priority: "critical", eta: "Now" },
  { id: "o-3", queue: "Radiology", patientId: "p-002", label: "Portable CXR", status: "Technician assigned", priority: "urgent", eta: "18 min" },
  { id: "o-4", queue: "Nursing", patientId: "p-003", label: "Nebulization", status: "Scheduled", priority: "watch", eta: "22 min" },
  { id: "o-5", queue: "Discharge", patientId: "p-005", label: "Medication reconciliation", status: "Pharmacy review", priority: "routine", eta: "45 min" },
];

export const hospitalMetrics: HospitalMetric[] = [
  { id: "hm-1", label: "Occupancy pressure", value: "84%", detail: "155 / 184 beds", tone: "urgent" },
  { id: "hm-2", label: "Emergency load", value: "18 wait", detail: "4 high-acuity triage", tone: "urgent" },
  { id: "hm-3", label: "ICU saturation", value: "11 / 14", detail: "3 critical, 2 ventilated", tone: "critical" },
  { id: "hm-4", label: "Nurse staffing", value: "92%", detail: "2 floats requested", tone: "watch" },
  { id: "hm-5", label: "Pending discharge", value: "8", detail: "5 before noon target", tone: "routine" },
  { id: "hm-6", label: "Active surgeries", value: "6", detail: "2 recovery holds", tone: "watch" },
];

export const icuBeds: IcuBed[] = [
  { id: "icu-1", bed: "ICU-2A", patientId: "p-001", patientName: "Ananya Rao", severity: "critical", ventilator: "non-invasive", nurse: "Nurse Asha", rhythm: "Sinus tach", map: 61, spo2: 92, infusion: "Norad 0.12", hr: 126, rr: 28, temp: 38.9, icp: 14, ventilatorMode: "NIV PSV", oxygenFlow: "12 L/min", sedationScore: "RASS -1", alarmState: "active" },
  { id: "icu-2", bed: "ICU-2B", patientName: "Reserved", severity: "routine", ventilator: "standby", nurse: "Nurse Asha", rhythm: "No patient", map: 0, spo2: 0, infusion: "None", hr: 0, rr: 0, temp: 0, icp: 0, ventilatorMode: "Standby", oxygenFlow: "--", sedationScore: "--", alarmState: "acknowledged" },
  { id: "icu-3", bed: "ICU-3A", patientName: "Dev Malhotra", severity: "critical", ventilator: "invasive", nurse: "Nurse Priya", rhythm: "AF", map: 68, spo2: 95, infusion: "Propofol", hr: 132, rr: 18, temp: 37.9, icp: 18, ventilatorMode: "AC/VC", oxygenFlow: "FiO2 55%", sedationScore: "RASS -3", alarmState: "fatigue" },
  { id: "icu-4", bed: "ICU-3B", patientName: "Helen Mathew", severity: "urgent", ventilator: "none", nurse: "Nurse Priya", rhythm: "NSR", map: 74, spo2: 96, infusion: "Insulin", hr: 102, rr: 22, temp: 37.4, icp: 11, ventilatorMode: "Room air", oxygenFlow: "2 L/min", sedationScore: "Alert", alarmState: "acknowledged" },
  { id: "icu-5", bed: "ICU-4A", patientName: "Omkar Das", severity: "watch", ventilator: "none", nurse: "Nurse Imran", rhythm: "NSR", map: 82, spo2: 98, infusion: "None", hr: 84, rr: 16, temp: 36.8, icp: 9, ventilatorMode: "Room air", oxygenFlow: "--", sedationScore: "Alert", alarmState: "acknowledged" },
  { id: "icu-6", bed: "ICU-4B", patientName: "Rina Paul", severity: "critical", ventilator: "invasive", nurse: "Nurse Lata", rhythm: "VT watch", map: 59, spo2: 91, infusion: "Amiodarone", hr: 148, rr: 30, temp: 38.4, icp: 22, ventilatorMode: "SIMV", oxygenFlow: "FiO2 70%", sedationScore: "RASS -4", alarmState: "disconnect" },
];

export const liveEventTemplates: Omit<WorkspaceEvent, "id" | "time">[] = [
  { type: "Nursing", patientId: "p-003", title: "Shift assessment updated", summary: "Respiratory watch marker carried forward to next observation block.", acuity: "watch", source: "Nurse station" },
  { type: "Medication", patientId: "p-002", title: "Medication due", summary: "Antiplatelet scheduled dose moved into due-now queue.", acuity: "urgent", source: "eMAR" },
  { type: "ICU alert", patientId: "p-001", title: "MAP below target", summary: "Telemetry packet triggered vasopressor protocol attention.", acuity: "critical", source: "ICU monitor" },
  { type: "Lab", patientId: "p-004", title: "CBC resulted", summary: "Platelets updated and pediatric dengue watch remains active.", acuity: "urgent", source: "Lab analyzer" },
  { type: "Transfer", patientId: "p-005", title: "Bed cleaning complete", summary: "OBG bed turnover ready for next admission.", acuity: "routine", source: "Ward ops" },
  { type: "Emergency", patientId: "p-001", title: "Rapid response standby", summary: "Escalation route warmed for ICU bedside review.", acuity: "critical", source: "Command center" },
  { type: "OR", patientId: "p-002", title: "OR turnover delay", summary: "PACU hold is blocking cardiac add-on case by 16 minutes.", acuity: "urgent", source: "OR board" },
  { type: "Pharmacy", patientId: "p-001", title: "STAT antibiotic verification", summary: "Allergy override and pharmacist intervention required before dispense.", acuity: "critical", source: "Pharmacy" },
  { type: "Handoff", patientId: "p-003", title: "Unresolved bedside task", summary: "Incoming nurse has not acknowledged oxygen escalation checklist.", acuity: "watch", source: "Shift handoff" },
  { type: "Documentation", patientId: "p-002", title: "SOAP note autosaved", summary: "Chest pain template updated with ICD-ready diagnosis chips.", acuity: "routine", source: "Physician workspace" },
];

export const commandActions: CommandAction[] = [
  { id: "cmd-patient-ananya", group: "Patient", label: "Jump to Ananya Rao", hint: "Open ICU patient context", patientId: "p-001", view: "icu" },
  { id: "cmd-patient-raghav", group: "Patient", label: "Jump to Raghav Menon", hint: "Open cardiac ward context", patientId: "p-002", view: "patients" },
  { id: "cmd-icu", group: "Navigation", label: "Open ICU monitoring board", hint: "Telemetry and ventilator grid", view: "icu" },
  { id: "cmd-command", group: "Navigation", label: "Open hospital command center", hint: "Occupancy, ED, OR, staffing pressure", view: "command" },
  { id: "cmd-or", group: "Operations", label: "Open OR command board", hint: "Active surgeries and turnover control", view: "or" },
  { id: "cmd-pharmacy", group: "Operations", label: "Open pharmacy operations", hint: "STAT meds, IV room, interventions", view: "pharmacy" },
  { id: "cmd-handoff", group: "Operations", label: "Open nursing handoff", hint: "Shift continuity and bedside tasks", view: "handoff" },
  { id: "cmd-docs", group: "Patient", label: "Open physician documentation", hint: "SOAP, smart phrases, coding tags", view: "documentation" },
  { id: "cmd-wards", group: "Ward", label: "Open live ward map", hint: "Occupancy, staffing, bed pressure", view: "wards" },
  { id: "cmd-labs", group: "Orders", label: "Review critical labs", hint: "Pending and resulted lab queue", view: "lab" },
  { id: "cmd-encounter", group: "Patient", label: "Create encounter", hint: "Simulated encounter drawer", action: "Create encounter" },
  { id: "cmd-nurse", group: "Ward", label: "Assign nurse", hint: "Simulated staffing action", action: "Assign nurse" },
  { id: "cmd-bed", group: "Ward", label: "Open ICU bed", hint: "Simulated bed management", action: "Open ICU bed" },
  { id: "cmd-code", group: "Emergency", label: "Trigger Code Blue drill", hint: "Emergency command mode", view: "escalation", action: "Code Blue drill" },
  { id: "cmd-stroke", group: "Emergency", label: "Activate stroke protocol", hint: "CT route, neurology page, thrombolysis timer", view: "escalation", action: "Stroke protocol" },
  { id: "cmd-sepsis", group: "Emergency", label: "Escalate sepsis bundle", hint: "Lactate, cultures, antibiotics, vasopressors", view: "escalation", patientId: "p-001", action: "Sepsis escalation" },
  { id: "cmd-disaster", group: "Emergency", label: "Toggle disaster surge mode", hint: "Regional incident simulation", view: "command", action: "Disaster surge mode" },
  { id: "cmd-chart-review", group: "Patient", label: "Launch chart review", hint: "Search notes, labs, imaging, encounters", view: "patients", action: "Chart review" },
  { id: "cmd-rover", group: "Operations", label: "Open Rover bedside mode", hint: "Medication scan and bedside task overlay", view: "nursing", action: "Rover bedside mode" },
  { id: "cmd-transport", group: "Operations", label: "Assign transport now", hint: "Transfer bottleneck and ETA routing", view: "wards", action: "Assign transport" },
  { id: "cmd-audit", group: "Navigation", label: "Open audit trace viewer", hint: "Chart access, acknowledgements, order lifecycle", view: "audit" },
];

export const encounterOptions: EncounterOption[] = [
  { id: "enc-1", patientId: "p-001", label: "IPD-24091 · ICU", location: "ICU-2A", attending: "Dr. Meera Iyer", status: "Sepsis protocol" },
  { id: "enc-2", patientId: "p-001", label: "OPD-87991 · Prior visit", location: "OPD-3", attending: "Dr. Neel Kapoor", status: "Archived" },
  { id: "enc-3", patientId: "p-002", label: "IPD-24076 · Cardiology", location: "CW-14", attending: "Dr. Arvind Shah", status: "Post PCI" },
  { id: "enc-4", patientId: "p-003", label: "IPD-24055 · Medicine", location: "A-22", attending: "Dr. Neel Kapoor", status: "Pneumonia" },
];

export const medicationAdministrations: MedicationAdministration[] = [
  { id: "mar-1", patientId: "p-001", medication: "Piperacillin/Tazobactam", dose: "4.5 g", route: "IV", schedule: "Q6H", due: "Now", status: "due", nurse: "Nurse Asha", warning: "Penicillin allergy verification required" },
  { id: "mar-2", patientId: "p-001", medication: "Noradrenaline", dose: "0.12 mcg/kg/min", route: "IV infusion", schedule: "Continuous", due: "Running", status: "administered", nurse: "Nurse Asha" },
  { id: "mar-3", patientId: "p-002", medication: "Clopidogrel", dose: "75 mg", route: "PO", schedule: "OD", due: "09:55", status: "late", nurse: "Nurse Robin" },
  { id: "mar-4", patientId: "p-003", medication: "Salbutamol neb", dose: "2.5 mg", route: "Neb", schedule: "Q4H", due: "10:05", status: "due", nurse: "Nurse Preeti" },
  { id: "mar-5", patientId: "p-005", medication: "Ibuprofen", dose: "400 mg", route: "PO", schedule: "TID", due: "Held", status: "held", nurse: "Nurse Lata", warning: "Postpartum bleeding watch" },
];

export const orderSets: OrderSet[] = [
  { id: "os-1", name: "Sepsis 1-hour bundle", specialty: "ICU", priority: "critical", items: ["Blood cultures x2", "Serum lactate repeat", "Broad-spectrum antibiotic", "Fluid challenge", "Vasopressor protocol"] },
  { id: "os-2", name: "Chest pain / ACS", specialty: "Cardiology", priority: "urgent", items: ["ECG stat", "Troponin I serial", "Aspirin", "Clopidogrel", "Echo request"] },
  { id: "os-3", name: "Pneumonia inpatient", specialty: "Medicine", priority: "watch", items: ["CBC", "CRP", "CXR PA/AP", "Oxygen protocol", "Nebulization schedule"] },
  { id: "os-4", name: "Dengue pediatric watch", specialty: "Pediatrics", priority: "urgent", items: ["CBC Q12H", "Fluid balance", "Warning sign checklist", "Paracetamol weight-based"] },
];

export const radiologyStudies: RadiologyStudy[] = [
  { id: "rad-1", patientId: "p-001", accession: "RAD-99182", modality: "XR", study: "Portable chest AP", status: "critical", radiologist: "Dr. Devika Rao", timestamp: "09:48", impression: "Bilateral basal opacities. Line position acceptable. Urgent clinical correlation advised." },
  { id: "rad-2", patientId: "p-002", accession: "ECHO-44102", modality: "ECHO", study: "2D Echo", status: "reported", radiologist: "Dr. Arvind Shah", timestamp: "09:31", impression: "LVEF approximately 45%. Mild regional wall motion abnormality." },
  { id: "rad-3", patientId: "p-003", accession: "XR-88121", modality: "XR", study: "Chest PA", status: "ordered", radiologist: "Unassigned", timestamp: "Due 10:20", impression: "Awaiting acquisition." },
  { id: "rad-4", patientId: "p-004", accession: "US-55201", modality: "US", study: "Abdomen screening", status: "protocolled", radiologist: "Dr. Farah Khan", timestamp: "10:10", impression: "Protocolled for pediatric dengue abdominal assessment." },
];

export const emergencyIncidents: EmergencyIncident[] = [
  {
    id: "inc-1",
    protocol: "ICU DETERIORATION",
    patientId: "p-001",
    location: "ICU-2A",
    status: "intervention",
    countdown: "03:42",
    severity: "critical",
    route: "Lift B -> ICU sterile corridor -> Bed 2A",
    overheadPage: "Rapid response to ICU-2A. Intensivist and respiratory therapy respond now.",
    responders: [
      { role: "Intensivist", name: "Dr. Meera Iyer", eta: "Arrived", state: "arrived" },
      { role: "Respiratory", name: "RT Kunal", eta: "01:12", state: "enroute" },
      { role: "Charge nurse", name: "Nurse Asha", eta: "Arrived", state: "arrived" },
      { role: "Pharmacist", name: "Ritika S", eta: "02:40", state: "enroute" },
    ],
    interventions: [
      { time: "09:52", label: "MAP under 65 for two cycles", actor: "Telemetry engine" },
      { time: "09:53", label: "Noradrenaline titration requested", actor: "ICU nurse" },
      { time: "09:54", label: "ABG and lactate repeat ordered", actor: "Intensivist" },
    ],
  },
  {
    id: "inc-2",
    protocol: "STROKE",
    patientId: "p-002",
    location: "CT route / ED bay 3",
    status: "assembling",
    countdown: "08:10",
    severity: "urgent",
    route: "ED bay 3 -> CT-1 -> stroke bed",
    overheadPage: "Stroke protocol standby. CT and neurology prepare for immediate arrival.",
    responders: [
      { role: "Neurology", name: "Dr. Kavita Sen", eta: "04:20", state: "enroute" },
      { role: "CT tech", name: "Mohan P", eta: "Ready", state: "arrived" },
      { role: "ED nurse", name: "Nurse Robin", eta: "Arrived", state: "arrived" },
    ],
    interventions: [
      { time: "09:49", label: "Last-known-well captured", actor: "ED physician" },
      { time: "09:50", label: "CT slot preempted", actor: "Radiology coordinator" },
    ],
  },
];

export const orCases: ORCase[] = [
  { id: "or-1", room: "OR-01", patient: "S. Nair", procedure: "Lap cholecystectomy", status: "INCISION", surgeon: "Dr. Kabir Bose", anesthetist: "Dr. Lina Roy", elapsed: "01:18", turnover: "32m", sterilePrep: "ready" },
  { id: "or-2", room: "OR-02", patient: "R. Menon", procedure: "Cath lab backup / PCI complication", status: "PREP", surgeon: "Dr. Arvind Shah", anesthetist: "Dr. Om Prakash", elapsed: "00:09", turnover: "STAT", sterilePrep: "pending", alert: "Blood request pending" },
  { id: "or-3", room: "OR-03", patient: "M. Thomas", procedure: "Craniotomy", status: "INDUCTION", surgeon: "Dr. Neel Kapoor", anesthetist: "Dr. Farah Khan", elapsed: "00:31", turnover: "18m", sterilePrep: "ready", alert: "ICP monitor requested" },
  { id: "or-4", room: "OR-04", patient: "K. Devi", procedure: "C-section", status: "CLOSING", surgeon: "Dr. Kavya Raman", anesthetist: "Dr. Lina Roy", elapsed: "00:47", turnover: "24m", sterilePrep: "ready" },
  { id: "or-5", room: "OR-05", patient: "PACU hold", procedure: "Recovery overflow", status: "RECOVERY", surgeon: "PACU", anesthetist: "PACU", elapsed: "00:52", turnover: "Blocked", sterilePrep: "break", alert: "PACU queue saturated" },
  { id: "or-6", room: "OR-06", patient: "Turnover", procedure: "Emergency appendectomy next", status: "TURNOVER", surgeon: "Dr. Kabir Bose", anesthetist: "Dr. Om Prakash", elapsed: "00:14", turnover: "06m", sterilePrep: "pending" },
];

export const bedFlowItems: BedFlowItem[] = [
  { id: "bed-1", unit: "ICU", bed: "ICU-2B", patient: "ED sepsis transfer", state: "ready", eta: "Now", pressure: "critical", blocker: "Intensivist acceptance" },
  { id: "bed-2", unit: "General Ward A", bed: "A-18", patient: "Mary D'Souza", state: "transfer-requested", eta: "23m", pressure: "watch", blocker: "Transport delay" },
  { id: "bed-3", unit: "OBG", bed: "OB-04", patient: "Postpartum admit", state: "cleaning", eta: "11m", pressure: "urgent", blocker: "EVS turnover" },
  { id: "bed-4", unit: "Pediatrics", bed: "PED-09", patient: "Dengue isolation", state: "isolation", eta: "42m", pressure: "urgent", blocker: "Isolation cart" },
  { id: "bed-5", unit: "ED", bed: "Board-07", patient: "Unknown trauma", state: "boarding", eta: "68m", pressure: "critical", blocker: "No monitored bed" },
  { id: "bed-6", unit: "Cardiac Ward", bed: "CW-11", patient: "Discharge lounge", state: "discharge-pending", eta: "35m", pressure: "routine", blocker: "Medication reconciliation" },
];

export const pharmacyQueueItems: PharmacyQueueItem[] = [
  { id: "rx-1", patientId: "p-001", medication: "Piperacillin/Tazobactam IV", status: "INTERVENTION", risk: "critical", queue: "Clinical check", safety: "Penicillin allergy override required", eta: "Now" },
  { id: "rx-2", patientId: "p-001", medication: "Noradrenaline infusion", status: "STAT", risk: "critical", queue: "STAT", safety: "Concentration double-check", eta: "02m" },
  { id: "rx-3", patientId: "p-003", medication: "Salbutamol neb", status: "VERIFYING", risk: "watch", queue: "Clinical check", safety: "Respiratory protocol", eta: "09m" },
  { id: "rx-4", patientId: "p-005", medication: "Discharge analgesics", status: "HELD", risk: "urgent", queue: "Discharge", safety: "Bleeding watch", eta: "45m" },
  { id: "rx-5", patientId: "p-002", medication: "Heparin flush", status: "DISPENSED", risk: "urgent", queue: "Narcotics", safety: "Anticoagulant reconciliation", eta: "Done" },
  { id: "rx-6", patientId: "p-004", medication: "Pediatric paracetamol", status: "COMPOUNDING", risk: "urgent", queue: "IV room", safety: "Weight-based dose", eta: "13m" },
];

export const nursingAssignments: NursingAssignment[] = [
  { id: "n-1", nurse: "Nurse Asha", unit: "ICU-2", load: "2 critical / 1 standby", pressure: "critical", outgoingSummary: "Pressor titration, lactate repeat, allergy override pending.", incomingAck: "Awaiting RT and pharmacist acknowledgement.", tasks: ["ABG result follow-up", "Vasopressor target MAP >65", "Family update after intensivist review"] },
  { id: "n-2", nurse: "Nurse Priya", unit: "ICU-3", load: "1 vent / 1 urgent", pressure: "urgent", outgoingSummary: "AF watch and sedation target stable but alarm count high.", incomingAck: "Incoming nurse accepted ventilator checklist.", tasks: ["Vent bundle", "RASS reassessment", "Central line dressing"] },
  { id: "n-3", nurse: "Nurse Preeti", unit: "Ward A", load: "7 patients / 2 oxygen", pressure: "watch", outgoingSummary: "Pneumonia oxygen drift and nebulization due soon.", incomingAck: "Pending bedside oxygen checklist.", tasks: ["Nebulization", "I/O chart", "Escalation if SpO2 <92"] },
];

export const clinicalDocSnippets: ClinicalDocSnippet[] = [
  { id: "doc-1", label: "Sepsis reassessment", shortcut: ".sepsis1h", content: "Hemodynamics reviewed. Lactate repeat pending. Broad-spectrum antibiotic timing and vasopressor response documented." },
  { id: "doc-2", label: "Chest pain progress", shortcut: ".acsprogress", content: "ECG and troponin trend reviewed. Antiplatelet plan reconciled. Cardiology follow-up documented." },
  { id: "doc-3", label: "Pneumonia ward note", shortcut: ".pnaip", content: "Oxygen requirement, respiratory exam, antibiotic tolerance, and discharge barriers updated." },
  { id: "doc-4", label: "Handoff summary", shortcut: ".handoff", content: "Situation, background, assessment, recommendation, and unresolved bedside tasks summarized for incoming team." },
];

export const staffingZones: StaffingZone[] = [
  { id: "staff-icu", unit: "ICU", required: 12, assigned: 10, acuityLoad: "4 critical / 3 vent", pressure: "critical" },
  { id: "staff-ed", unit: "Emergency", required: 18, assigned: 15, acuityLoad: "21 wait / 5 high acuity", pressure: "critical" },
  { id: "staff-or", unit: "OR", required: 14, assigned: 13, acuityLoad: "6 rooms active", pressure: "watch" },
  { id: "staff-ward", unit: "Ward A", required: 16, assigned: 15, acuityLoad: "2 oxygen watch", pressure: "watch" },
  { id: "staff-ped", unit: "Pediatrics", required: 8, assigned: 7, acuityLoad: "1 dengue urgent", pressure: "urgent" },
];

export const departmentSignals: DepartmentSignal[] = [
  { id: "sig-icu", unit: "ICU", signal: "MAP breach cluster", queue: "3 bedside reviews", owner: "Intensivist", sla: "02m", pressure: "critical" },
  { id: "sig-ed", unit: "Emergency", signal: "ED boarding redline", queue: "5 high-acuity wait", owner: "Flow manager", sla: "07m", pressure: "critical" },
  { id: "sig-lab", unit: "Lab", signal: "Critical result acknowledgements", queue: "6 pending signoffs", owner: "Pathology", sla: "11m", pressure: "urgent" },
  { id: "sig-rad", unit: "Radiology", signal: "Portable imaging backlog", queue: "4 inpatient studies", owner: "Rad control", sla: "18m", pressure: "watch" },
  { id: "sig-or", unit: "OR", signal: "PACU hold blocking turnover", queue: "2 recovery holds", owner: "OR desk", sla: "09m", pressure: "urgent" },
  { id: "sig-rx", unit: "Pharmacy", signal: "STAT verification chain", queue: "2 interventions", owner: "Clinical Rx", sla: "03m", pressure: "critical" },
  { id: "sig-bed", unit: "Bed Ops", signal: "Isolation turnover delay", queue: "3 blocked transfers", owner: "Bed manager", sla: "16m", pressure: "urgent" },
  { id: "sig-nurse", unit: "Nursing", signal: "Shift handoff risk", queue: "7 unresolved tasks", owner: "Charge nurse", sla: "21m", pressure: "watch" },
];

export const systemTrace: SystemTrace[] = [
  { id: "trace-1", time: "09:56:12", source: "ICU-MON", message: "ICU-2A MAP threshold breach persisted for two cycles", pressure: "critical" },
  { id: "trace-2", time: "09:56:18", source: "RX-STAT", message: "Allergy override requested for broad-spectrum antibiotic", pressure: "critical" },
  { id: "trace-3", time: "09:56:23", source: "FLOW", message: "ED boarder matched to ICU-2B pending acceptance", pressure: "urgent" },
  { id: "trace-4", time: "09:56:31", source: "OR-DESK", message: "OR-05 recovery hold blocks turnover slot", pressure: "watch" },
  { id: "trace-5", time: "09:56:42", source: "NURSE-HO", message: "Incoming acknowledgement missing for Ward A oxygen watch", pressure: "watch" },
];

export const workstationWindows: WorkstationWindow[] = [
  { id: "dock-telemetry", title: "Telemetry Watch", mode: "telemetry", status: "2 ACTIVE ALARMS", pressure: "critical", lines: ["ICU-2A MAP 61", "ICU-4B VT watch", "Alarm fatigue 18/hr"] },
  { id: "dock-orders", title: "Order Routing", mode: "orders", status: "11 OPEN", pressure: "urgent", lines: ["Repeat lactate 04m", "Portable CXR assigned", "STAT antibiotic verify"] },
  { id: "dock-handoff", title: "Shift Continuity", mode: "handoff", status: "7 UNRESOLVED", pressure: "watch", lines: ["Ward A oxygen checklist", "ICU family update", "Vent bundle due"] },
  { id: "dock-infra", title: "Infrastructure", mode: "infrastructure", status: "SURGE STANDBY", pressure: "urgent", lines: ["Oxygen manifold B warn", "PACU queue saturated", "Regional incident standby"] },
];
