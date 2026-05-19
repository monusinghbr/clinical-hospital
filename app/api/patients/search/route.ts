import { fail, ok } from "@/lib/api-response";
import { patientSearchSchema } from "@/modules/patients/validation/patient-schemas";
import { searchPatients } from "@/modules/patients/services/patient-service";
import { requirePermission } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    requirePermission(session, "patients.read");

    if (!session.user.hospitalId) {
      return ok([]);
    }

    const url = new URL(request.url);
    const input = patientSearchSchema.parse({
      q: url.searchParams.get("q"),
      mode: url.searchParams.get("mode") ?? "all",
    });

    return ok(await searchPatients(session.user.hospitalId, input));
  } catch (error) {
    return fail(error);
  }
}
