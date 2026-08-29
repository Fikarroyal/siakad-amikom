"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PackageSearch, Plus, Trash2, Pencil, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Laporan {
  id: string;
  judul: string;
  jenis: "Hilang" | "Ditemukan";
  lokasi: string;
  tanggal: string;
  status: "aktif" | "selesai";
}

const schema = z.object({
  judul: z.string().min(3, "Nama barang wajib diisi"),
  jenis: z.enum(["Hilang", "Ditemukan"]),
  lokasi: z.string().min(3, "Lokasi wajib diisi"),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

function bacaSemua(): Record<string, Laporan[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("siakad_barang_hilang");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(map: Record<string, Laporan[]>) {
  try {
    window.localStorage.setItem("siakad_barang_hilang", JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export default function BarangHilangPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Laporan[] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Laporan | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Laporan | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (!user) return;
    setData(bacaSemua()[user.id] ?? []);
  }, [user]);

  React.useEffect(() => {
    if (formOpen) {
      reset(
        editing
          ? { judul: editing.judul, jenis: editing.jenis, lokasi: editing.lokasi, tanggal: editing.tanggal.slice(0, 10) }
          : { judul: "", jenis: "Hilang", lokasi: "", tanggal: "" }
      );
    }
  }, [formOpen, editing, reset]);

  const simpan = (list: Laporan[]) => {
    if (!user) return;
    const semua = bacaSemua();
    semua[user.id] = list;
    tulisSemua(semua);
    setData(list);
  };

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    if (editing) {
      simpan((data ?? []).map((l) => (l.id === editing.id ? { ...l, ...values } : l)));
      toast.success("Laporan diperbarui", { description: values.judul });
    } else {
      const baru: Laporan = { id: `lap-${Date.now()}`, ...values, status: "aktif" };
      simpan([baru, ...(data ?? [])]);
      if (user) catatAktivitas(user.id, `Melaporkan barang ${values.jenis.toLowerCase()}`, values.judul);
      toast.success("Laporan berhasil dikirim", { description: values.judul });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const toggleSelesai = (item: Laporan) => {
    simpan((data ?? []).map((l) => (l.id === item.id ? { ...l, status: l.status === "aktif" ? "selesai" : "aktif" } : l)));
  };

  const handleHapus = () => {
    if (!deleteTarget || !data) return;
    simpan(data.filter((l) => l.id !== deleteTarget.id));
    toast("Laporan dihapus", { description: deleteTarget.judul });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Barang Hilang & Ditemukan</h1>
          <p className="text-sm text-muted-foreground">Laporkan barang yang hilang atau barang yang Anda temukan</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Buat Laporan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Laporan Saya</CardTitle>
          <CardDescription>{data?.length ?? 0} laporan telah Anda buat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {data === null ? null : data.length === 0 ? (
            <EmptyState icon={PackageSearch} title="Belum ada laporan" description="Buat laporan barang hilang atau ditemukan." actionLabel="Buat Laporan" onAction={() => setFormOpen(true)} />
          ) : (
            data.map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground truncate">{l.judul}</p>
                    <Badge variant={l.jenis === "Hilang" ? "destructive" : "success"}>{l.jenis}</Badge>
                    <Badge variant={l.status === "aktif" ? "warning" : "secondary"}>{l.status === "aktif" ? "Aktif" : "Selesai"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.lokasi} &middot; {formatTanggal(l.tanggal)}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleSelesai(l)} title="Tandai selesai/aktif">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(l); setFormOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(l)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Laporan" : "Buat Laporan"}</DialogTitle>
            <DialogDescription>Lengkapi informasi barang hilang atau ditemukan.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="judul">Nama Barang</Label>
              <Input id="judul" placeholder="Contoh: Dompet coklat, Kartu Mahasiswa" {...register("judul")} />
              {errors.judul && <p className="text-xs text-destructive">{errors.judul.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Jenis Laporan</Label>
                <Controller
                  control={control}
                  name="jenis"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hilang">Hilang</SelectItem>
                        <SelectItem value="Ditemukan">Ditemukan</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tanggal">Tanggal</Label>
                <Input id="tanggal" type="date" {...register("tanggal")} />
                {errors.tanggal && <p className="text-xs text-destructive">{errors.tanggal.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input id="lokasi" placeholder="Contoh: Perpustakaan Lantai 2" {...register("lokasi")} />
              {errors.lokasi && <p className="text-xs text-destructive">{errors.lokasi.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Batal</Button>
              <Button type="submit" disabled={isSubmitting}>Simpan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Hapus Laporan"
        description={`Apakah Anda yakin ingin menghapus laporan "${deleteTarget?.judul}"?`}
        onConfirm={handleHapus}
      />
    </div>
  );
}
