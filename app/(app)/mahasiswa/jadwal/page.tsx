"use client";

import * as React from "react";
import { CalendarDays, Clock, MapPin, UserRound, LayoutList, Grid3x3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/cards/empty-state";
import { StudentService } from "@/lib/services/student-service";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils";
import type { HariKuliah } from "@/lib/types";

const HARI_URUT: HariKuliah[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const SLOT_JAM = ["07:30", "09:10", "10:50", "13:00", "14:40", "16:20"];
const WARNA_PALET = [
  "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30",
  "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/30",
  "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30",
  "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
  "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-500/30",
  "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30",
];

type JadwalItem = Awaited<ReturnType<typeof StudentService.getJadwalLengkap>>[number];

export default function JadwalPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<JadwalItem[] | null>(null);

  React.useEffect(() => {
    if (!user) return;
    StudentService.getJadwalLengkap(user).then(setData);
  }, [user]);

  const warnaUntuk = (mataKuliahId: string) => {
    const idx = (data ?? []).findIndex((d) => d.mataKuliah.id === mataKuliahId);
    return WARNA_PALET[idx % WARNA_PALET.length];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Jadwal Kuliah</h1>
        <p className="text-sm text-muted-foreground">Jadwal mata kuliah pada semester aktif</p>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">
            <LayoutList className="h-3.5 w-3.5" /> Tampilan List
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Grid3x3 className="h-3.5 w-3.5" /> Tampilan Kalender
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="space-y-4">
            {data === null ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
            ) : data.length === 0 ? (
              <EmptyState icon={CalendarDays} title="Belum ada jadwal" description="Jadwal akan muncul setelah KRS disetujui." />
            ) : (
              HARI_URUT.map((hari) => {
                const kelasHariIni = data
                  .filter((d) => d.kelas.hari === hari)
                  .sort((a, b) => a.kelas.jamMulai.localeCompare(b.kelas.jamMulai));
                if (kelasHariIni.length === 0) return null;
                return (
                  <Card key={hari}>
                    <CardHeader>
                      <CardTitle>{hari}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5">
                      {kelasHariIni.map((item) => (
                        <div
                          key={item.kelas.id}
                          className={cn("flex flex-wrap items-center gap-x-6 gap-y-1.5 rounded-lg border p-3.5", warnaUntuk(item.mataKuliah.id))}
                        >
                          <div className="min-w-[180px]">
                            <p className="text-sm font-semibold">{item.mataKuliah.nama}</p>
                            <p className="text-xs opacity-80">{item.mataKuliah.kode} &middot; {item.mataKuliah.sks} SKS &middot; Kelas {item.kelas.kode}</p>
                          </div>
                          <span className="flex items-center gap-1.5 text-xs">
                            <Clock className="h-3.5 w-3.5" /> {item.kelas.jamMulai}–{item.kelas.jamSelesai}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs">
                            <MapPin className="h-3.5 w-3.5" /> {item.kelas.ruangan}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs">
                            <UserRound className="h-3.5 w-3.5" /> {item.dosen?.nama}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-4 overflow-x-auto">
              {data === null ? (
                <Skeleton className="h-96 w-full" />
              ) : (
                <div className="min-w-[720px]">
                  <div className="grid grid-cols-[80px_repeat(6,1fr)] gap-1.5">
                    <div />
                    {HARI_URUT.map((hari) => (
                      <div key={hari} className="text-center text-xs font-semibold text-muted-foreground pb-2">
                        {hari}
                      </div>
                    ))}
                    {SLOT_JAM.map((jam) => (
                      <React.Fragment key={jam}>
                        <div className="text-right pr-2 text-[11px] text-muted-foreground pt-1">{jam}</div>
                        {HARI_URUT.map((hari) => {
                          const item = data.find((d) => d.kelas.hari === hari && d.kelas.jamMulai === jam);
                          return (
                            <div key={hari + jam} className="min-h-[64px] rounded-lg border border-dashed border-border/60 p-1">
                              {item && (
                                <div className={cn("h-full rounded-md border p-1.5 text-[11px] leading-tight", warnaUntuk(item.mataKuliah.id))}>
                                  <p className="font-semibold line-clamp-2">{item.mataKuliah.nama}</p>
                                  <p className="opacity-80 mt-0.5">{item.kelas.ruangan}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
