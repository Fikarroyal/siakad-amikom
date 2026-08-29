"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { BottomNavMobile } from "./mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (isLoading || user) return;
    router.replace("/login");

    // Jaring pengaman: paksa pindah halaman penuh jika navigasi
    // client-side tidak kunjung berhasil, supaya tidak macet.
    const timeout = setTimeout(() => {
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [isLoading, user, router]);

  // Sidebar, Topbar, dan BottomNavMobile sudah menangani kondisi
  // "belum ada user" masing-masing (merender null), sehingga shell
  // tidak perlu menahan tampilan di balik layar pemuatan penuh layar.
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
      <BottomNavMobile />
    </div>
  );
}
