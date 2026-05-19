import { Badge } from "@/components/ui/badge";

type MedicalTableRow = {
  label: string;
  value: string;
  unit?: string;
  flag?: "normal" | "high" | "critical";
};

export function MedicalTable({ rows }: { rows: MedicalTableRow[] }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th className="w-2/5 bg-muted/40 px-3 py-2 text-left text-xs font-medium text-muted-foreground">{row.label}</th>
              <td className="px-3 py-2">
                <span className="font-medium">{row.value}</span>
                {row.unit ? <span className="ml-1 text-xs text-muted-foreground">{row.unit}</span> : null}
                {row.flag && row.flag !== "normal" ? (
                  <Badge className="ml-2" variant={row.flag === "critical" ? "critical" : "warning"}>
                    {row.flag}
                  </Badge>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
