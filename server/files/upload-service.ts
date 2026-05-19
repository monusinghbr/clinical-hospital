import { ValidationError } from "@/lib/errors";
import { createSupabaseAdminClient } from "@/lib/supabase";
import { publishActivity } from "@/server/events/activity-event-bus";

export type ClinicalUploadInput = {
  hospitalId: string;
  patientId: string;
  fileName: string;
  contentType: string;
  bytes: ArrayBuffer;
  folder?: "patient-documents" | "lab-results" | "radiology-reports" | "discharge";
};

const maxFileBytes = 25 * 1024 * 1024;
const allowedMimeTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);

export async function uploadClinicalFile(input: ClinicalUploadInput) {
  if (input.bytes.byteLength > maxFileBytes) {
    throw new ValidationError("Clinical file exceeds the 25 MB upload limit");
  }

  if (!allowedMimeTypes.has(input.contentType)) {
    throw new ValidationError("Unsupported clinical document type");
  }

  const supabase = createSupabaseAdminClient();
  if (!supabase) {
    throw new ValidationError("Supabase storage is not configured");
  }

  const folder = input.folder ?? "patient-documents";
  const storageKey = `${input.hospitalId}/${input.patientId}/${folder}/${crypto.randomUUID()}-${input.fileName}`;

  const { error } = await supabase.storage.from("clinical-documents").upload(storageKey, input.bytes, {
    contentType: input.contentType,
    upsert: false,
  });

  if (error) {
    throw new ValidationError(error.message);
  }

  await publishActivity({
    name: "file.uploaded",
    hospitalId: input.hospitalId,
    patientId: input.patientId,
    payload: { storageKey, contentType: input.contentType, folder },
  });

  return { storageKey };
}
