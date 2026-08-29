"use client";

import * as React from "react";
import { Download, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { StudentService } from "@/lib/services/student-service";
import { downloadCsv } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";

const SEMESTER_LABEL: Record<string, string> = {
  "sem-2024-genap": "Genap 2023/2024",
  "sem-2024-ganjil": "Ganjil 2024/2025",
  "sem-2025-ganjil": "Ganjil 2025/2026",
  "sem-2025-genap": "Genap 2025/2026",
};

export default function TranskripPage() {
  const { user } = useAuth();
  const [nilai, setNilai] = React.useState<Awaited<ReturnType<typeof StudentService.getRiwayatNilai>> | null>(null);
  const [profil, setProfil] = React.useState<Awaited<ReturnType<typeof StudentService.getProfil>> | null>(null);

  React.useEffect(() => {
    if (!user) return;
    StudentService.getRiwayatNilai(user).then(setNilai);
    StudentService.getProfil(user).then(setProfil);
  }, [user]);

  const totalSks = nilai?.reduce((acc, n) => acc + (n.mataKuliah?.sks ?? 0), 0) ?? 0;
  const totalBobot = nilai?.reduce((acc, n) => acc + n.bobot * (n.mataKuliah?.sks ?? 0), 0) ?? 0;
  const ipk = totalSks > 0 ? (totalBobot / totalSks).toFixed(2) : "0.00";

  const handleDownload = () => {
    if (!nilai) return;
    downloadCsv(
      "Transkrip-Nilai.csv",
      ["Semester", "Kode", "Mata Kuliah", "SKS", "Nilai Huruf", "Nilai Angka", "Bobot"],
      nilai.map((n) => [
        SEMESTER_LABEL[n.semesterAkademikId] ?? n.semesterAkademikId,
        n.mataKuliah?.kode ?? "-",
        n.mataKuliah?.nama ?? "-",
        n.mataKuliah?.sks ?? 0,
        n.nilaiHuruf,
        n.nilaiAngka,
        n.bobot,
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Transkrip Nilai</h1>
          <p className="text-sm text-muted-foreground">Rekap seluruh nilai akademik yang telah ditempuh</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!nilai?.length}>
            <Download className="h-3.5 w-3.5" /> Unduh
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()} disabled={!nilai?.length}>
            <Printer className="h-3.5 w-3.5" /> Cetak
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Nama</p>
              <p className="text-sm font-semibold text-foreground truncate">{profil?.nama ?? user?.nama}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">NIM</p>
              <p className="text-sm font-semibold text-foreground">{profil?.nim}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Program Studi</p>
              <p className="text-sm font-semibold text-foreground truncate">{profil?.prodi?.nama}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">IPK Kumulatif</p>
              <p className="text-sm font-bold text-primary">{ipk} &middot; {totalSks} SKS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rincian Mata Kuliah</CardTitle>
          <CardDescription>Diurutkan berdasarkan semester</CardDescription>
        </CardHeader>
        <CardContent>
          {nilai === null ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Semester</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>SKS</TableHead>
                  <TableHead>Nilai</TableHead>
                  <TableHead>Bobot</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {nilai.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {SEMESTER_LABEL[n.semesterAkademikId] ?? n.semesterAkademikId}
                    </TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
