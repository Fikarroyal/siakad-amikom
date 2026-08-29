"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Car, Plus, Trash2, Pencil } from "lucide-react";
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

interface Kendaraan {
  id: string;
  platNomor: string;
  jenis: "Motor" | "Mobil";
  merkModel: string;
  status: "aktif" | "nonaktif";
}

const schema = z.object({
  platNomor: z.string().min(3, "Nomor plat wajib diisi"),
  jenis: z.enum(["Motor", "Mobil"]),
  merkModel: z.string().min(2, "Merk/model wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

function bacaSemua(): Record<string, Kendaraan[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("siakad_parkir_kampus");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(map: Record<string, Kendaraan[]>) {
  try {
    window.localStorage.setItem("siakad_parkir_kampus", JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export default function ParkirKampusPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Kendaraan[] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Kendaraan | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Kendaraan | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (!user) return;
    setData(bacaSemua()[user.id] ?? []);
  }, [user]);

  React.useEffect(() => {
    if (formOpen) {
      reset(editing ? { platNomor: editing.platNomor, jenis: editing.jenis, merkModel: editing.merkModel } : { platNomor: "", jenis: "Motor", merkModel: "" });
    }
  }, [formOpen, editing, reset]);

  const simpan = (list: Kendaraan[]) => {
    if (!user) return;
    const semua = bacaSemua();
    semua[user.id] = list;
    tulisSemua(semua);
    setData(list);
  };

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    if (editing) {
      simpan((data ?? []).map((k) => (k.id === editing.id ? { ...k, ...values } : k)));
      toast.success("Data kendaraan diperbarui", { description: values.platNomor });
    } else {
      const baru: Kendaraan = { id: `krd-${Date.now()}`, ...values, status: "aktif" };
      simpan([baru, ...(data ?? [])]);
      if (user) catatAktivitas(user.id, "Mendaftarkan kendaraan parkir", values.platNomor);
      toast.success("Kendaraan berhasil didaftarkan", { description: values.platNomor });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleHapus = () => {
    if (!deleteTarget || !data) return;
    simpan(data.filter((k) => k.id !== deleteTarget.id));
    toast("Data kendaraan dihapus", { description: deleteTarget.platNomor });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Parkir Kampus</h1>
          <p className="text-sm text-muted-foreground">Daftarkan kendaraan Anda untuk mendapatkan akses parkir kampus</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Daftarkan Kendaraan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kendaraan Terdaftar</CardTitle>
          <CardDescription>{data?.length ?? 0} kendaraan terdaftar atas nama Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {data === null ? null : data.length === 0 ? (
            <EmptyState icon={Car} title="Belum ada kendaraan terdaftar" description="Daftarkan kendaraan agar mendapatkan akses parkir kampus." actionLabel="Daftarkan Kendaraan" onAction={() => setFormOpen(true)} />
          ) : (
            data.map((k) => (
              <div key={k.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Car className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{k.platNomor}</p>
                    <p className="text-xs text-muted-foreground">{k.jenis} &middot; {k.merkModel}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={k.status === "aktif" ? "success" : "secondary"}>{k.status === "aktif" ? "Aktif" : "Nonaktif"}</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(k); setFormOpen(true); }}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(k)}>
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
            <DialogTitle>{editing ? "Edit Kendaraan" : "Daftarkan Kendaraan"}</DialogTitle>
            <DialogDescription>Lengkapi data kendaraan untuk mendapatkan akses parkir kampus.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="platNomor">Nomor Plat</Label>
                <Input id="platNomor" placeholder="AB 1234 CD" {...register("platNomor")} />
                {errors.platNomor && <p className="text-xs text-destructive">{errors.platNomor.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Jenis Kendaraan</Label>
                <Controller
                  control={control}
                  name="jenis"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Motor">Motor</SelectItem>
                        <SelectItem value="Mobil">Mobil</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="merkModel">Merk & Model</Label>
              <Input id="merkModel" placeholder="Contoh: Honda Vario" {...register("merkModel")} />
              {errors.merkModel && <p className="text-xs text-destructive">{errors.merkModel.message}</p>}
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
        title="Hapus Data Kendaraan"
        description={`Apakah Anda yakin ingin menghapus kendaraan "${deleteTarget?.platNomor}"?`}
        onConfirm={handleHapus}
      />
    </div>
  );
}
