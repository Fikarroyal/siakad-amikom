"use client";

import * as React from "react";
import { Search, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/cards/empty-state";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StudentService } from "@/lib/services/student-service";
import { useAuth } from "@/lib/hooks/use-auth";

const SEMESTER_LABEL: Record<string, string> = {
  "sem-2024-genap": "Genap 2023/2024",
  "sem-2024-ganjil": "Ganjil 2024/2025",
  "sem-2025-ganjil": "Ganjil 2025/2026",
  "sem-2025-genap": "Genap 2025/2026",
};

type NilaiItem = Awaited<ReturnType<typeof StudentService.getRiwayatNilai>>[number];

function warnaHuruf(huruf: string) {
  if (["A", "AB"].includes(huruf)) return "text-success bg-success-bg";
  if (["B", "BC"].includes(huruf)) return "text-info bg-info-bg";
  if (huruf === "C") return "text-warning bg-warning-bg";
  return "text-destructive bg-destructive-bg";
}

export default function NilaiPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<NilaiItem[] | null>(null);
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<NilaiItem | null>(null);

  React.useEffect(() => {
    if (!user) return;
    StudentService.getRiwayatNilai(user).then(setData);
  }, [user]);

  const filtered = data?.filter(
    (n) =>
      n.mataKuliah?.nama.toLowerCase().includes(search.toLowerCase()) ||
      n.mataKuliah?.kode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Nilai Akademik</h1>
        <p className="text-sm text-muted-foreground">Klik mata kuliah untuk melihat rincian komponen nilai</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <CardTitle>Daftar Nilai</CardTitle>
              <CardDescription>Seluruh mata kuliah yang telah dinilai</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari mata kuliah..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {data === null ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : filtered && filtered.length === 0 ? (
            <EmptyState icon={BadgeCheck} title="Tidak ditemukan" description="Coba kata kunci pencarian lain." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered?.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelected(n)}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border p-3.5 text-left hover:border-primary/40 hover:bg-accent/30 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{n.mataKuliah?.nama}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {n.mataKuliah?.kode} &middot; {n.mataKuliah?.sks} SKS &middot; {SEMESTER_LABEL[n.semesterAkademikId]}
                    </p>
                  </div>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg font-display text-sm font-bold ${warnaHuruf(n.nilaiHuruf)}`}>
                    {n.nilaiHuruf}
                  </span>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.mataKuliah?.nama}</DialogTitle>
                <DialogDescription>
                  {selected.mataKuliah?.kode} &middot; {SEMESTER_LABEL[selected.semesterAkademikId]}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center justify-between rounded-lg bg-secondary/60 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Nilai Akhir</p>
                  <p className="font-display text-2xl font-bold text-foreground">{selected.nilaiAngka}</p>
                </div>
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl font-display text-xl font-bold ${warnaHuruf(selected.nilaiHuruf)}`}>
                  {selected.nilaiHuruf}
                </span>
              </div>
              {selected.komponen && (
                <div className="space-y-3">
                  {[
                    { label: "Tugas", value: selected.komponen.tugas },
                    { label: "UTS", value: selected.komponen.uts },
                    { label: "UAS", value: selected.komponen.uas },
                    { label: "Kehadiran", value: selected.komponen.kehadiran },
                  ].map((k) => (
                    <div key={k.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{k.label}</span>
                        <span className="font-medium text-foreground">{k.value}</span>
                      </div>
                      <Progress value={k.value} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
