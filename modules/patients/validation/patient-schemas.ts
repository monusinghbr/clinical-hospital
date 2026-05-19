import { z } from "zod";

export const patientSearchSchema = z.object({
  q: z.string().trim().min(1).max(120),
  mode: z.enum(["all", "uhid", "phone", "encounter"]).default("all"),
});

export const patientRegistrationModeSchema = z.enum(["quick", "full", "emergency", "walk_in", "insured", "unknown"]);

const patientRegistrationBaseSchema = z.object({
  mode: patientRegistrationModeSchema.default("quick"),
  firstName: z.string().trim().max(80).optional(),
  middleName: z.string().trim().max(80).optional(),
  lastName: z.string().trim().max(80).optional(),
  dateOfBirth: z.string().optional(),
  sex: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"]).default("UNKNOWN"),
  phone: z.string().trim().max(24).optional(),
  email: z.string().email().optional().or(z.literal("")),
  bloodGroup: z.string().trim().max(8).optional(),
  chiefComplaint: z.string().trim().max(240).optional(),
  emergencyContactName: z.string().trim().max(120).optional(),
  emergencyContactPhone: z.string().trim().max(24).optional(),
  insurancePayerName: z.string().trim().max(120).optional(),
  insurancePolicyNumber: z.string().trim().max(120).optional(),
});

export const patientRegistrationSchema = patientRegistrationBaseSchema.superRefine((value, context) => {
  if (value.mode !== "unknown" && !value.firstName) {
    context.addIssue({ code: "custom", path: ["firstName"], message: "First name is required" });
  }

  if (value.mode !== "unknown" && !value.lastName) {
    context.addIssue({ code: "custom", path: ["lastName"], message: "Last name is required" });
  }
});

export const patientDraftSchema = patientRegistrationBaseSchema.partial().extend({
  draftId: z.string().uuid().optional(),
  updatedAt: z.string().optional(),
});

export type PatientSearchInput = z.infer<typeof patientSearchSchema>;
export type PatientRegistrationInput = z.infer<typeof patientRegistrationSchema>;
export type PatientDraftInput = z.infer<typeof patientDraftSchema>;
