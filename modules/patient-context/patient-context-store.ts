"use client";

import { create } from "zustand";

export type ActivePatientContext = {
  id: string;
  uhid: string;
  name: string;
  ageSex?: string;
  alerts: string[];
};

type PatientContextState = {
  activePatient: ActivePatientContext | null;
  setActivePatient: (patient: ActivePatientContext | null) => void;
  clearPatientContext: () => void;
};

export const usePatientContextStore = create<PatientContextState>((set) => ({
  activePatient: null,
  setActivePatient: (activePatient) => set({ activePatient }),
  clearPatientContext: () => set({ activePatient: null }),
}));
