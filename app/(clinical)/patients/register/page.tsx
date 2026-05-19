import { Suspense } from "react";

import { LoadingState } from "@/components/clinical/loading-state";
import { PatientRegistrationFlow } from "@/modules/patients/components/patient-registration-flow";
import { requirePermission } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";

export default async function RegisterPatientPage() {
  const session = await getSession();
  requirePermission(session, "patients.write");

  return (
    <Suspense fallback={<LoadingState label="Loading patient registration flow" />}>
      <PatientRegistrationFlow />
    </Suspense>
  );
}
