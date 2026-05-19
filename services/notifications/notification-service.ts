import { prisma } from "@/server/db/prisma";
import { publishActivity } from "@/server/events/activity-event-bus";
import { publishRealtimeEvent, realtimeEvents } from "@/server/realtime";

export const notificationChannels = {
  inApp: "IN_APP",
  nurseStation: "NURSE_STATION",
  emergency: "EMERGENCY",
  patientPortal: "PATIENT_PORTAL",
  auditOnly: "AUDIT_ONLY",
} as const;

type NotifyInput = {
  hospitalId: string;
  userId?: string;
  title: string;
  message: string;
  priority?: "LOW" | "NORMAL" | "HIGH" | "STAT";
  channel?: (typeof notificationChannels)[keyof typeof notificationChannels];
};

export async function notifyUser(input: NotifyInput) {
  const notification = await prisma.notification.create({
    data: {
      hospitalId: input.hospitalId,
      userId: input.userId,
      title: input.title,
      message: input.message,
      priority: input.priority ?? "NORMAL",
      channel: input.channel ?? notificationChannels.inApp,
    },
  });

  await publishRealtimeEvent({
    hospitalId: input.hospitalId,
    topic: "nurse-alerts",
    event: realtimeEvents.patientAlertRaised,
    payload: { id: notification.id, priority: notification.priority },
  });

  await publishActivity({
    name: "notification.queued",
    hospitalId: input.hospitalId,
    payload: { id: notification.id, priority: notification.priority, channel: notification.channel },
  });

  return notification;
}
