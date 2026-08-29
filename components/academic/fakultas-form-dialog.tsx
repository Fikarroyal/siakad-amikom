"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
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
import type { Fakultas } from "@/lib/types";

const schema = z.object({
  kode: z.string().min(2, "Kode wajib diisi"),
  nama: z.string().min(3, "Nama fakultas wajib diisi"),
  dekan: z.string().min(3, "Nama dekan wajib diisi"),
});
type FormValues = z.infer<typeof schema>;

export function FakultasFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmitData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Fakultas | null;
  onSubmitData: (data: FormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  React.useEffect(() => {
    if (open) {
      reset(
        initialData
          ? { kode: initialData.kode, nama: initialData.nama, dekan: initialData.dekan }
          : { kode: "", nama: "", dekan: "" }
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
          <DialogTitle>{initialData ? "Edit Fakultas" : "Tambah Fakultas"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui data fakultas." : "Lengkapi data fakultas baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="kode">Kode Fakultas</Label>
            <Input id="kode" {...register("kode")} />
            {errors.kode && <p className="text-xs text-destructive">{errors.kode.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Fakultas</Label>
            <Input id="nama" {...register("nama")} />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dekan">Dekan</Label>
            <Input id="dekan" {...register("dekan")} />
            {errors.dekan && <p className="text-xs text-destructive">{errors.dekan.message}</p>}
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
