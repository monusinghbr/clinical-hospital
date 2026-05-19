import { logger } from "@/lib/logger";

export type ActivityEventName =
  | "patient.context.changed"
  | "encounter.context.changed"
  | "audit.recorded"
  | "notification.queued"
  | "realtime.published"
  | "file.uploaded";

export type ActivityEvent<TPayload = Record<string, unknown>> = {
  name: ActivityEventName;
  hospitalId?: string;
  actorId?: string;
  patientId?: string;
  encounterId?: string;
  payload: TPayload;
  occurredAt: Date;
};

type ActivityHandler = (event: ActivityEvent) => Promise<void> | void;

const handlers = new Set<ActivityHandler>();

export function subscribeActivity(handler: ActivityHandler) {
  handlers.add(handler);
  return () => handlers.delete(handler);
}

export async function publishActivity(event: Omit<ActivityEvent, "occurredAt">) {
  const normalizedEvent: ActivityEvent = {
    ...event,
    occurredAt: new Date(),
  };

  logger.info("activity.event", {
    name: normalizedEvent.name,
    hospitalId: normalizedEvent.hospitalId,
    patientId: normalizedEvent.patientId,
    encounterId: normalizedEvent.encounterId,
  });

  await Promise.all(Array.from(handlers).map((handler) => handler(normalizedEvent)));
  return normalizedEvent;
}
