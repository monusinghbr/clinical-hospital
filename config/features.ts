import type { Permission } from "@/config/permissions";

export type FeatureFlag = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  permission?: Permission;
};

export const featureRegistry = {
  patientContext: {
    key: "patient-context",
    label: "Patient context",
    description: "Maintains the active patient across clinical workflows.",
    enabled: true,
    permission: "patients.read",
  },
  encounterContext: {
    key: "encounter-context",
    label: "Encounter context",
    description: "Tracks active OPD/IPD/ICU treatment state.",
    enabled: true,
    permission: "encounters.read",
  },
  realtimeWardSync: {
    key: "realtime-ward-sync",
    label: "Realtime ward sync",
    description: "Broadcasts patient movement, bed status, and escalation events.",
    enabled: true,
    permission: "ipd.manage",
  },
  icuMonitoring: {
    key: "icu-monitoring",
    label: "ICU monitoring",
    description: "Enables ICU vitals and critical alert event channels.",
    enabled: true,
    permission: "icu.monitor",
  },
  terminologyServices: {
    key: "terminology-services",
    label: "Terminology services",
    description: "Prepares ICD and clinical coding workflows.",
    enabled: true,
    permission: "encounters.write",
  },
} satisfies Record<string, FeatureFlag>;

export function isFeatureEnabled(key: keyof typeof featureRegistry) {
  return featureRegistry[key].enabled;
}
