import { Badge } from "@/components/ui/badge";

type ClinicalBadgeProps = {
  label: string;
  severity?: "info" | "warning" | "critical" | "success";
};

export function ClinicalBadge({ label, severity = "info" }: ClinicalBadgeProps) {
  const variant = severity === "info" ? "outline" : severity;
  return <Badge variant={variant}>{label}</Badge>;
}
