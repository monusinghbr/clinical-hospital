import type { UserRole } from "@/types/clinical";

export type Permission =
  | "system.manage"
  | "hospital.manage"
  | "patients.read"
  | "patients.write"
  | "encounters.read"
  | "encounters.write"
  | "opd.consult"
  | "ipd.manage"
  | "nursing.chart"
  | "vitals.write"
  | "prescriptions.write"
  | "lab.orders"
  | "lab.results"
  | "radiology.orders"
  | "radiology.reports"
  | "billing.manage"
  | "icu.monitor"
  | "discharge.write"
  | "audit.read";

const allPermissions: Permission[] = [
  "system.manage",
  "hospital.manage",
  "patients.read",
  "patients.write",
  "encounters.read",
  "encounters.write",
  "opd.consult",
  "ipd.manage",
  "nursing.chart",
  "vitals.write",
  "prescriptions.write",
  "lab.orders",
  "lab.results",
  "radiology.orders",
  "radiology.reports",
  "billing.manage",
  "icu.monitor",
  "discharge.write",
  "audit.read",
];

export const demoUserRole: UserRole = "SUPER_ADMIN";

export const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: allPermissions,
  HOSPITAL_ADMIN: allPermissions.filter((permission) => permission !== "system.manage"),
  DOCTOR: [
    "patients.read",
    "encounters.read",
    "encounters.write",
    "opd.consult",
    "ipd.manage",
    "vitals.write",
    "prescriptions.write",
    "lab.orders",
    "radiology.orders",
    "discharge.write",
  ],
  NURSE: ["patients.read", "encounters.read", "nursing.chart", "vitals.write", "icu.monitor"],
  RECEPTIONIST: ["patients.read", "patients.write", "encounters.read", "encounters.write"],
  PHARMACIST: ["patients.read", "encounters.read", "prescriptions.write"],
  LAB_TECHNICIAN: ["patients.read", "encounters.read", "lab.orders", "lab.results"],
  RADIOLOGIST: ["patients.read", "encounters.read", "radiology.orders", "radiology.reports"],
  BILLING_STAFF: ["patients.read", "encounters.read", "billing.manage"],
  ICU_STAFF: ["patients.read", "encounters.read", "nursing.chart", "vitals.write", "icu.monitor"],
  PATIENT: ["patients.read"],
};

export const demoPermissions = rolePermissions[demoUserRole];

export function resolvePermissions(role: UserRole, grants: string[] = []): Permission[] {
  return Array.from(new Set([...rolePermissions[role], ...grants.filter(isPermission)]));
}

export function isPermission(value: string): value is Permission {
  return allPermissions.includes(value as Permission);
}
