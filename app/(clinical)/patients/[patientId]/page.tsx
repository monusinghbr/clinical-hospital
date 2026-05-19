import { notFound } from "next/navigation";

import { AlertBanner } from "@/components/clinical/alert-banner";
import { EmptyState } from "@/components/clinical/empty-state";
import { UserRoundX } from "lucide-react";
import { PatientWorkspace } from "@/modules/patients/components/patient-workspace";
import { getPatientTimeline, getPatientWorkspace } from "@/modules/patients/services/patient-service";
import { requirePermission } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";

export default async function PatientWorkspacePage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params;
  const session = await getSession();
  requirePermission(session, "patients.read");

  if (!session.user.hospitalId) {
    return (
      <div className="p-4">
        <AlertBanner title="No hospital context" detail="Assign a hospital membership before opening a patient workspace." severity="critical" />
      </div>
    );
  }

  try {
    const patient = await getPatientWorkspace(session.user.hospitalId, patientId);

    if (!patient) {
      notFound();
    }

    const timeline = await getPatientTimeline(session.user.hospitalId, patientId);
    return <PatientWorkspace patient={patient} timeline={timeline} />;
  } catch {
    return (
      <div className="p-4">
        <EmptyState
          icon={UserRoundX}
          title="Patient workspace unavailable"
          description="The workspace shell is ready, but patient data could not be loaded from the clinical database."
        />
      </div>
    );
  }
}
