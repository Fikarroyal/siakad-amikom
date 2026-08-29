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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Ruangan } from "@/lib/types";

const schema = z.object({
  kode: z.string().min(2, "Kode wajib diisi"),
  nama: z.string().min(3, "Nama ruangan wajib diisi"),
  gedung: z.string().min(1, "Gedung wajib diisi"),
  kapasitas: z.coerce.number().min(1, "Kapasitas wajib diisi"),
  jenis: z.enum(["kelas", "laboratorium", "aula"]),
});
type FormValues = z.infer<typeof schema>;

export function RuanganFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmitData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Ruangan | null;
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
              gedung: initialData.gedung,
              kapasitas: initialData.kapasitas,
              jenis: initialData.jenis,
            }
          : { kode: "", nama: "", gedung: "Gedung A", kapasitas: 40, jenis: "kelas" }
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Ruangan" : "Tambah Ruangan"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui data ruangan." : "Lengkapi data ruangan baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="kode">Kode Ruangan</Label>
              <Input id="kode" {...register("kode")} />
              {errors.kode && <p className="text-xs text-destructive">{errors.kode.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gedung">Gedung</Label>
              <Input id="gedung" {...register("gedung")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Ruangan</Label>
            <Input id="nama" {...register("nama")} />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="kapasitas">Kapasitas</Label>
              <Input id="kapasitas" type="number" {...register("kapasitas")} />
            </div>
            <div className="space-y-1.5">
              <Label>Jenis</Label>
              <Controller
                control={control}
                name="jenis"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kelas">Kelas</SelectItem>
                      <SelectItem value="laboratorium">Laboratorium</SelectItem>
                      <SelectItem value="aula">Aula</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
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
