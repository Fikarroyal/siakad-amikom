"use client";

import * as React from "react";
import Link from "next/link";
import {
  Award,
  TrendingUp,
  BookOpenCheck,
  Layers3,
  AlertTriangle,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatCard, StatCardSkeleton } from "@/components/cards/stat-card";
import { StatusBadge } from "@/components/cards/status-badge";
import { QuickActions } from "./quick-actions";
import { JadwalHariIniWidget } from "./jadwal-hari-ini-widget";
import { PengumumanWidget } from "./pengumuman-widget";
import { TagihanWidget } from "./tagihan-widget";
import { IpkTrendChart } from "@/components/charts/ipk-trend-chart";
import { SksPerSemesterChart } from "@/components/charts/sks-per-semester-chart";
import { StudentService } from "@/lib/services/student-service";
import { getInisial } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import type { ProgramStudi, Fakultas, Mahasiswa } from "@/lib/types";

export function StudentDashboard() {
  const { user } = useAuth();
  const [profil, setProfil] = React.useState<
    (Mahasiswa & { prodi?: ProgramStudi; fakultas?: Fakultas }) | null
  >(null);
  const [ringkasan, setRingkasan] = React.useState<Awaited<
    ReturnType<typeof StudentService.getRingkasanAkademik>
  > | null>(null);
  const [tren, setTren] = React.useState<Awaited<ReturnType<typeof StudentService.getTrenIpk>> | null>(null);

  React.useEffect(() => {
    if (!user) return;
    StudentService.getProfil(user).then(setProfil);
    StudentService.getRingkasanAkademik(user).then(setRingkasan);
    StudentService.getTrenIpk(user).then(setTren);
  }, [user]);

  const jamSekarang = new Date().getHours();
  const salam = jamSekarang < 11 ? "Selamat pagi" : jamSekarang < 15 ? "Selamat siang" : jamSekarang < 18 ? "Selamat sore" : "Selamat malam";

  return (
    <div className="space-y-6">
      {/* Header profil */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <Avatar className="h-12 w-12 border border-border">
            <AvatarFallback className="text-sm">
              {getInisial(user?.nama ?? "")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              {salam}, {user?.nama?.split(" ")[0]}
            </h1>
            {profil && (
              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span>{profil.nim || "NIM belum diisi"}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>{profil.prodi?.nama ?? "Belum memilih jurusan"}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <span>Semester {profil.semesterAktif}</span>
                <span className="h-1 w-1 rounded-full bg-border" />
                <StatusBadge status={profil.status} />
              </div>
            )}
          </div>
        </div>
      </div>

      {profil && !profil.prodiId && (
        <div className="flex items-center gap-2.5 rounded-lg border border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="flex-1">
            Anda belum memilih program studi. Lengkapi di halaman{" "}
            <Link href="/mahasiswa/profil" className="font-medium underline underline-offset-2">
              Profil Saya
            </Link>{" "}
            agar KRS dan data akademik lainnya dapat digunakan.
          </span>
        </div>
      )}

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ringkasan === null ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={Award} label="IPK Kumulatif" value={ringkasan.ipk.toFixed(2)} tone="default" hint="Skala 0.00 – 4.00" />
            <StatCard icon={TrendingUp} label="IPS Semester Lalu" value={ringkasan.ips.toFixed(2)} tone="success" hint="Indeks prestasi semester" />
            <StatCard
              icon={BookOpenCheck}
              label="SKS Ditempuh"
              value={`${ringkasan.sksDitempuh}`}
              tone="info"
              hint={`dari total ${ringkasan.totalSks} SKS`}
            />
            <StatCard
              icon={Layers3}
              label="SKS Tersisa"
              value={`${ringkasan.sksTersisa}`}
              tone="warning"
              hint="Untuk menyelesaikan studi"
            />
          </>
        )}
      </div>

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <JadwalHariIniWidget />
        <PengumumanWidget />
        <TagihanWidget />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IpkTrendChart data={tren ?? []} loading={tren === null} />
        <SksPerSemesterChart data={tren ?? []} loading={tren === null} />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-sm font-semibold text-foreground mb-3">Akses Cepat</h2>
        <QuickActions />
      </div>
    </div>
  );
}
