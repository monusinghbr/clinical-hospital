import { AppShell } from "@/modules/foundation/components/app-shell";
import { getSession } from "@/server/auth/session";

export default async function ClinicalLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return <AppShell session={session}>{children}</AppShell>;
}
