"use client";

import * as React from "react";
import { Clock, MapPin, CalendarX2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/cards/empty-state";
import { StudentService } from "@/lib/services/student-service";
import { useAuth } from "@/lib/hooks/use-auth";

const HARI_INI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][new Date().getDay()];

export function JadwalHariIniWidget() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Awaited<ReturnType<typeof StudentService.getJadwalHariIni>> | null>(null);

  React.useEffect(() => {
    if (!user) return;
    StudentService.getJadwalHariIni(user, HARI_INI).then(setData);
  }, [user]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Jadwal Kuliah Hari Ini</CardTitle>
        <CardDescription>{HARI_INI}, sesuai Kartu Rencana Studi aktif</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {data === null ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
        ) : data.length === 0 ? (
          <EmptyState
            icon={CalendarX2}
            title="Tidak ada jadwal hari ini"
            description="Nikmati waktu luang Anda atau gunakan untuk mengerjakan tugas."
          />
        ) : (
          data.map(({ kelas, mataKuliah, dosen }) => (
            <div
              key={kelas.id}
              className="flex items-start gap-3 rounded-lg border border-border p-3.5 hover:bg-secondary/40 transition-colors"
            >
              <div className="flex h-10 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <span className="text-[11px] font-semibold leading-none">{kelas.jamMulai}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{mataKuliah.nama}</p>
                <p className="text-xs text-muted-foreground truncate">{dosen?.nama}</p>
                <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {kelas.jamMulai}–{kelas.jamSelesai}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {kelas.ruangan}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
