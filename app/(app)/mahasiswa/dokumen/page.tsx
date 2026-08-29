"use client";

import * as React from "react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FolderOpen, Plus, Trash2, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Dokumen {
  id: string;
  judul: string;
  jenis: string;
  tanggalUpload: string;
  ukuranFile: string;
}

const JENIS_OPSI = ["KTP", "Kartu Keluarga", "Ijazah", "Sertifikat", "Transkrip Sebelumnya", "Lainnya"];

const schema = z.object({
  judul: z.string().min(3, "Nama dokumen wajib diisi"),
  jenis: z.string().min(1, "Pilih jenis dokumen"),
});
type FormValues = z.infer<typeof schema>;

function bacaSemua(): Record<string, Dokumen[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("siakad_dokumen_saya");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(map: Record<string, Dokumen[]>) {
  try {
    window.localStorage.setItem("siakad_dokumen_saya", JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export default function DokumenSayaPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Dokumen[] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Dokumen | null>(null);

  const { register, control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { judul: "", jenis: JENIS_OPSI[0] },
  });

  React.useEffect(() => {
    if (!user) return;
    setData(bacaSemua()[user.id] ?? []);
  }, [user]);

  const simpan = (list: Dokumen[]) => {
    if (!user) return;
    const semua = bacaSemua();
    semua[user.id] = list;
    tulisSemua(semua);
    setData(list);
  };

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    const baru: Dokumen = {
      id: `dok-${Date.now()}`,
      judul: values.judul,
      jenis: values.jenis,
      tanggalUpload: new Date().toISOString(),
      ukuranFile: `${(Math.random() * 3 + 0.3).toFixed(1)} MB`,
    };
    simpan([baru, ...(data ?? [])]);
    toast.success("Dokumen ditambahkan", { description: values.judul });
    reset();
    setFormOpen(false);
  };

  const handleHapus = () => {
    if (!deleteTarget || !data) return;
    simpan(data.filter((d) => d.id !== deleteTarget.id));
    toast("Dokumen dihapus", { description: deleteTarget.judul });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Dokumen Saya</h1>
          <p className="text-sm text-muted-foreground">Simpan salinan dokumen pribadi Anda (mode demo, metadata saja)</p>
        </div>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Tambah Dokumen
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Dokumen</CardTitle>
          <CardDescription>{data?.length ?? 0} dokumen tersimpan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {data === null ? null : data.length === 0 ? (
            <EmptyState icon={FolderOpen} title="Belum ada dokumen" description="Tambahkan dokumen pertama Anda." actionLabel="Tambah Dokumen" onAction={() => setFormOpen(true)} />
          ) : (
            data.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.judul}</p>
                    <p className="text-xs text-muted-foreground">{d.jenis} &middot; {d.ukuranFile} &middot; {formatTanggal(d.tanggalUpload)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive shrink-0" onClick={() => setDeleteTarget(d)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Dokumen</DialogTitle>
            <DialogDescription>Simpan metadata dokumen pribadi Anda.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="judul">Nama Dokumen</Label>
              <Input id="judul" placeholder="Contoh: KTP Raka Aditya" {...register("judul")} />
              {errors.judul && <p className="text-xs text-destructive">{errors.judul.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Jenis Dokumen</Label>
              <Controller
                control={control}
                name="jenis"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JENIS_OPSI.map((j) => (
                        <SelectItem key={j} value={j}>{j}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
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
        title="Hapus Dokumen"
        description={`Apakah Anda yakin ingin menghapus "${deleteTarget?.judul}"?`}
        onConfirm={handleHapus}
      />
    </div>
  );
}
