"use client";

import { useEffect } from "react";

import { useEncounterContextStore } from "@/modules/encounter-context/encounter-context-store";
import { usePatientContextStore } from "@/modules/patient-context/patient-context-store";
import type { PatientWorkspaceSummary } from "@/modules/patients/types/patient-workspace";

export function PatientContextHydrator({ patient }: { patient: PatientWorkspaceSummary }) {
  const setActivePatient = usePatientContextStore((state) => state.setActivePatient);
  const setActiveEncounter = useEncounterContextStore((state) => state.setActiveEncounter);

  useEffect(() => {
    setActivePatient({
      id: patient.id,
      uhid: patient.uhid,
      name: patient.name,
      ageSex: patient.ageSex,
      alerts: [...patient.allergies.map((allergy) => allergy.substance), ...patient.flags.map((flag) => flag.label)],
    });

    setActiveEncounter(
      patient.activeEncounter
        ? {
            id: patient.activeEncounter.id,
            encounterNo: patient.activeEncounter.encounterNo,
            type: patient.activeEncounter.type,
            status: patient.activeEncounter.status,
            attendingDoctor: patient.activeEncounter.attendingDoctor,
            ward: patient.activeEncounter.ward,
            bed: patient.activeEncounter.bed,
          }
        : null,
    );
  }, [patient, setActiveEncounter, setActivePatient]);

  return null;
}
