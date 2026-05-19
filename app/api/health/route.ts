import { ok } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export function GET() {
  return ok({
    service: "clinical-care-hms",
    status: "ok",
    timestamp: new Date().toISOString(),
    runtime: "nextjs-route-handler",
  });
}
