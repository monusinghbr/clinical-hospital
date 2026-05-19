import {
  Activity,
  BellRing,
  BedDouble,
  CalendarDays,
  ClipboardList,
  FileHeart,
  FlaskConical,
  HeartPulse,
  Home,
  Hospital,
  Microscope,
  Pill,
  Radio,
  ShieldCheck,
  Siren,
  Stethoscope,
  UsersRound,
} from "lucide-react";

import type { Permission } from "@/config/permissions";

export type NavigationItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
  badge?: string;
};

export const primaryNavigation: NavigationItem[] = [
  { title: "Workspace", href: "/workspace", icon: Home },
  { title: "Patients", href: "/workspace?view=patients", icon: UsersRound },
  { title: "OPD", href: "/workspace?view=opd", icon: Stethoscope },
  { title: "Admissions", href: "/workspace?view=admissions", icon: ClipboardList },
  { title: "Nursing", href: "/workspace?view=nursing", icon: HeartPulse },
  { title: "Vitals", href: "/workspace?view=vitals", icon: Activity },
  { title: "Medications", href: "/workspace?view=medications", icon: Pill },
  { title: "Lab", href: "/workspace?view=lab", icon: FlaskConical },
  { title: "Radiology", href: "/workspace?view=radiology", icon: Radio },
  { title: "ICU", href: "/workspace?view=icu", icon: Microscope, badge: "Live" },
  { title: "Wards", href: "/workspace?view=wards", icon: BedDouble },
  { title: "Discharge", href: "/workspace?view=discharge", icon: FileHeart },
  { title: "Schedules", href: "/workspace?view=schedules", icon: CalendarDays },
  { title: "Alerts", href: "/workspace?view=alerts", icon: BellRing, badge: "STAT" },
];

export const systemNavigation: NavigationItem[] = [
  { title: "Escalation", href: "/workspace?view=escalation", icon: Siren },
  { title: "Audit", href: "/workspace?view=audit", icon: ShieldCheck },
  { title: "Settings", href: "/settings", icon: Hospital },
];
