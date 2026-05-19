import { fail, ok } from "@/lib/api-response";
import { requireSession } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    requireSession(session);

    return ok({
      id: session.user.id,
      name: session.user.name,
      role: session.user.role,
      hospitalId: session.user.hospitalId,
      permissions: session.user.permissions,
    });
  } catch (error) {
    return fail(error);
  }
}
