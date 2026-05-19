"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { patientRegistrationSchema } from "@/modules/patients/validation/patient-schemas";
import { registerPatient } from "@/modules/patients/services/patient-service";
import { getSession } from "@/server/auth/session";
import { requirePermission } from "@/server/auth/permissions";
import { withAuditedAction } from "@/server/audit/with-audit";

const auditedPatientRegistration = withAuditedAction({
  action: "patient.register",
  entityType: "Patient",
  permission: "patients.write",
  getEntityId: (_input, output) => output.id,
  handler: async (input: { hospitalId: string; actorId: string; data: FormData }) => {
    const parsed = patientRegistrationSchema.parse(Object.fromEntries(input.data.entries()));
    return registerPatient(input.hospitalId, input.actorId, parsed);
  },
});

export async function registerPatientAction(formData: FormData) {
  const session = await getSession();
  requirePermission(session, "patients.write");

  if (!session.user.hospitalId) {
    throw new Error("No active hospital context");
  }

  const patient = await auditedPatientRegistration({
    hospitalId: session.user.hospitalId,
    actorId: session.user.id,
    data: formData,
  });

  revalidatePath("/patients");
  redirect(`/patients/${patient.id}`);
}
