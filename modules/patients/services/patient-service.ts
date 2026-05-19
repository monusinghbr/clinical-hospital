import { Prisma } from "@/lib/generated/prisma/client";
import { formatUhid } from "@/lib/utils";
import { prisma } from "@/server/db/prisma";
import { publishActivity } from "@/server/events/activity-event-bus";
import { realtimeEvents, publishRealtimeEvent } from "@/server/realtime";
import type { PatientRegistrationInput, PatientSearchInput } from "@/modules/patients/validation/patient-schemas";
import { formatTimelineTime, patientAgeSex, patientDisplayName } from "@/modules/patients/services/patient-formatters";
import type { PatientSearchResult, PatientTimelineEntry, PatientWorkspaceSummary } from "@/modules/patients/types/patient-workspace";

export async function searchPatients(hospitalId: string, input: PatientSearchInput): Promise<PatientSearchResult[]> {
  const query = input.q.trim();
  const where: Prisma.PatientWhereInput = {
    hospitalId,
    deletedAt: null,
    OR:
      input.mode === "uhid"
        ? [{ uhid: { contains: query, mode: "insensitive" } }]
        : input.mode === "phone"
          ? [{ phone: { contains: query, mode: "insensitive" } }]
          : input.mode === "encounter"
            ? [{ encounters: { some: { encounterNo: { contains: query, mode: "insensitive" } } } }]
            : [
                { uhid: { contains: query, mode: "insensitive" } },
                { phone: { contains: query, mode: "insensitive" } },
                { firstName: { contains: query, mode: "insensitive" } },
                { lastName: { contains: query, mode: "insensitive" } },
                { encounters: { some: { encounterNo: { contains: query, mode: "insensitive" } } } },
              ],
  };

  const patients = await prisma.patient.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }],
    take: 12,
    include: {
      flags: { where: { active: true }, take: 3 },
      alerts: { where: { active: true }, take: 3 },
      encounters: {
        orderBy: { startedAt: "desc" },
        take: 1,
        include: { ward: true, bed: true },
      },
    },
  });

  return patients.map((patient) => {
    const activeEncounter = patient.encounters[0];
    return {
      id: patient.id,
      uhid: patient.uhid,
      name: patientDisplayName(patient),
      ageSex: patientAgeSex(patient.dateOfBirth, patient.sex),
      phone: patient.phone ?? undefined,
      bloodGroup: patient.bloodGroup ?? undefined,
      alertCount: patient.alerts.length,
      flags: patient.flags.map((flag) => ({ label: flag.label, severity: flag.severity })),
      activeEncounter: activeEncounter
        ? {
            id: activeEncounter.id,
            encounterNo: activeEncounter.encounterNo,
            type: activeEncounter.type,
            status: activeEncounter.status,
            ward: activeEncounter.ward?.name,
            bed: activeEncounter.bed?.code,
          }
        : undefined,
    };
  });
}

export async function getRecentPatients(hospitalId: string): Promise<PatientSearchResult[]> {
  const patients = await prisma.patient.findMany({
    where: { hospitalId, deletedAt: null },
    orderBy: [{ updatedAt: "desc" }],
    take: 8,
    include: {
      flags: { where: { active: true }, take: 3 },
      alerts: { where: { active: true }, take: 3 },
      encounters: { orderBy: { startedAt: "desc" }, take: 1, include: { ward: true, bed: true } },
    },
  });

  return patients.map((patient) => {
    const activeEncounter = patient.encounters[0];
    return {
      id: patient.id,
      uhid: patient.uhid,
      name: patientDisplayName(patient),
      ageSex: patientAgeSex(patient.dateOfBirth, patient.sex),
      phone: patient.phone ?? undefined,
      bloodGroup: patient.bloodGroup ?? undefined,
      alertCount: patient.alerts.length,
      flags: patient.flags.map((flag) => ({ label: flag.label, severity: flag.severity })),
      activeEncounter: activeEncounter
        ? {
            id: activeEncounter.id,
            encounterNo: activeEncounter.encounterNo,
            type: activeEncounter.type,
            status: activeEncounter.status,
            ward: activeEncounter.ward?.name,
            bed: activeEncounter.bed?.code,
          }
        : undefined,
    };
  });
}

export async function registerPatient(hospitalId: string, actorId: string, input: PatientRegistrationInput) {
  const hospital = await prisma.hospital.findUnique({ where: { id: hospitalId }, select: { code: true } });
  const patientCount = await prisma.patient.count({ where: { hospitalId } });
  const uhid = formatUhid(patientCount + 1, hospital?.code ?? "HMS");

  const patient = await prisma.patient.create({
    data: {
      hospitalId,
      uhid,
      firstName: input.mode === "unknown" ? "Unknown" : input.firstName ?? "",
      middleName: input.middleName,
      lastName: input.mode === "unknown" ? "Patient" : input.lastName ?? "",
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
      sex: input.sex,
      phone: input.phone,
      email: input.email || undefined,
      bloodGroup: input.bloodGroup,
      contacts:
        input.emergencyContactName && input.emergencyContactPhone
          ? {
              create: {
                name: input.emergencyContactName,
                phone: input.emergencyContactPhone,
                relation: input.mode === "emergency" ? "Emergency contact" : "Relative",
                isPrimary: true,
              },
            }
          : undefined,
      insurances:
        input.insurancePayerName && input.insurancePolicyNumber
          ? {
              create: {
                payerName: input.insurancePayerName,
                policyNumber: input.insurancePolicyNumber,
                priority: 1,
              },
            }
          : undefined,
      flags:
        input.mode === "emergency"
          ? {
              create: {
                code: "EMERGENCY_REGISTRATION",
                label: "Emergency registration",
                severity: "HIGH",
                category: "REGISTRATION",
                source: "registration-flow",
              },
            }
          : undefined,
      clinicalEvents: {
        create: {
          hospitalId,
          eventType: "patient.registered",
          title: "Patient registered",
          summary: `${input.mode.replace("_", " ")} intake completed`,
          severity: input.mode === "emergency" ? "HIGH" : "INFO",
          source: "patient-registration",
          metadata: { mode: input.mode },
        },
      },
    },
  });

  await publishActivity({
    name: "patient.context.changed",
    hospitalId,
    actorId,
    patientId: patient.id,
    payload: { uhid: patient.uhid, mode: input.mode },
  });

  await publishRealtimeEvent({
    hospitalId,
    topic: "patient-updates",
    event: realtimeEvents.patientUpdated,
    payload: { patientId: patient.id, uhid: patient.uhid },
  });

  return patient;
}

export async function getPatientWorkspace(hospitalId: string, patientId: string): Promise<PatientWorkspaceSummary | null> {
  const patient = await prisma.patient.findFirst({
    where: { id: patientId, hospitalId, deletedAt: null },
    include: {
      allergies: { orderBy: { recordedAt: "desc" } },
      flags: { where: { active: true }, orderBy: { createdAt: "desc" } },
      insurances: { orderBy: { priority: "asc" }, take: 1 },
      encounters: {
        orderBy: { startedAt: "desc" },
        take: 1,
        include: { attendingDoctor: true, ward: true, bed: true },
      },
    },
  });

  if (!patient) {
    return null;
  }

  const activeEncounter = patient.encounters[0];
  const insurance = patient.insurances[0];

  return {
    id: patient.id,
    uhid: patient.uhid,
    name: patientDisplayName(patient),
    sex: patient.sex,
    ageSex: patientAgeSex(patient.dateOfBirth, patient.sex),
    phone: patient.phone ?? undefined,
    email: patient.email ?? undefined,
    bloodGroup: patient.bloodGroup ?? undefined,
    address: [patient.addressLine1, patient.city, patient.state].filter(Boolean).join(", ") || undefined,
    allergies: patient.allergies.map((allergy) => ({
      substance: allergy.substance,
      reaction: allergy.reaction ?? undefined,
      severity: allergy.severity,
    })),
    flags: patient.flags.map((flag) => ({ label: flag.label, severity: flag.severity, category: flag.category })),
    insurance: insurance
      ? {
          payerName: insurance.payerName,
          policyNumber: insurance.policyNumber,
          planName: insurance.planName ?? undefined,
          verified: Boolean(insurance.verifiedAt),
        }
      : undefined,
    activeEncounter: activeEncounter
      ? {
          id: activeEncounter.id,
          encounterNo: activeEncounter.encounterNo,
          type: activeEncounter.type,
          status: activeEncounter.status,
          attendingDoctor: activeEncounter.attendingDoctor?.name,
          ward: activeEncounter.ward?.name,
          bed: activeEncounter.bed?.code,
          triageAcuity: activeEncounter.triageAcuity ?? undefined,
        }
      : undefined,
  };
}

export async function getPatientTimeline(hospitalId: string, patientId: string): Promise<PatientTimelineEntry[]> {
  const events = await prisma.clinicalEvent.findMany({
    where: { hospitalId, patientId },
    orderBy: { occurredAt: "desc" },
    take: 50,
  });

  return events.map((event) => ({
    id: event.id,
    occurredAt: formatTimelineTime(event.occurredAt),
    eventType: event.eventType,
    title: event.title,
    summary: event.summary ?? undefined,
    severity: event.severity,
    source: event.source,
  }));
}
