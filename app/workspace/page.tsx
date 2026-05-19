import { ClinicalWorkspace } from "@/modules/workspace/components/workspace-shell";
import type { WorkspaceView } from "@/modules/workspace/types/workspace";

const allowedViews: WorkspaceView[] = [
  "overview",
  "patients",
  "opd",
  "admissions",
  "nursing",
  "vitals",
  "medications",
  "lab",
  "radiology",
  "icu",
  "wards",
  "discharge",
  "schedules",
  "alerts",
  "escalation",
  "or",
  "pharmacy",
  "handoff",
  "documentation",
  "command",
  "audit",
];

export default async function WorkspacePage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const params = await searchParams;
  const initialView = allowedViews.includes(params.view as WorkspaceView) ? (params.view as WorkspaceView) : "overview";

  return <ClinicalWorkspace initialView={initialView} />;
}
