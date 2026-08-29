"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ListTodo, Plus, Trash2, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { cn, formatTanggal } from "@/lib/utils";

interface Agenda {
  id: string;
  judul: string;
  tenggat: string;
  prioritas: "tinggi" | "sedang" | "rendah";
  selesai: boolean;
}

const PRIORITAS_LABEL: Record<Agenda["prioritas"], { label: string; variant: "destructive" | "warning" | "secondary" }> = {
  tinggi: { label: "Tinggi", variant: "destructive" },
  sedang: { label: "Sedang", variant: "warning" },
  rendah: { label: "Rendah", variant: "secondary" },
};

const schema = z.object({
  judul: z.string().min(3, "Judul wajib diisi"),
  tenggat: z.string().min(1, "Tenggat wajib diisi"),
  prioritas: z.enum(["tinggi", "sedang", "rendah"]),
});
type FormValues = z.infer<typeof schema>;

function bacaSemua(): Record<string, Agenda[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("siakad_agenda_pribadi");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(map: Record<string, Agenda[]>) {
  try {
    window.localStorage.setItem("siakad_agenda_pribadi", JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export default function AgendaPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Agenda[] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Agenda | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Agenda | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  React.useEffect(() => {
    if (!user) return;
    setData(bacaSemua()[user.id] ?? []);
  }, [user]);

  React.useEffect(() => {
    if (formOpen) {
      reset(editing ? { judul: editing.judul, tenggat: editing.tenggat.slice(0, 10), prioritas: editing.prioritas } : { judul: "", tenggat: "", prioritas: "sedang" });
    }
  }, [formOpen, editing, reset]);

  const simpan = (list: Agenda[]) => {
    if (!user) return;
    const semua = bacaSemua();
    semua[user.id] = list;
    tulisSemua(semua);
    setData(list);
  };

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    if (editing) {
      simpan((data ?? []).map((a) => (a.id === editing.id ? { ...a, ...values } : a)));
      toast.success("Agenda diperbarui", { description: values.judul });
    } else {
      const baru: Agenda = { id: `agd-${Date.now()}`, ...values, selesai: false };
      simpan([baru, ...(data ?? [])]);
      toast.success("Agenda ditambahkan", { description: values.judul });
    }
    setFormOpen(false);
    setEditing(null);
  };

  const toggleSelesai = (item: Agenda) => {
    simpan((data ?? []).map((a) => (a.id === item.id ? { ...a, selesai: !a.selesai } : a)));
  };

  const handleHapus = () => {
    if (!deleteTarget || !data) return;
    simpan(data.filter((a) => a.id !== deleteTarget.id));
    toast("Agenda dihapus", { description: deleteTarget.judul });
  };

  const belumSelesai = data?.filter((a) => !a.selesai) ?? [];
  const sudahSelesai = data?.filter((a) => a.selesai) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Agenda Pribadi</h1>
          <p className="text-sm text-muted-foreground">Kelola pengingat tugas dan kegiatan Anda</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <Plus className="h-3.5 w-3.5" />
          Tambah Agenda
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Belum Selesai</CardTitle>
          <CardDescription>{belumSelesai.length} agenda menunggu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {data === null ? null : belumSelesai.length === 0 ? (
            <EmptyState icon={ListTodo} title="Tidak ada agenda tertunda" description="Semua agenda Anda telah selesai." />
          ) : (
            belumSelesai.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Checkbox checked={a.selesai} onCheckedChange={() => toggleSelesai(a)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{a.judul}</p>
                  <p className="text-xs text-muted-foreground">Tenggat {formatTanggal(a.tenggat)}</p>
                </div>
                <Badge variant={PRIORITAS_LABEL[a.prioritas].variant}>{PRIORITAS_LABEL[a.prioritas].label}</Badge>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(a); setFormOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(a)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {sudahSelesai.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Selesai</CardTitle>
            <CardDescription>{sudahSelesai.length} agenda telah selesai</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sudahSelesai.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border p-3 opacity-60">
                <Checkbox checked={a.selesai} onCheckedChange={() => toggleSelesai(a)} />
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-medium text-foreground truncate line-through")}>{a.judul}</p>
                  <p className="text-xs text-muted-foreground">Tenggat {formatTanggal(a.tenggat)}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(a)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Agenda" : "Tambah Agenda"}</DialogTitle>
            <DialogDescription>Atur pengingat tugas atau kegiatan pribadi Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="judul">Judul</Label>
              <Input id="judul" {...register("judul")} />
              {errors.judul && <p className="text-xs text-destructive">{errors.judul.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="tenggat">Tenggat</Label>
                <Input id="tenggat" type="date" {...register("tenggat")} />
                {errors.tenggat && <p className="text-xs text-destructive">{errors.tenggat.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Prioritas</Label>
                <Controller
                  control={control}
                  name="prioritas"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tinggi">Tinggi</SelectItem>
                        <SelectItem value="sedang">Sedang</SelectItem>
                        <SelectItem value="rendah">Rendah</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
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
        title="Hapus Agenda"
        description={`Apakah Anda yakin ingin menghapus agenda "${deleteTarget?.judul}"?`}
        onConfirm={handleHapus}
      />
    </div>
  );
}
