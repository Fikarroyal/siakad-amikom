import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  CalendarDays,
  BadgeCheck,
  CalendarCheck,
  CreditCard,
  FileText,
} from "lucide-react";

const ACTIONS: { title: string; href: string; icon: LucideIcon }[] = [
  { title: "KRS", href: "/mahasiswa/krs", icon: ClipboardList },
  { title: "Jadwal", href: "/mahasiswa/jadwal", icon: CalendarDays },
  { title: "Nilai", href: "/mahasiswa/nilai", icon: BadgeCheck },
  { title: "Presensi", href: "/mahasiswa/presensi", icon: CalendarCheck },
  { title: "Pembayaran", href: "/mahasiswa/pembayaran", icon: CreditCard },
  { title: "KHS", href: "/mahasiswa/khs", icon: FileText },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
      {ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center shadow-soft hover:border-primary/40 hover:bg-accent/40 transition-colors"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <action.icon className="h-[18px] w-[18px]" />
          </div>
          <span className="text-xs font-medium text-foreground">{action.title}</span>
        </Link>
      ))}
    </div>
  );
}
