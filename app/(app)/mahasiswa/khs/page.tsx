"use client";

import * as React from "react";
import { Download, Printer, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/cards/empty-state";
import { StudentService } from "@/lib/services/student-service";
import { downloadCsv } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";

export default function KhsPage() {
  const { user } = useAuth();
  const [semua, setSemua] = React.useState<Awaited<ReturnType<typeof StudentService.getRiwayatNilai>> | null>(null);
  const [profil, setProfil] = React.useState<{ nama: string; nim: string } | null>(null);
  const [semesterDipilih, setSemesterDipilih] = React.useState<string>("");

  React.useEffect(() => {
    if (!user) return;
    StudentService.getRiwayatNilai(user).then((data) => {
      setSemua(data);
      if (data.length > 0) setSemesterDipilih(data[0].semesterAkademikId);
    });
    StudentService.getProfil(user).then((p) => setProfil({ nama: p.nama, nim: p.nim }));
  }, [user]);

  const daftarSemester = React.useMemo(() => {
    if (!semua) return [];
    const map = new Map<string, string>();
    semua.forEach((n) => {
      // ambil label dari salah satu record (tersimpan di id semester)
      map.set(n.semesterAkademikId, n.semesterAkademikId);
    });
    return Array.from(map.keys());
  }, [semua]);

  const nilaiSemester = semua?.filter((n) => n.semesterAkademikId === semesterDipilih) ?? [];
  const totalSks = nilaiSemester.reduce((acc, n) => acc + (n.mataKuliah?.sks ?? 0), 0);
  const totalBobot = nilaiSemester.reduce((acc, n) => acc + n.bobot * (n.mataKuliah?.sks ?? 0), 0);
  const ips = totalSks > 0 ? (totalBobot / totalSks).toFixed(2) : "0.00";

  const SEMESTER_LABEL: Record<string, string> = {
    "sem-2024-genap": "Genap 2023/2024",
    "sem-2024-ganjil": "Ganjil 2024/2025",
    "sem-2024-genap-2": "Genap 2024/2025",
    "sem-2025-ganjil": "Ganjil 2025/2026",
    "sem-2025-genap": "Genap 2025/2026",
  };

  const handleDownload = () => {
    downloadCsv(
      `KHS-${semesterDipilih}.csv`,
      ["Kode", "Mata Kuliah", "SKS", "Nilai Angka", "Nilai Huruf", "Bobot"],
      nilaiSemester.map((n) => [
        n.mataKuliah?.kode ?? "-",
        n.mataKuliah?.nama ?? "-",
        n.mataKuliah?.sks ?? 0,
        n.nilaiAngka,
        n.nilaiHuruf,
        n.bobot,
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-xl font-bold text-foreground">Kartu Hasil Studi</h1>
        <p className="text-sm text-muted-foreground">Rekap nilai per semester</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <CardTitle className="whitespace-nowrap">Semester</CardTitle>
            <Select value={semesterDipilih} onValueChange={setSemesterDipilih}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Pilih semester" />
              </SelectTrigger>
              <SelectContent>
                {daftarSemester.map((s) => (
                  <SelectItem key={s} value={s}>
                    {SEMESTER_LABEL[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={nilaiSemester.length === 0}>
              <Download className="h-3.5 w-3.5" /> Unduh
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} disabled={nilaiSemester.length === 0}>
              <Printer className="h-3.5 w-3.5" /> Cetak
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {semua === null ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : nilaiSemester.length === 0 ? (
            <EmptyState icon={FileText} title="Belum ada data nilai" description="Data KHS untuk semester ini belum tersedia." />
          ) : (
            <>
              <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="rounded-lg bg-secondary/60 p-3.5">
                  <p className="text-xs text-muted-foreground">Nama</p>
                  <p className="text-sm font-semibold text-foreground truncate">{profil?.nama}</p>
                </div>
                <div className="rounded-lg bg-secondary/60 p-3.5">
                  <p className="text-xs text-muted-foreground">NIM</p>
                  <p className="text-sm font-semibold text-foreground">{profil?.nim}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3.5">
                  <p className="text-xs text-muted-foreground">IPS Semester Ini</p>
                  <p className="text-sm font-semibold text-primary">{ips} &middot; {totalSks} SKS</p>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead>SKS</TableHead>
                    <TableHead>Nilai</TableHead>
                    <TableHead>Bobot</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nilaiSemester.map((n) => (
                    <TableRow key={n.id}>
                      <TableCell className="font-mono text-xs">{n.mataKuliah?.kode}</TableCell>
                      <TableCell className="font-medium">{n.mataKuliah?.nama}</TableCell>
                      <TableCell>{n.mataKuliah?.sks}</TableCell>
                      <TableCell>
                        <span className="font-semibold">{n.nilaiHuruf}</span>
                        <span className="text-muted-foreground text-xs ml-1">({n.nilaiAngka})</span>
                      </TableCell>
                      <TableCell>{n.bobot.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
