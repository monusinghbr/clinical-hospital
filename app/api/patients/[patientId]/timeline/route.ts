import { fail, ok } from "@/lib/api-response";
import { getPatientTimeline } from "@/modules/patients/services/patient-service";
import { requirePermission } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";

export async function GET(_request: Request, { params }: { params: Promise<{ patientId: string }> }) {
  try {
    const { patientId } = await params;
    const session = await getSession();
    requirePermission(session, "patients.read");

    if (!session.user.hospitalId) {
      return ok([]);
    }

    return ok(await getPatientTimeline(session.user.hospitalId, patientId));
  } catch (error) {
    return fail(error);
  }
}
