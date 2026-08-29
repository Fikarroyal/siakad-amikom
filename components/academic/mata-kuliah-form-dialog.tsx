"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prodiList } from "@/lib/mock";
import type { MataKuliah } from "@/lib/types";

const schema = z.object({
  kode: z.string().min(2, "Kode wajib diisi"),
  nama: z.string().min(3, "Nama mata kuliah wajib diisi"),
  sks: z.coerce.number().min(1).max(6),
  semester: z.coerce.number().min(1).max(8),
  prodiId: z.string().min(1, "Pilih program studi"),
  deskripsi: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export function MataKuliahFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmitData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: MataKuliah | null;
  onSubmitData: (data: FormValues) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    if (open) {
      reset(
        initialData
          ? {
              kode: initialData.kode,
              nama: initialData.nama,
              sks: initialData.sks,
              semester: initialData.semester,
              prodiId: initialData.prodiId,
              deskripsi: initialData.deskripsi ?? "",
            }
          : { kode: "", nama: "", sks: 3, semester: 1, prodiId: prodiList[0]?.id ?? "", deskripsi: "" }
      );
    }
  }, [open, initialData, reset]);

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    onSubmitData(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui data mata kuliah." : "Lengkapi data mata kuliah baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="kode">Kode</Label>
              <Input id="kode" {...register("kode")} />
              {errors.kode && <p className="text-xs text-destructive">{errors.kode.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sks">SKS</Label>
              <Input id="sks" type="number" {...register("sks")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Mata Kuliah</Label>
            <Input id="nama" {...register("nama")} />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="semester">Semester</Label>
              <Input id="semester" type="number" {...register("semester")} />
            </div>
            <div className="space-y-1.5">
              <Label>Program Studi</Label>
              <Controller
                control={control}
                name="prodiId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih program studi" />
                    </SelectTrigger>
                    <SelectContent>
                      {prodiList.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea id="deskripsi" rows={3} {...register("deskripsi")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
