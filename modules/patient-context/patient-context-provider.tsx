"use client";

import { createContext, useContext, useMemo } from "react";

import { usePatientContextStore } from "@/modules/patient-context/patient-context-store";

const PatientContext = createContext<ReturnType<typeof usePatientContextStore> | null>(null);

export function PatientContextProvider({ children }: { children: React.ReactNode }) {
  const activePatient = usePatientContextStore((state) => state.activePatient);
  const setActivePatient = usePatientContextStore((state) => state.setActivePatient);
  const clearPatientContext = usePatientContextStore((state) => state.clearPatientContext);
  const value = useMemo(
    () => ({ activePatient, setActivePatient, clearPatientContext }),
    [activePatient, setActivePatient, clearPatientContext],
  );

  return <PatientContext.Provider value={value}>{children}</PatientContext.Provider>;
}

export function useActivePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error("useActivePatient must be used inside PatientContextProvider");
  }
  return context;
}
