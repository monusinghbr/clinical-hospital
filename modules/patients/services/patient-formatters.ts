import { differenceInYears, format } from "date-fns";

import type { Sex } from "@/lib/generated/prisma/client";

export function patientDisplayName(patient: { firstName: string; middleName?: string | null; lastName: string }) {
  return [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ");
}

export function patientAgeSex(dateOfBirth: Date | null | undefined, sex: Sex) {
  const age = dateOfBirth ? `${differenceInYears(new Date(), dateOfBirth)}y` : "Age unknown";
  return `${age} / ${sexLabel(sex)}`;
}

export function sexLabel(sex: Sex) {
  return sex === "UNKNOWN" ? "Unknown sex" : sex[0] + sex.slice(1).toLowerCase();
}

export function formatTimelineTime(value: Date) {
  return format(value, "dd MMM yyyy, HH:mm");
}
