"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { PatientDraftInput } from "@/modules/patients/validation/patient-schemas";

type PatientDraftState = {
  registrationDraft: PatientDraftInput;
  updateRegistrationDraft: (patch: PatientDraftInput) => void;
  clearRegistrationDraft: () => void;
};

export const usePatientDraftStore = create<PatientDraftState>()(
  persist(
    (set) => ({
      registrationDraft: {},
      updateRegistrationDraft: (patch) =>
        set((state) => ({
          registrationDraft: {
            ...state.registrationDraft,
            ...patch,
            updatedAt: new Date().toISOString(),
          },
        })),
      clearRegistrationDraft: () => set({ registrationDraft: {} }),
    }),
    { name: "clinical-patient-registration-draft" },
  ),
);
