"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { NAV_BY_ROLE } from "@/lib/config/nav";
import { useAuth } from "@/lib/hooks/use-auth";

export function Breadcrumb() {
  const pathname = usePathname();
  const { user } = useAuth();
  if (!user) return null;

  const allItems = NAV_BY_ROLE[user.role].flatMap((g) => g.items);
  const current = allItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  if (!current || current.href === "/dashboard") {
    return (
      <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
        <Home className="h-3.5 w-3.5" />
        <span className="font-medium text-foreground">Dashboard</span>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground">
      <Link href="/dashboard" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="font-medium text-foreground">{current.title}</span>
    </div>
  );
}
