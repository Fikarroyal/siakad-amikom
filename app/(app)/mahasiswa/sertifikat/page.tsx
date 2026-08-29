"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Medal, Plus, Trash2, Pencil } from "lucide-react";
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

interface Sertifikat {
  id: string;
  judul: string;
  penyelenggara: string;
  tingkat: "Kampus" | "Nasional" | "Internasional";
  tanggal: string;
}

const TINGKAT_VARIANT: Record<Sertifikat["tingkat"], "secondary" | "info" | "success"> = {
  Kampus: "secondary",
  Nasional: "info",
  Internasional: "success",
};

const schema = z.object({
  judul: z.string().min(3, "Judul wajib diisi"),
  penyelenggara: z.string().min(2, "Penyelenggara wajib diisi"),
  tingkat: z.enum(["Kampus", "Nasional", "Internasional"]),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

function bacaSemua(): Record<string, Sertifikat[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("siakad_sertifikat_prestasi");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(map: Record<string, Sertifikat[]>) {
  try {
    window.localStorage.setItem("siakad_sertifikat_prestasi", JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export default function SertifikatPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Sertifikat[] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Sertifikat | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Sertifikat | null>(null);

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
          ? { judul: editing.judul, penyelenggara: editing.penyelenggara, tingkat: editing.tingkat, tanggal: editing.tanggal.slice(0, 10) }
          : { judul: "", penyelenggara: "", tingkat: "Kampus", tanggal: "" }
      );
    }
  }, [formOpen, editing, reset]);

  const simpan = (list: Sertifikat[]) => {
    if (!user) return;
    const semua = bacaSemua();
    semua[user.id] = list;
    tulisSemua(semua);
    setData(list);
  };

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    if (editing) {
      simpan((data ?? []).map((s) => (s.id === editing.id ? { ...s, ...values } : s)));
      toast.success("Sertifikat diperbarui", { description: values.judul });
    } else {
      const baru: Sertifikat = { id: `srt-${Date.now()}`, ...values };
      simpan([baru, ...(data ?? [])]);
      if (user) catatAktivitas(user.id, "Menambahkan sertifikat/prestasi", values.judul);
      toast.success("Sertifikat ditambahkan", { description: values.judul });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleHapus = () => {
    if (!deleteTarget || !data) return;
    simpan(data.filter((s) => s.id !== deleteTarget.id));
    toast("Sertifikat dihapus", { description: deleteTarget.judul });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Sertifikat & Prestasi</h1>
          <p className="text-sm text-muted-foreground">Kumpulan sertifikat dan prestasi yang pernah Anda raih</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Tambah Sertifikat
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data === null ? null : data.length === 0 ? (
          <EmptyState icon={Medal} title="Belum ada sertifikat" description="Tambahkan sertifikat atau prestasi pertama Anda." actionLabel="Tambah Sertifikat" onAction={() => setFormOpen(true)} className="sm:col-span-2" />
        ) : (
          data.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                      <Medal className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{s.judul}</p>
                      <p className="text-xs text-muted-foreground">{s.penyelenggara}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(s); setFormOpen(true); }}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(s)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={TINGKAT_VARIANT[s.tingkat]}>{s.tingkat}</Badge>
                  <span className="text-[11px] text-muted-foreground">{formatTanggal(s.tanggal)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Sertifikat" : "Tambah Sertifikat"}</DialogTitle>
            <DialogDescription>Catat sertifikat atau prestasi yang pernah Anda raih.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="judul">Judul Sertifikat/Prestasi</Label>
              <Input id="judul" {...register("judul")} />
              {errors.judul && <p className="text-xs text-destructive">{errors.judul.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="penyelenggara">Penyelenggara</Label>
              <Input id="penyelenggara" {...register("penyelenggara")} />
              {errors.penyelenggara && <p className="text-xs text-destructive">{errors.penyelenggara.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Tingkat</Label>
                <Controller
                  control={control}
                  name="tingkat"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kampus">Kampus</SelectItem>
                        <SelectItem value="Nasional">Nasional</SelectItem>
                        <SelectItem value="Internasional">Internasional</SelectItem>
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
        title="Hapus Sertifikat"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.judul}"?`}
        onConfirm={handleHapus}
      />
    </div>
  );
}
