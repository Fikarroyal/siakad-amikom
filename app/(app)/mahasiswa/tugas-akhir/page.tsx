"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileCheck2, Plus, Trash2, Pencil, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/tables/confirm-dialog";
import { EmptyState } from "@/components/cards/empty-state";
import { useAuth } from "@/lib/hooks/use-auth";
import { catatAktivitas } from "@/lib/services/activity-log";
import { formatTanggal } from "@/lib/utils";
import { dosenList } from "@/lib/mock";

interface ProfilTugasAkhir {
  judul: string;
  pembimbingId: string;
  status: "diajukan" | "bimbingan" | "sidang" | "lulus";
}
interface Konsultasi {
  id: string;
  tanggal: string;
  catatan: string;
}
interface DataTA {
  profil: ProfilTugasAkhir | null;
  konsultasi: Konsultasi[];
}

const STATUS_LABEL: Record<ProfilTugasAkhir["status"], { label: string; variant: "warning" | "info" | "secondary" | "success" }> = {
  diajukan: { label: "Diajukan", variant: "warning" },
  bimbingan: { label: "Masa Bimbingan", variant: "info" },
  sidang: { label: "Menunggu Sidang", variant: "secondary" },
  lulus: { label: "Lulus", variant: "success" },
};

const profilSchema = z.object({
  judul: z.string().min(5, "Judul minimal 5 karakter"),
  pembimbingId: z.string().min(1, "Pilih dosen pembimbing"),
});
type ProfilFormValues = z.infer<typeof profilSchema>;

const konsultasiSchema = z.object({
  catatan: z.string().min(5, "Catatan bimbingan wajib diisi"),
});
type KonsultasiFormValues = z.infer<typeof konsultasiSchema>;

function bacaSemua(): Record<string, DataTA> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("siakad_tugas_akhir");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(map: Record<string, DataTA>) {
  try {
    window.localStorage.setItem("siakad_tugas_akhir", JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export default function TugasAkhirPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<DataTA | null>(null);
  const [profilFormOpen, setProfilFormOpen] = React.useState(false);
  const [konsultasiFormOpen, setKonsultasiFormOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Konsultasi | null>(null);

  const profilForm = useForm<ProfilFormValues>({ resolver: zodResolver(profilSchema) });
  const konsultasiForm = useForm<KonsultasiFormValues>({ resolver: zodResolver(konsultasiSchema) });

  React.useEffect(() => {
    if (!user) return;
    const semua = bacaSemua();
    setData(semua[user.id] ?? { profil: null, konsultasi: [] });
  }, [user]);

  React.useEffect(() => {
    if (profilFormOpen) {
      profilForm.reset(
        data?.profil
          ? { judul: data.profil.judul, pembimbingId: data.profil.pembimbingId }
          : { judul: "", pembimbingId: dosenList[0]?.id ?? "" }
      );
    }
  }, [profilFormOpen, data, profilForm]);

  const simpan = (next: DataTA) => {
    if (!user) return;
    const semua = bacaSemua();
    semua[user.id] = next;
    tulisSemua(semua);
    setData(next);
  };

  const onSubmitProfil = async (values: ProfilFormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    const isBaru = !data?.profil;
    simpan({
      profil: { ...values, status: data?.profil?.status ?? "diajukan" },
      konsultasi: data?.konsultasi ?? [],
    });
    if (user) catatAktivitas(user.id, isBaru ? "Mengajukan judul tugas akhir" : "Memperbarui data tugas akhir", values.judul);
    toast.success(isBaru ? "Judul tugas akhir diajukan" : "Data tugas akhir diperbarui");
    setProfilFormOpen(false);
  };

  const onSubmitKonsultasi = async (values: KonsultasiFormValues) => {
    await new Promise((r) => setTimeout(r, 300));
    const baru: Konsultasi = { id: `kon-${Date.now()}`, tanggal: new Date().toISOString(), catatan: values.catatan };
    simpan({ profil: data?.profil ?? null, konsultasi: [baru, ...(data?.konsultasi ?? [])] });
    if (user) catatAktivitas(user.id, "Mencatat log bimbingan tugas akhir");
    toast.success("Log bimbingan ditambahkan");
    konsultasiForm.reset();
    setKonsultasiFormOpen(false);
  };

  const handleHapusKonsultasi = () => {
    if (!deleteTarget || !data) return;
    simpan({ profil: data.profil, konsultasi: data.konsultasi.filter((k) => k.id !== deleteTarget.id) });
    toast("Log bimbingan dihapus");
  };

  const pembimbing = dosenList.find((d) => d.id === data?.profil?.pembimbingId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Tugas Akhir / Skripsi</h1>
        <p className="text-sm text-muted-foreground">Kelola judul, dosen pembimbing, dan log bimbingan tugas akhir Anda</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Data Tugas Akhir</CardTitle>
            <CardDescription>Judul dan dosen pembimbing yang diajukan</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={() => setProfilFormOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            {data?.profil ? "Edit" : "Ajukan Judul"}
          </Button>
        </CardHeader>
        <CardContent>
          {data === null ? null : !data.profil ? (
            <EmptyState icon={GraduationCap} title="Belum mengajukan judul" description="Ajukan judul tugas akhir dan pilih dosen pembimbing Anda." actionLabel="Ajukan Judul" onAction={() => setProfilFormOpen(true)} />
          ) : (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <p className="text-base font-semibold text-foreground">{data.profil.judul}</p>
                <Badge variant={STATUS_LABEL[data.profil.status].variant}>{STATUS_LABEL[data.profil.status].label}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Dosen Pembimbing: {pembimbing?.nama ?? "-"}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Log Bimbingan</CardTitle>
            <CardDescription>Catatan setiap sesi bimbingan dengan dosen pembimbing</CardDescription>
          </div>
          <Button size="sm" onClick={() => setKonsultasiFormOpen(true)} disabled={!data?.profil}>
            <Plus className="h-3.5 w-3.5" />
            Catat Bimbingan
          </Button>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {data === null ? null : data.konsultasi.length === 0 ? (
            <EmptyState icon={FileCheck2} title="Belum ada log bimbingan" description="Catat setiap sesi bimbingan agar mudah dipantau." />
          ) : (
            data.konsultasi.map((k) => (
              <div key={k.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3.5">
                <div className="min-w-0">
                  <p className="text-sm text-foreground">{k.catatan}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{formatTanggal(k.tanggal, true)}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive shrink-0" onClick={() => setDeleteTarget(k)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={profilFormOpen} onOpenChange={setProfilFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{data?.profil ? "Edit Data Tugas Akhir" : "Ajukan Judul Tugas Akhir"}</DialogTitle>
            <DialogDescription>Tentukan judul dan dosen pembimbing tugas akhir Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={profilForm.handleSubmit(onSubmitProfil)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="judul">Judul Tugas Akhir</Label>
              <Textarea id="judul" rows={3} {...profilForm.register("judul")} />
              {profilForm.formState.errors.judul && (
                <p className="text-xs text-destructive">{profilForm.formState.errors.judul.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Dosen Pembimbing</Label>
              <Controller
                control={profilForm.control}
                name="pembimbingId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dosen pembimbing" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {dosenList.slice(0, 60).map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.nama}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setProfilFormOpen(false)}>Batal</Button>
              <Button type="submit" disabled={profilForm.formState.isSubmitting}>Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={konsultasiFormOpen} onOpenChange={setKonsultasiFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Catat Log Bimbingan</DialogTitle>
            <DialogDescription>Tuliskan ringkasan hasil bimbingan hari ini.</DialogDescription>
          </DialogHeader>
          <form onSubmit={konsultasiForm.handleSubmit(onSubmitKonsultasi)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="catatan">Catatan Bimbingan</Label>
              <Textarea id="catatan" rows={4} {...konsultasiForm.register("catatan")} />
              {konsultasiForm.formState.errors.catatan && (
                <p className="text-xs text-destructive">{konsultasiForm.formState.errors.catatan.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setKonsultasiFormOpen(false)}>Batal</Button>
              <Button type="submit" disabled={konsultasiForm.formState.isSubmitting}>Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Hapus Log Bimbingan"
        description="Apakah Anda yakin ingin menghapus catatan bimbingan ini?"
        onConfirm={handleHapusKonsultasi}
      />
    </div>
  );
}
