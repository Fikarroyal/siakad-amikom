"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { NotebookPen, Plus, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { formatTanggal } from "@/lib/utils";
import { mataKuliahList } from "@/lib/mock";

interface Catatan {
  id: string;
  mataKuliahId: string;
  judul: string;
  isi: string;
  tanggal: string;
}

const schema = z.object({
  mataKuliahId: z.string().min(1, "Pilih mata kuliah"),
  judul: z.string().min(3, "Judul wajib diisi"),
  isi: z.string().min(3, "Isi catatan wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

function bacaSemua(): Record<string, Catatan[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("siakad_catatan_kuliah");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(map: Record<string, Catatan[]>) {
  try {
    window.localStorage.setItem("siakad_catatan_kuliah", JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export default function CatatanKuliahPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Catatan[] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Catatan | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Catatan | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (!user) return;
    setData(bacaSemua()[user.id] ?? []);
  }, [user]);

  React.useEffect(() => {
    if (formOpen) {
      reset(editing ? { mataKuliahId: editing.mataKuliahId, judul: editing.judul, isi: editing.isi } : { mataKuliahId: mataKuliahList[0]?.id ?? "", judul: "", isi: "" });
    }
  }, [formOpen, editing, reset]);

  const simpan = (list: Catatan[]) => {
    if (!user) return;
    const semua = bacaSemua();
    semua[user.id] = list;
    tulisSemua(semua);
    setData(list);
  };

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    if (editing) {
      simpan((data ?? []).map((c) => (c.id === editing.id ? { ...c, ...values, tanggal: new Date().toISOString() } : c)));
      toast.success("Catatan diperbarui", { description: values.judul });
    } else {
      const baru: Catatan = { id: `ctt-${Date.now()}`, ...values, tanggal: new Date().toISOString() };
      simpan([baru, ...(data ?? [])]);
      toast.success("Catatan ditambahkan", { description: values.judul });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleHapus = () => {
    if (!deleteTarget || !data) return;
    simpan(data.filter((c) => c.id !== deleteTarget.id));
    toast("Catatan dihapus", { description: deleteTarget.judul });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Catatan Kuliah</h1>
          <p className="text-sm text-muted-foreground">Simpan catatan pribadi per mata kuliah</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Tulis Catatan
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data === null ? null : data.length === 0 ? (
          <EmptyState icon={NotebookPen} title="Belum ada catatan" description="Tulis catatan pertama Anda." actionLabel="Tulis Catatan" onAction={() => setFormOpen(true)} className="sm:col-span-2" />
        ) : (
          data.map((c) => {
            const mk = mataKuliahList.find((m) => m.id === c.mataKuliahId);
            return (
              <Card key={c.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.judul}</p>
                      <p className="text-xs text-muted-foreground">{mk?.nama ?? "-"} &middot; {formatTanggal(c.tanggal)}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(c); setFormOpen(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(c)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{c.isi}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Catatan" : "Tulis Catatan"}</DialogTitle>
            <DialogDescription>Catatan hanya dapat dilihat oleh Anda sendiri.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Mata Kuliah</Label>
              <Controller
                control={control}
                name="mataKuliahId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mata kuliah" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {mataKuliahList.slice(0, 60).map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.nama}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="judul">Judul</Label>
              <Input id="judul" {...register("judul")} />
              {errors.judul && <p className="text-xs text-destructive">{errors.judul.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="isi">Isi Catatan</Label>
              <Textarea id="isi" rows={5} {...register("isi")} />
              {errors.isi && <p className="text-xs text-destructive">{errors.isi.message}</p>}
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
        title="Hapus Catatan"
        description={`Apakah Anda yakin ingin menghapus catatan "${deleteTarget?.judul}"?`}
        onConfirm={handleHapus}
      />
    </div>
  );
}
