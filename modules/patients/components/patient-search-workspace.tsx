"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, Clock3, Search, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { ClinicalBadge } from "@/components/clinical/clinical-badge";
import { EmptyState } from "@/components/clinical/empty-state";
import { StatusIndicator } from "@/components/clinical/status-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PatientSearchResult } from "@/modules/patients/types/patient-workspace";
import { cn } from "@/lib/utils";

type SearchMode = "all" | "uhid" | "phone" | "encounter";

async function searchPatients(q: string, mode: SearchMode) {
  if (!q.trim()) {
    return [] as PatientSearchResult[];
  }

  const params = new URLSearchParams({ q, mode });
  const response = await fetch(`/api/patients/search?${params.toString()}`);
  const payload = await response.json();

  if (!payload.ok) {
    throw new Error(payload.error?.message ?? "Patient search failed");
  }

  return payload.data as PatientSearchResult[];
}

export function PatientSearchWorkspace({ recentPatients }: { recentPatients: PatientSearchResult[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: queriedPatients = [], isFetching, isError } = useQuery<PatientSearchResult[]>({
    queryKey: ["patient-search", query, mode],
    queryFn: () => searchPatients(query, mode),
    enabled: query.trim().length > 0,
    staleTime: 10_000,
  });

  const results: PatientSearchResult[] = query.trim() ? queriedPatients : recentPatients;
  const modeItems: Array<{ label: string; value: SearchMode }> = [
    { label: "All", value: "all" },
    { label: "UHID", value: "uhid" },
    { label: "Phone", value: "phone" },
    { label: "Encounter", value: "encounter" },
  ];

  const selectedPatient = useMemo(() => results[activeIndex], [activeIndex, results]);

  function openSelected() {
    if (selectedPatient) {
      router.push(`/patients/${selectedPatient.id}`);
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-[1600px] gap-4 p-4 xl:grid-cols-[1fr_360px]">
      <section className="rounded-md border border-border bg-panel">
        <div className="border-b border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">Patient search workspace</div>
              <h1 className="mt-1 text-xl font-semibold">Find active patient context</h1>
            </div>
            <Button asChild>
              <Link href="/patients/register">
                <UserPlus />
                Register
              </Link>
            </Button>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-10 pl-9"
                placeholder="Search UHID, patient name, phone, or encounter number"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown") {
                    event.preventDefault();
                    setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
                  }
                  if (event.key === "ArrowUp") {
                    event.preventDefault();
                    setActiveIndex((index) => Math.max(index - 1, 0));
                  }
                  if (event.key === "Enter") {
                    event.preventDefault();
                    openSelected();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="flex rounded-md border border-border bg-background p-1">
              {modeItems.map((item) => (
                <button
                  key={item.value}
                  className={cn(
                    "h-8 rounded px-3 text-xs font-medium text-muted-foreground",
                    mode === item.value && "bg-primary text-primary-foreground",
                  )}
                  onClick={() => setMode(item.value)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-h-[460px] p-3">
          {isError ? (
            <EmptyState icon={AlertTriangle} title="Search unavailable" description="Patient lookup could not reach the clinical database." />
          ) : results.length ? (
            <div className="grid gap-2">
              {results.map((patient, index) => (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => router.push(`/patients/${patient.id}`)}
                  className={cn(
                    "grid gap-3 rounded-md border border-border bg-background p-3 text-left hover:border-primary/50 md:grid-cols-[1fr_220px_120px]",
                    index === activeIndex && "border-primary bg-accent/40",
                  )}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">{patient.uhid}</span>
                      <span className="text-sm font-semibold">{patient.name}</span>
                      {patient.alertCount ? <ClinicalBadge label={`${patient.alertCount} alerts`} severity="warning" /> : null}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{patient.ageSex} {patient.phone ? `· ${patient.phone}` : ""}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {patient.flags.map((flag) => (
                        <ClinicalBadge key={flag.label} label={flag.label} severity={flag.severity === "CRITICAL" ? "critical" : "warning"} />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {patient.activeEncounter ? (
                      <div className="grid gap-1">
                        <span className="font-medium text-foreground">{patient.activeEncounter.encounterNo}</span>
                        <span>{patient.activeEncounter.type} · {patient.activeEncounter.status}</span>
                        <span>{[patient.activeEncounter.ward, patient.activeEncounter.bed].filter(Boolean).join(" / ") || "No bed context"}</span>
                      </div>
                    ) : (
                      <span>No active encounter</span>
                    )}
                  </div>
                  <div className="flex items-center justify-end gap-2 text-xs text-primary">
                    Open
                    <ArrowRight className="size-4" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Clock3}
              title={query.trim() ? "No matching patient context" : "No recent patients"}
              description={query.trim() ? "Try UHID, phone, patient name, or encounter number." : "Recent patient contexts will appear here after registration or encounters."}
              action={
                <Button asChild variant="outline">
                  <Link href="/patients/register">
                    <UserPlus />
                    Register patient
                  </Link>
                </Button>
              }
            />
          )}
        </div>
      </section>

      <aside className="space-y-3">
        <div className="rounded-md border border-border bg-panel p-3">
          <div className="text-[11px] font-semibold uppercase text-muted-foreground">Search state</div>
          <div className="mt-3 grid gap-2">
            <StatusIndicator label={isFetching ? "Searching" : "Ready"} tone={isFetching ? "idle" : "online"} pulse={isFetching} />
            <StatusIndicator label="Keyboard navigation active" tone="online" />
            <StatusIndicator label="Patient context handoff enabled" tone="idle" />
          </div>
        </div>
        <div className="rounded-md border border-border bg-panel p-3">
          <div className="text-[11px] font-semibold uppercase text-muted-foreground">Quick actions</div>
          <div className="mt-3 grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/patients/register?mode=quick">Quick registration</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/patients/register?mode=emergency">Emergency registration</Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/patients/register?mode=insured">Insured patient intake</Link>
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
