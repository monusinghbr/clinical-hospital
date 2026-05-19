export type UserRole =
  | "SUPER_ADMIN"
  | "HOSPITAL_ADMIN"
  | "DOCTOR"
  | "NURSE"
  | "RECEPTIONIST"
  | "PHARMACIST"
  | "LAB_TECHNICIAN"
  | "RADIOLOGIST"
  | "BILLING_STAFF"
  | "ICU_STAFF"
  | "PATIENT";

export type Sex = "MALE" | "FEMALE" | "OTHER" | "UNKNOWN";
export type EncounterType = "OPD" | "IPD" | "EMERGENCY" | "ICU" | "DAYCARE";
export type EncounterStatus = "REGISTERED" | "TRIAGED" | "IN_CONSULTATION" | "ADMITTED" | "ON_HOLD" | "DISCHARGE_PLANNED" | "DISCHARGED" | "CANCELLED";
export type AlertSeverity = "INFO" | "WARNING" | "HIGH" | "CRITICAL";
