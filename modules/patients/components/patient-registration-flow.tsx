"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { AlertBanner } from "@/components/clinical/alert-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerPatientAction } from "@/modules/patients/actions/patient-actions";
import { usePatientDraftStore } from "@/store/patient-draft-store";

const registrationModes = [
  { value: "quick", label: "Quick", description: "Minimum safe intake for OPD/walk-in flow." },
  { value: "full", label: "Full", description: "Complete demographic and contact intake." },
  { value: "emergency", label: "Emergency", description: "Fast identity-light registration with risk flag." },
  { value: "walk_in", label: "Walk-in", description: "Front-desk encounter-ready registration." },
  { value: "insured", label: "Insured", description: "Captures payer and policy at intake." },
  { value: "unknown", label: "Unknown", description: "Unknown patient placeholder for urgent care." },
] as const;

export function PatientRegistrationFlow() {
  const searchParams = useSearchParams();
  const urlMode = searchParams.get("mode") ?? "quick";
  const draft = usePatientDraftStore((state) => state.registrationDraft);
  const updateDraft = usePatientDraftStore((state) => state.updateRegistrationDraft);
  const clearDraft = usePatientDraftStore((state) => state.clearRegistrationDraft);
  const selectedMode = useMemo(
    () => registrationModes.find((mode) => mode.value === (draft.mode ?? urlMode)) ?? registrationModes[0],
    [draft.mode, urlMode],
  );

  useEffect(() => {
    if (!draft.mode) {
      updateDraft({ mode: selectedMode.value });
    }
  }, [draft.mode, selectedMode.value, updateDraft]);

  const mode = selectedMode.value;

  return (
    <form action={registerPatientAction} className="mx-auto grid w-full max-w-[1500px] gap-4 p-4 xl:grid-cols-[280px_1fr_340px]">
      <input type="hidden" name="mode" value={mode} />
      <aside className="rounded-md border border-border bg-panel p-3">
        <div className="text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">Registration mode</div>
        <div className="mt-3 grid gap-2">
          {registrationModes.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => updateDraft({ mode: item.value })}
              className={`rounded border px-3 py-2 text-left ${mode === item.value ? "border-primary bg-accent" : "border-border bg-background"}`}
            >
              <div className="text-sm font-semibold">{item.label}</div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.description}</p>
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-md border border-border bg-panel">
        <div className="border-b border-border px-4 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-normal text-muted-foreground">Patient registration flow</div>
          <h1 className="mt-1 text-xl font-semibold">{selectedMode.label} intake</h1>
        </div>
        <div className="grid gap-4 p-4">
          {mode === "emergency" ? (
            <AlertBanner
              title="Emergency registration"
              detail="Create a traceable patient record quickly. Identity can be reconciled later without losing clinical continuity."
              severity="warning"
            />
          ) : null}

          <div className="grid gap-3 md:grid-cols-3">
            <Field name="firstName" label="First name" value={draft.firstName} onChange={(value) => updateDraft({ firstName: value })} disabled={mode === "unknown"} />
            <Field name="middleName" label="Middle name" value={draft.middleName} onChange={(value) => updateDraft({ middleName: value })} disabled={mode === "unknown"} required={false} />
            <Field name="lastName" label="Last name" value={draft.lastName} onChange={(value) => updateDraft({ lastName: value })} disabled={mode === "unknown"} />
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <Field name="dateOfBirth" label="Date of birth" type="date" value={draft.dateOfBirth} onChange={(value) => updateDraft({ dateOfBirth: value })} required={false} />
            <SelectField name="sex" label="Sex" value={draft.sex ?? "UNKNOWN"} onChange={(value) => updateDraft({ sex: value as "MALE" | "FEMALE" | "OTHER" | "UNKNOWN" })} />
            <Field name="phone" label="Phone" value={draft.phone} onChange={(value) => updateDraft({ phone: value })} required={mode !== "emergency" && mode !== "unknown"} />
            <Field name="bloodGroup" label="Blood group" value={draft.bloodGroup} onChange={(value) => updateDraft({ bloodGroup: value })} required={false} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field name="email" label="Email" type="email" value={draft.email} onChange={(value) => updateDraft({ email: value })} required={false} />
            <Field name="chiefComplaint" label="Chief complaint / intake reason" value={draft.chiefComplaint} onChange={(value) => updateDraft({ chiefComplaint: value })} required={false} />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field name="emergencyContactName" label="Emergency contact" value={draft.emergencyContactName} onChange={(value) => updateDraft({ emergencyContactName: value })} required={false} />
            <Field name="emergencyContactPhone" label="Emergency contact phone" value={draft.emergencyContactPhone} onChange={(value) => updateDraft({ emergencyContactPhone: value })} required={false} />
          </div>
          {mode === "insured" ? (
            <div className="grid gap-3 rounded-md border border-border bg-background p-3 md:grid-cols-2">
              <Field name="insurancePayerName" label="Payer" value={draft.insurancePayerName} onChange={(value) => updateDraft({ insurancePayerName: value })} />
              <Field name="insurancePolicyNumber" label="Policy number" value={draft.insurancePolicyNumber} onChange={(value) => updateDraft({ insurancePolicyNumber: value })} />
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <div className="text-xs text-muted-foreground">{draft.updatedAt ? `Draft autosaved ${new Date(draft.updatedAt).toLocaleTimeString()}` : "Draft will autosave locally"}</div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={clearDraft}>
              Clear draft
            </Button>
            <Button type="submit">Create patient context</Button>
          </div>
        </div>
      </section>

      <aside className="rounded-md border border-border bg-panel p-3">
        <div className="text-[11px] font-semibold uppercase text-muted-foreground">Operational safeguards</div>
        <div className="mt-3 grid gap-2 text-xs">
          {["UHID generated server-side", "Registration writes audit event", "Timeline event created", "Realtime patient update emitted", "Draft persists if interrupted"].map((item) => (
            <div key={item} className="rounded border border-border bg-background px-3 py-2">
              {item}
            </div>
          ))}
        </div>
      </aside>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  value,
  onChange,
  disabled = false,
  required = true,
}: {
  name: string;
  label: string;
  type?: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} value={disabled ? "" : value ?? ""} onChange={(event) => onChange(event.target.value)} disabled={disabled} required={required && !disabled} />
    </div>
  );
}

function SelectField({ name, label, value, onChange }: { name: string; label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="UNKNOWN">Unknown</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
        <option value="OTHER">Other</option>
      </select>
    </div>
  );
}
