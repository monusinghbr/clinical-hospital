import { fail, ok } from "@/lib/api-response";
import { prisma } from "@/server/db/prisma";
import { requireSession } from "@/server/auth/permissions";
import { getSession } from "@/server/auth/session";

export async function GET() {
  try {
    const session = await getSession();
    requireSession(session);

    if (!session.user.hospitalId) {
      return ok([]);
    }

    const notifications = await prisma.notification.findMany({
      where: {
        hospitalId: session.user.hospitalId,
        OR: [{ userId: session.user.id }, { userId: null }],
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return ok(notifications);
  } catch (error) {
    return fail(error);
  }
}
