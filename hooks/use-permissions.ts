"use client";

import { useSession } from "next-auth/react";

import type { Permission } from "@/config/permissions";

export function usePermissions() {
  const { data: session } = useSession();

  return {
    permissions: session?.user.permissions ?? [],
    can(permission: Permission) {
      return Boolean(session?.user.permissions.includes(permission));
    },
  };
}
