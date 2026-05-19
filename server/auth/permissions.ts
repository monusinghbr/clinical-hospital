import type { Session } from "next-auth";

import type { Permission } from "@/config/permissions";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";

export function hasPermission(session: Session | null, permission: Permission) {
  return Boolean(session?.user.permissions.includes(permission));
}

export function requireSession(session: Session | null): asserts session is Session {
  if (!session?.user) {
    throw new UnauthorizedError();
  }
}

export function requirePermission(session: Session | null, permission: Permission): asserts session is Session {
  requireSession(session);

  if (!hasPermission(session, permission)) {
    throw new ForbiddenError();
  }
}
