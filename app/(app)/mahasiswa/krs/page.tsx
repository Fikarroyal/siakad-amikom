"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Send,
  Printer,
  Download,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/cards/status-badge";
import { EmptyState } from "@/components/cards/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  TambahMataKuliahDialog,
  type KelasTersediaItem,
} from "@/components/academic/tambah-matkul-dialog";
import { StudentService } from "@/lib/services/student-service";
import { downloadCsv } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/use-auth";
import { catatAktivitas } from "@/lib/services/activity-log";
import type { StatusKrs } from "@/lib/types";
import Link from "next/link";

interface WorkingItem extends KelasTersediaItem {
  status: StatusKrs;
}

function hitungMaxSks(ipk: number) {
  if (ipk >= 3.5) return 24;
  if (ipk >= 3.0) return 22;
  if (ipk >= 2.5) return 20;
  return 18;
}

function jamKeMenit(jam: string) {
  const [h, m] = jam.split(":").map(Number);
  return h * 60 + m;
}

function cekBentrok(a: WorkingItem, b: WorkingItem) {
  if (a.kelas.hari !== b.kelas.hari) return false;
  const aMulai = jamKeMenit(a.kelas.jamMulai);
  const aSelesai = jamKeMenit(a.kelas.jamSelesai);
  const bMulai = jamKeMenit(b.kelas.jamMulai);
  const bSelesai = jamKeMenit(b.kelas.jamSelesai);
  return aMulai < bSelesai && bMulai < aSelesai;
}

export default function KrsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<WorkingItem[]>([]);
  const [tersedia, setTersedia] = React.useState<KelasTersediaItem[]>([]);
  const [ipk, setIpk] = React.useState(3);
  const [dialogTambahOpen, setDialogTambahOpen] = React.useState(false);
  const [dialogSubmitOpen, setDialogSubmitOpen] = React.useState(false);
  const [semesterAktif, setSemesterAktif] = React.useState<string>("");
  const [prodiId, setProdiId] = React.useState<string>("");

  React.useEffect(() => {
    if (!user) return;
    (async () => {
      const [krs, profil, sem] = await Promise.all([
        StudentService.getKrsAktif(user),
        StudentService.getProfil(user),
        StudentService.getSemesterAktif(),
      ]);
      const working: WorkingItem[] = krs.map((k) => ({
        kelas: k.kelas,
        mataKuliah: k.mataKuliah,
        dosen: k.dosen,
        status: k.krs.status,
      }));
      setItems(working);
      setIpk(profil.ipk);
      setSemesterAktif(sem.nama);
      setProdiId(profil.prodiId);

      const semuaKelas = await StudentService.getKelasTersediaUntukKrs(profil.prodiId);
      const idTerpakai = new Set(working.map((w) => w.kelas.id));
      setTersedia(semuaKelas.filter((k) => !idTerpakai.has(k.kelas.id)));
      setLoading(false);
    })();
  }, [user]);

  const maxSks = hitungMaxSks(ipk);
  const totalSks = items.reduce((acc, i) => acc + i.mataKuliah.sks, 0);
  const sksTersisa = maxSks - totalSks;
  const bisaDiajukan = items.some((i) => i.status === "draft");

  const handleTambah = (item: KelasTersediaItem) => {
    if (totalSks + item.mataKuliah.sks > maxSks) {
      toast.error("Melebihi batas maksimal SKS", {
        description: `Maksimal SKS Anda semester ini adalah ${maxSks} SKS berdasarkan IPK terakhir.`,
      });
      return;
    }
    const bentrokDengan = items.find((i) =>
      cekBentrok({ ...item, status: "draft" }, i)
    );
    if (bentrokDengan) {
      toast.error("Jadwal bentrok", {
        description: `Bentrok dengan ${bentrokDengan.mataKuliah.nama} pada hari ${bentrokDengan.kelas.hari}.`,
      });
      return;
    }
    setItems((prev) => [...prev, { ...item, status: "draft" }]);
    setTersedia((prev) => prev.filter((t) => t.kelas.id !== item.kelas.id));
    toast.success("Mata kuliah ditambahkan", { description: item.mataKuliah.nama });
    setDialogTambahOpen(false);
  };

  const handleHapus = (kelasId: string) => {
    const target = items.find((i) => i.kelas.id === kelasId);
    if (!target) return;
    setItems((prev) => prev.filter((i) => i.kelas.id !== kelasId));
    setTersedia((prev) => [...prev, { kelas: target.kelas, mataKuliah: target.mataKuliah, dosen: target.dosen }]);
    toast("Mata kuliah dihapus dari KRS", { description: target.mataKuliah.nama });
  };

  const handleSubmit = () => {
    setItems((prev) => prev.map((i) => (i.status === "draft" ? { ...i, status: "diajukan" } : i)));
    setDialogSubmitOpen(false);
    if (user) catatAktivitas(user.id, "Mengajukan KRS", `${totalSks} SKS diajukan untuk semester ini`);
    toast.success("KRS berhasil diajukan", {
      description: "Menunggu persetujuan dosen wali. Anda akan menerima notifikasi setelah disetujui.",
    });
  };

  const handleDownload = () => {
    downloadCsv(
      "KRS-Semester-Aktif.csv",
      ["Kode", "Mata Kuliah", "SKS", "Kelas", "Dosen", "Hari", "Jam", "Ruangan", "Status"],
      items.map((i) => [
        i.mataKuliah.kode,
        i.mataKuliah.nama,
        i.mataKuliah.sks,
        i.kelas.kode,
        i.dosen?.nama ?? "-",
        i.kelas.hari,
        `${i.kelas.jamMulai}-${i.kelas.jamSelesai}`,
        i.kelas.ruangan,
        i.status,
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-xl font-bold text-foreground">Kartu Rencana Studi</h1>
        <p className="text-sm text-muted-foreground">
          {semesterAktif ? `Semester aktif: ${semesterAktif}` : "Memuat semester aktif..."}
        </p>
      </div>

      {!loading && !prodiId && (
        <div className="flex items-center gap-2.5 rounded-lg border border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span className="flex-1">
            Anda belum memilih program studi. Lengkapi di halaman{" "}
            <Link href="/mahasiswa/profil" className="font-medium underline underline-offset-2">
              Profil Saya
            </Link>{" "}
            sebelum mengisi KRS, agar daftar mata kuliah yang tersedia sesuai jurusan Anda.
          </span>
        </div>
      )}

      {/* Ringkasan SKS */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full sm:w-auto">
              <div>
                <p className="text-xs text-muted-foreground">IPK Terakhir</p>
                <p className="font-display text-lg font-bold text-foreground">{ipk.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Maksimal SKS</p>
                <p className="font-display text-lg font-bold text-foreground">{maxSks}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">SKS Tersisa</p>
                <p className={`font-display text-lg font-bold ${sksTersisa < 0 ? "text-destructive" : "text-foreground"}`}>
                  {sksTersisa}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-64">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">SKS Diambil</span>
                <span className="font-medium text-foreground">{totalSks} / {maxSks}</span>
              </div>
              <Progress value={Math.min((totalSks / maxSks) * 100, 100)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabel KRS */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Daftar Mata Kuliah</CardTitle>
            <CardDescription>{items.length} mata kuliah dipilih pada semester ini</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload} disabled={items.length === 0}>
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Unduh</span>
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.print()} disabled={items.length === 0}>
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Cetak</span>
            </Button>
            <Button size="sm" onClick={() => setDialogTambahOpen(true)} disabled={!prodiId}>
              <Plus className="h-3.5 w-3.5" />
              Tambah
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Belum ada mata kuliah"
              description={
                prodiId
                  ? "Mulai susun rencana studi semester ini dengan menambahkan mata kuliah."
                  : "Lengkapi program studi Anda di halaman Profil Saya terlebih dahulu."
              }
              actionLabel={prodiId ? "Tambah Mata Kuliah" : "Lengkapi Profil"}
              onAction={() => (prodiId ? setDialogTambahOpen(true) : router.push("/mahasiswa/profil"))}
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>SKS</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Dosen</TableHead>
                  <TableHead>Jadwal</TableHead>
                  <TableHead>Ruangan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.kelas.id}>
                    <TableCell className="font-mono text-xs">{item.mataKuliah.kode}</TableCell>
                    <TableCell className="font-medium">{item.mataKuliah.nama}</TableCell>
                    <TableCell>{item.mataKuliah.sks}</TableCell>
                    <TableCell>{item.kelas.kode}</TableCell>
                    <TableCell className="max-w-[160px] truncate">{item.dosen?.nama}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {item.kelas.hari}, {item.kelas.jamMulai}–{item.kelas.jamSelesai}
                    </TableCell>
                    <TableCell>{item.kelas.ruangan}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {item.status !== "disetujui" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleHapus(item.kelas.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {bisaDiajukan && (
        <div className="flex justify-end">
          <Button size="lg" onClick={() => setDialogSubmitOpen(true)}>
            <Send className="h-4 w-4" />
            Ajukan KRS
          </Button>
        </div>
      )}

      <TambahMataKuliahDialog
        open={dialogTambahOpen}
        onOpenChange={setDialogTambahOpen}
        daftarTersedia={tersedia}
        onTambah={handleTambah}
      />

      <Dialog open={dialogSubmitOpen} onOpenChange={setDialogSubmitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Konfirmasi Pengajuan KRS
            </DialogTitle>
            <DialogDescription>
              Pastikan mata kuliah yang Anda pilih sudah benar. Setelah diajukan, KRS akan
              menunggu persetujuan dosen wali.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Mata Kuliah</span>
              <span className="font-medium text-foreground">{items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total SKS</span>
              <span className="font-medium text-foreground">{totalSks} SKS</span>
            </div>
          </div>
          {sksTersisa < 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-destructive-bg p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Total SKS melebihi batas maksimal. Kurangi mata kuliah sebelum mengajukan.
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogSubmitOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSubmit} disabled={sksTersisa < 0}>
              Ajukan Sekarang
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
