import { AlertTriangle } from "lucide-react";

import { AlertBanner } from "@/components/clinical/alert-banner";
import { PatientSearchWorkspace } from "@/modules/patients/components/patient-search-workspace";
import { getRecentPatients } from "@/modules/patients/services/patient-service";
import type { PatientSearchResult } from "@/modules/patients/types/patient-workspace";
import { requirePermission } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";

export default async function PatientsPage() {
  const session = await getSession();
  requirePermission(session, "patients.read");

  let recentPatients: PatientSearchResult[] = [];
  let unavailable = false;

  if (session.user.hospitalId) {
    try {
      recentPatients = await getRecentPatients(session.user.hospitalId);
    } catch {
      unavailable = true;
    }
  }

  return (
    <>
      {unavailable ? (
        <div className="mx-auto max-w-[1600px] px-4 pt-4">
          <AlertBanner
            title="Clinical database unavailable"
            detail="Patient search UI is ready, but Supabase/PostgreSQL credentials are not connected in this environment."
            severity="warning"
          />
        </div>
      ) : null}
      {!session.user.hospitalId ? (
        <div className="mx-auto max-w-[1600px] px-4 pt-4">
          <AlertBanner title="No hospital context" detail="Assign a hospital membership before patient search can return records." severity="critical" />
        </div>
      ) : null}
      <PatientSearchWorkspace recentPatients={recentPatients} />
      {unavailable ? <AlertTriangle className="sr-only" /> : null}
    </>
  );
}
