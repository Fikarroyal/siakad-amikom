"use client";

import * as React from "react";
import { CalendarCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/cards/empty-state";
import { StatusBadge } from "@/components/cards/status-badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StudentService } from "@/lib/services/student-service";
import { presensiList } from "@/lib/mock";
import { getMahasiswaProfil } from "@/lib/services/mahasiswa-profile-store";
import { useAuth } from "@/lib/hooks/use-auth";
import { formatTanggal, cn } from "@/lib/utils";

const BATAS_MINIMUM = 75;

type RekapItem = Awaited<ReturnType<typeof StudentService.getPresensiPerKelas>>[number];

export default function PresensiPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<RekapItem[] | null>(null);
  const [selected, setSelected] = React.useState<RekapItem | null>(null);

  React.useEffect(() => {
    if (!user) return;
    StudentService.getPresensiPerKelas(user).then(setData);
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Presensi</h1>
        <p className="text-sm text-muted-foreground">Rekap kehadiran per mata kuliah pada semester aktif</p>
      </div>

      {data === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="Belum ada data presensi" description="Data presensi akan muncul setelah pertemuan kuliah dimulai." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.map((item) => {
            const rendah = item.persentase < BATAS_MINIMUM;
            return (
              <Card
                key={item.kelas.id}
                className={cn("cursor-pointer hover:border-primary/40 transition-colors", rendah && "border-destructive/40")}
                onClick={() => setSelected(item)}
              >
                <CardHeader>
                  <CardTitle className="text-sm">{item.mataKuliah.nama}</CardTitle>
                  <CardDescription>{item.mataKuliah.kode} &middot; {item.total} pertemuan tercatat</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-muted-foreground">Kehadiran</span>
                    <span className={cn("text-sm font-bold", rendah ? "text-destructive" : "text-foreground")}>
                      {item.persentase}%
                    </span>
                  </div>
                  <Progress
                    value={item.persentase}
                    indicatorClassName={rendah ? "bg-destructive" : undefined}
                  />
                  <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                    <div>
                      <p className="text-sm font-semibold text-success">{item.hadir}</p>
                      <p className="text-[10px] text-muted-foreground">Hadir</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-info">{item.izin}</p>
                      <p className="text-[10px] text-muted-foreground">Izin</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-warning">{item.sakit}</p>
                      <p className="text-[10px] text-muted-foreground">Sakit</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-destructive">{item.alpha}</p>
                      <p className="text-[10px] text-muted-foreground">Alpha</p>
                    </div>
                  </div>
                  {rendah && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-destructive-bg px-2.5 py-1.5 text-[11px] text-destructive">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      Kehadiran di bawah batas minimum {BATAS_MINIMUM}%
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.mataKuliah.nama}</DialogTitle>
                <DialogDescription>Rincian kehadiran per pertemuan</DialogDescription>
              </DialogHeader>
              <div className="max-h-[320px] overflow-y-auto space-y-1.5">
                {presensiList
                  .filter((p) => p.kelasId === selected.kelas.id && user && p.mahasiswaId === getMahasiswaProfil(user).id)
                  .sort((a, b) => a.pertemuanKe - b.pertemuanKe)
                  .map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">Pertemuan {p.pertemuanKe}</p>
                        <p className="text-xs text-muted-foreground">{formatTanggal(p.tanggal)}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
