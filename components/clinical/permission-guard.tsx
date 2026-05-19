"use client";

import { useSession } from "next-auth/react";

import type { Permission } from "@/config/permissions";

type PermissionGuardProps = {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { data: session } = useSession();

  if (!session?.user.permissions.includes(permission)) {
    return fallback;
  }

  return children;
}
