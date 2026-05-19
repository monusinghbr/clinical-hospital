"use client";

import { createContext, useContext, useMemo } from "react";

import { useEncounterContextStore } from "@/modules/encounter-context/encounter-context-store";

const EncounterContext = createContext<ReturnType<typeof useEncounterContextStore> | null>(null);

export function EncounterContextProvider({ children }: { children: React.ReactNode }) {
  const activeEncounter = useEncounterContextStore((state) => state.activeEncounter);
  const setActiveEncounter = useEncounterContextStore((state) => state.setActiveEncounter);
  const clearEncounterContext = useEncounterContextStore((state) => state.clearEncounterContext);
  const value = useMemo(
    () => ({ activeEncounter, setActiveEncounter, clearEncounterContext }),
    [activeEncounter, setActiveEncounter, clearEncounterContext],
  );

  return <EncounterContext.Provider value={value}>{children}</EncounterContext.Provider>;
}

export function useActiveEncounter() {
  const context = useContext(EncounterContext);
  if (!context) {
    throw new Error("useActiveEncounter must be used inside EncounterContextProvider");
  }
  return context;
}
