"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Plus, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { cn, formatTanggal } from "@/lib/utils";
import { dosenList } from "@/lib/mock";

interface Ulasan {
  id: string;
  dosenId: string;
  rating: number;
  ulasan: string;
  tanggal: string;
}

const schema = z.object({
  dosenId: z.string().min(1, "Pilih dosen"),
  rating: z.number().min(1, "Beri rating minimal 1").max(5),
  ulasan: z.string().min(5, "Ulasan wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

function bacaSemua(): Record<string, Ulasan[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("siakad_ulasan_dosen");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(map: Record<string, Ulasan[]>) {
  try {
    window.localStorage.setItem("siakad_ulasan_dosen", JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}>
          <Star className={cn("h-6 w-6", n <= value ? "fill-warning text-warning" : "text-border")} />
        </button>
      ))}
    </div>
  );
}

export default function UlasanDosenPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Ulasan[] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Ulasan | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Ulasan | null>(null);

  const { control, register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (!user) return;
    setData(bacaSemua()[user.id] ?? []);
  }, [user]);

  React.useEffect(() => {
    if (formOpen) {
      reset(editing ? { dosenId: editing.dosenId, rating: editing.rating, ulasan: editing.ulasan } : { dosenId: dosenList[0]?.id ?? "", rating: 0, ulasan: "" });
    }
  }, [formOpen, editing, reset]);

  const simpan = (list: Ulasan[]) => {
    if (!user) return;
    const semua = bacaSemua();
    semua[user.id] = list;
    tulisSemua(semua);
    setData(list);
  };

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    if (editing) {
      simpan((data ?? []).map((u) => (u.id === editing.id ? { ...u, ...values, tanggal: new Date().toISOString() } : u)));
      toast.success("Ulasan diperbarui");
    } else {
      const baru: Ulasan = { id: `uls-${Date.now()}`, ...values, tanggal: new Date().toISOString() };
      simpan([baru, ...(data ?? [])]);
      toast.success("Ulasan berhasil dikirim");
    }
    setFormOpen(false);
    setEditing(null);
  };

  const handleHapus = () => {
    if (!deleteTarget || !data) return;
    simpan(data.filter((u) => u.id !== deleteTarget.id));
    toast("Ulasan dihapus");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Ulasan Dosen</h1>
          <p className="text-sm text-muted-foreground">Berikan penilaian dan ulasan untuk dosen pengampu Anda</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Tulis Ulasan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ulasan Saya</CardTitle>
          <CardDescription>{data?.length ?? 0} ulasan telah Anda tulis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {data === null ? null : data.length === 0 ? (
            <EmptyState icon={Star} title="Belum ada ulasan" description="Bagikan pengalaman perkuliahan Anda." actionLabel="Tulis Ulasan" onAction={() => setFormOpen(true)} />
          ) : (
            data.map((u) => {
              const dosen = dosenList.find((d) => d.id === u.dosenId);
              return (
                <div key={u.id} className="rounded-lg border border-border p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{dosen?.nama ?? "-"}</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={cn("h-3.5 w-3.5", n <= u.rating ? "fill-warning text-warning" : "text-border")} />
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(u); setFormOpen(true); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(u)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{u.ulasan}</p>
                  <p className="text-[11px] text-muted-foreground mt-1.5">{formatTanggal(u.tanggal)}</p>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Ulasan" : "Tulis Ulasan"}</DialogTitle>
            <DialogDescription>Ulasan bersifat pribadi dan hanya dapat Anda lihat sendiri.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Dosen</Label>
              <Controller
                control={control}
                name="dosenId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih dosen" />
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
            <div className="space-y-1.5">
              <Label>Rating</Label>
              <Controller
                control={control}
                name="rating"
                render={({ field }) => <StarPicker value={field.value ?? 0} onChange={field.onChange} />}
              />
              {errors.rating && <p className="text-xs text-destructive">{errors.rating.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ulasan">Ulasan</Label>
              <Textarea id="ulasan" rows={4} {...register("ulasan")} />
              {errors.ulasan && <p className="text-xs text-destructive">{errors.ulasan.message}</p>}
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
        title="Hapus Ulasan"
        description="Apakah Anda yakin ingin menghapus ulasan ini?"
        onConfirm={handleHapus}
      />
    </div>
  );
}
