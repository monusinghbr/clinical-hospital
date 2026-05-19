import type { Permission } from "@/config/permissions";
import { writeAuditLog } from "@/services/audit/audit-service";
import { publishActivity } from "@/server/events/activity-event-bus";
import { requirePermission } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";

type AuditedActionInput<TInput, TOutput> = {
  action: string;
  entityType: string;
  permission: Permission;
  getEntityId?: (input: TInput, output: TOutput) => string | undefined;
  handler: (input: TInput) => Promise<TOutput>;
};

export function withAuditedAction<TInput, TOutput>({
  action,
  entityType,
  permission,
  getEntityId,
  handler,
}: AuditedActionInput<TInput, TOutput>) {
  return async (input: TInput) => {
    const session = await getSession();
    requirePermission(session, permission);

    const output = await handler(input);
    const entityId = getEntityId?.(input, output);

    await writeAuditLog({
      hospitalId: session.user.hospitalId,
      actorId: session.user.id,
      action,
      entityType,
      entityId,
      metadata: { source: "audited-action" },
    });

    await publishActivity({
      name: "audit.recorded",
      hospitalId: session.user.hospitalId,
      actorId: session.user.id,
      payload: { action, entityType, entityId },
    });

    return output;
  };
}
