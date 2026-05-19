export type CodeSystem = "ICD_10" | "SNOMED_CT" | "LOINC" | "RXNORM" | "LOCAL";

export type TerminologyConcept = {
  system: CodeSystem;
  code: string;
  display: string;
  aliases?: string[];
};

export const codeSystems: Record<CodeSystem, { label: string; uri: string; enabled: boolean }> = {
  ICD_10: { label: "ICD-10", uri: "http://hl7.org/fhir/sid/icd-10", enabled: true },
  SNOMED_CT: { label: "SNOMED CT", uri: "http://snomed.info/sct", enabled: false },
  LOINC: { label: "LOINC", uri: "http://loinc.org", enabled: false },
  RXNORM: { label: "RxNorm", uri: "http://www.nlm.nih.gov/research/umls/rxnorm", enabled: false },
  LOCAL: { label: "Hospital Local", uri: "urn:hms:local", enabled: true },
};

export const diagnosisSeedConcepts: TerminologyConcept[] = [
  { system: "ICD_10", code: "I10", display: "Essential hypertension" },
  { system: "ICD_10", code: "E11.9", display: "Type 2 diabetes mellitus without complications" },
  { system: "ICD_10", code: "J18.9", display: "Pneumonia, unspecified organism" },
  { system: "ICD_10", code: "R50.9", display: "Fever, unspecified" },
];

export function normalizeClinicalTerm(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}
