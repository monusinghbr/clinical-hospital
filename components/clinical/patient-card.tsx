import { AlertTriangle, Droplet, Phone } from "lucide-react";

import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { StatusIndicator } from "@/components/clinical/status-indicator";

type PatientCardProps = {
  uhid: string;
  name: string;
  ageSex: string;
  status: string;
  phone?: string;
  bloodGroup?: string;
  alerts?: string[];
};

export function PatientCard({ uhid, name, ageSex, status, phone, bloodGroup, alerts = [] }: PatientCardProps) {
  return (
    <aside className="sticky top-16 space-y-3 rounded-md border border-border bg-panel p-3">
      <div>
        <div className="text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">{uhid}</div>
        <h2 className="mt-1 text-base font-semibold">{name}</h2>
        <div className="mt-1 text-xs text-muted-foreground">{ageSex}</div>
      </div>
      <StatusIndicator label={status} tone="idle" />
      <div className="grid gap-2 text-xs">
        {phone ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="size-3.5" />
            {phone}
          </div>
        ) : null}
        {bloodGroup ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Droplet className="size-3.5" />
            {bloodGroup}
          </div>
        ) : null}
      </div>
      {alerts.length ? (
        <div className="space-y-2 border-t border-border pt-3">
          {alerts.map((alert) => (
            <div key={alert} className="flex items-center gap-2">
              <AlertTriangle className="size-3.5 text-amber-500" />
              <ClinicalBadge label={alert} severity="warning" />
            </div>
          ))}
        </div>
      ) : null}
    </aside>
  );
}
