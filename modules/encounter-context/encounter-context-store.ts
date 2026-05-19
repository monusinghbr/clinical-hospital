"use client";

import { create } from "zustand";

export type ActiveEncounterContext = {
  id: string;
  encounterNo: string;
  type: "OPD" | "IPD" | "EMERGENCY" | "ICU" | "DAYCARE";
  status: string;
  attendingDoctor?: string;
  ward?: string;
  bed?: string;
};

type EncounterContextState = {
  activeEncounter: ActiveEncounterContext | null;
  setActiveEncounter: (encounter: ActiveEncounterContext | null) => void;
  clearEncounterContext: () => void;
};

export const useEncounterContextStore = create<EncounterContextState>((set) => ({
  activeEncounter: null,
  setActiveEncounter: (activeEncounter) => set({ activeEncounter }),
  clearEncounterContext: () => set({ activeEncounter: null }),
}));
