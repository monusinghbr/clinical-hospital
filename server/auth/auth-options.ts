import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

import { resolvePermissions } from "@/config/permissions";
import { env } from "@/config/env";
import { prisma } from "@/server/db/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 10,
    updateAge: 60 * 15,
  },
  secret: env.NEXTAUTH_SECRET ?? "development-only-secret-change-before-production",
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Hospital credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(rawCredentials) {
        const credentials = credentialsSchema.parse(rawCredentials);
        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
          include: { memberships: true },
        });

        if (!user?.passwordHash || !user.isActive || user.deletedAt) {
          return null;
        }

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!valid) {
          return null;
        }

        const activeMembership = user.memberships[0];
        const permissions = resolvePermissions(user.primaryRole, activeMembership?.permissions ?? []);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.primaryRole,
          hospitalId: activeMembership?.hospitalId,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.hospitalId = user.hospitalId;
        token.permissions = user.permissions;
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.hospitalId = token.hospitalId;
      session.user.permissions = token.permissions ?? [];
      return session;
    },
  },
};
