import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/lib/generated/prisma/client";
import type { Permission } from "@/config/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      hospitalId?: string;
      permissions: Permission[];
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    hospitalId?: string;
    permissions: Permission[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    hospitalId?: string;
    permissions: Permission[];
  }
}
