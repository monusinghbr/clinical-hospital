"use client";

import { AlertTriangle } from "lucide-react";

import { EmptyState } from "@/components/clinical/empty-state";
import { Button } from "@/components/ui/button";

export default function PatientsError({ reset }: { reset: () => void }) {
  return (
    <div className="p-4">
      <EmptyState
        icon={AlertTriangle}
        title="Patient workflow failed"
        description="The patient workspace encountered an unexpected error."
        action={
          <Button variant="outline" onClick={reset}>
            Retry
          </Button>
        }
      />
    </div>
  );
}
