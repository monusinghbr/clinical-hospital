import { Activity, ClipboardList, FileWarning } from "lucide-react";

import { EmptyState } from "@/components/clinical/empty-state";
import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import type { PatientTimelineEntry } from "@/modules/patients/types/patient-workspace";

export function PatientTimelineStream({ entries }: { entries: PatientTimelineEntry[] }) {
  return (
    <section className="min-w-0 rounded-md border border-border bg-panel">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">Longitudinal timeline</div>
          <h2 className="text-sm font-semibold">Clinical event stream</h2>
        </div>
        <ClinicalBadge label={`${entries.length} events`} severity="info" />
      </div>
      <div className="min-h-[620px] p-3">
        {entries.length ? (
          <ol className="space-y-2">
            {entries.map((entry) => (
              <li key={entry.id} className="grid grid-cols-[132px_1fr] gap-3 rounded-md border border-border bg-background p-3">
                <time className="text-[11px] leading-5 text-muted-foreground">{entry.occurredAt}</time>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Activity className="size-4 text-primary" />
                    <span className="text-sm font-semibold">{entry.title}</span>
                    <ClinicalBadge label={entry.eventType} severity={entry.severity === "CRITICAL" ? "critical" : entry.severity === "HIGH" ? "warning" : "info"} />
                  </div>
                  {entry.summary ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{entry.summary}</p> : null}
                  <div className="mt-2 text-[11px] uppercase text-muted-foreground">{entry.source}</div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No timeline events yet"
            description="Consultations, vitals, orders, notes, transfers, and discharge events will accumulate here as the longitudinal record."
            action={
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileWarning className="size-4" />
                Clinical writes should emit activity and timeline events.
              </div>
            }
          />
        )}
      </div>
    </section>
  );
}
