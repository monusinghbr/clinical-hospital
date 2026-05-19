"use client";

import { create } from "zustand";

import type { WorkspaceView } from "@/modules/workspace/types/workspace";

type WorkspaceState = {
  activeView: WorkspaceView;
  activePatientId: string;
  rightRailOpen: boolean;
  emergencyMode: boolean;
  query: string;
  commandOpen: boolean;
  patientNestedTab: "overview" | "timeline" | "orders" | "vitals" | "medications" | "documents" | "carePlans";
  leftPanelWidth: number;
  rightPanelWidth: number;
  setActiveView: (view: WorkspaceView) => void;
  setActivePatientId: (patientId: string) => void;
  setRightRailOpen: (open: boolean) => void;
  setEmergencyMode: (active: boolean) => void;
  setQuery: (query: string) => void;
  setCommandOpen: (open: boolean) => void;
  setPatientNestedTab: (tab: WorkspaceState["patientNestedTab"]) => void;
  setLeftPanelWidth: (width: number) => void;
  setRightPanelWidth: (width: number) => void;
};

export const useClinicalWorkspaceStore = create<WorkspaceState>()((set) => ({
  activeView: "overview",
  activePatientId: "p-001",
  rightRailOpen: true,
  emergencyMode: false,
  query: "",
  commandOpen: false,
  patientNestedTab: "overview",
  leftPanelWidth: 316,
  rightPanelWidth: 360,
  setActiveView: (activeView) => set({ activeView }),
  setActivePatientId: (activePatientId) => set({ activePatientId }),
  setRightRailOpen: (rightRailOpen) => set({ rightRailOpen }),
  setEmergencyMode: (emergencyMode) => set({ emergencyMode }),
  setQuery: (query) => set({ query }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setPatientNestedTab: (patientNestedTab) => set({ patientNestedTab }),
  setLeftPanelWidth: (leftPanelWidth) => set({ leftPanelWidth }),
  setRightPanelWidth: (rightPanelWidth) => set({ rightPanelWidth }),
}));
