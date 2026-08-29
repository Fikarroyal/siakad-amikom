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
import { fakultasList } from "@/lib/mock";
import type { ProgramStudi } from "@/lib/types";

const schema = z.object({
  kode: z.string().min(2, "Kode wajib diisi"),
  nama: z.string().min(3, "Nama program studi wajib diisi"),
  jenjang: z.enum(["D3", "D4", "S1", "S2", "S3"]),
  fakultasId: z.string().min(1, "Pilih fakultas"),
  kaprodi: z.string().min(3, "Nama kaprodi wajib diisi"),
  akreditasi: z.enum(["Unggul", "Baik Sekali", "Baik", "A", "B"]),
});
type FormValues = z.infer<typeof schema>;

export function ProdiFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmitData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: ProgramStudi | null;
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
              jenjang: initialData.jenjang,
              fakultasId: initialData.fakultasId,
              kaprodi: initialData.kaprodi,
              akreditasi: initialData.akreditasi,
            }
          : {
              kode: "",
              nama: "",
              jenjang: "S1",
              fakultasId: fakultasList[0]?.id ?? "",
              kaprodi: "",
              akreditasi: "B",
            }
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
          <DialogTitle>{initialData ? "Edit Program Studi" : "Tambah Program Studi"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui data program studi." : "Lengkapi data program studi baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="kode">Kode Prodi</Label>
              <Input id="kode" {...register("kode")} />
              {errors.kode && <p className="text-xs text-destructive">{errors.kode.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Jenjang</Label>
              <Controller
                control={control}
                name="jenjang"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["D3", "D4", "S1", "S2", "S3"].map((j) => (
                        <SelectItem key={j} value={j}>
                          {j}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Program Studi</Label>
            <Input id="nama" {...register("nama")} />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Fakultas</Label>
            <Controller
              control={control}
              name="fakultasId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih fakultas" />
                  </SelectTrigger>
                  <SelectContent>
                    {fakultasList.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="kaprodi">Kepala Program Studi</Label>
              <Input id="kaprodi" {...register("kaprodi")} />
              {errors.kaprodi && <p className="text-xs text-destructive">{errors.kaprodi.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Akreditasi</Label>
              <Controller
                control={control}
                name="akreditasi"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Unggul", "Baik Sekali", "Baik", "A", "B"].map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
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
