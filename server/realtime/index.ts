import { env } from "@/config/env";

export type RealtimeTopic =
  | "patient-updates"
  | "nurse-alerts"
  | "consultation-sync"
  | "emergency-alerts"
  | "ward-updates";

export const realtimeEvents = {
  patientUpdated: "clinical.patient.updated",
  patientAlertRaised: "clinical.patient-alert.raised",
  encounterUpdated: "clinical.encounter.updated",
  vitalsRecorded: "clinical.vitals.recorded",
  labCriticalResulted: "clinical.lab.critical-resulted",
  radiologyCriticalReported: "clinical.radiology.critical-reported",
  bedStatusChanged: "clinical.bed.status-changed",
  emergencyEscalated: "clinical.emergency.escalated",
} as const;

export type RealtimeEventName = (typeof realtimeEvents)[keyof typeof realtimeEvents];

export type RealtimeEvent<TPayload = Record<string, unknown>> = {
  topic: RealtimeTopic;
  event: RealtimeEventName;
  payload: TPayload;
  hospitalId: string;
};

export async function publishRealtimeEvent(event: RealtimeEvent) {
  if (env.NEXT_PUBLIC_REALTIME_PROVIDER === "none") {
    return { delivered: false, provider: "none" };
  }

  return {
    delivered: true,
    provider: env.NEXT_PUBLIC_REALTIME_PROVIDER,
    topic: event.topic,
  };
}
