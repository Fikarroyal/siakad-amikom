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
import { prodiList } from "@/lib/mock";
import type { Mahasiswa, StatusAkademikMahasiswa } from "@/lib/types";

const schema = z.object({
  nim: z.string().min(3, "NIM wajib diisi"),
  nama: z.string().min(3, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  prodiId: z.string().min(1, "Pilih program studi"),
  angkatan: z.coerce.number().min(2015).max(2026),
  semesterAktif: z.coerce.number().min(1).max(14),
  ipk: z.coerce.number().min(0).max(4),
  status: z.enum(["aktif", "cuti", "lulus", "nonaktif", "drop_out"]),
  noTelepon: z.string().optional(),
  alamat: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const STATUS_OPSI: { value: StatusAkademikMahasiswa; label: string }[] = [
  { value: "aktif", label: "Aktif" },
  { value: "cuti", label: "Cuti" },
  { value: "lulus", label: "Lulus" },
  { value: "nonaktif", label: "Nonaktif" },
  { value: "drop_out", label: "Drop Out" },
];

export function MahasiswaFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmitData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Mahasiswa | null;
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
              nim: initialData.nim,
              nama: initialData.nama,
              email: initialData.email,
              prodiId: initialData.prodiId,
              angkatan: initialData.angkatan,
              semesterAktif: initialData.semesterAktif,
              ipk: initialData.ipk,
              status: initialData.status,
              noTelepon: initialData.noTelepon ?? "",
              alamat: initialData.alamat ?? "",
            }
          : {
              nim: "",
              nama: "",
              email: "",
              prodiId: prodiList[0]?.id ?? "",
              angkatan: 2026,
              semesterAktif: 1,
              ipk: 0,
              status: "aktif",
              noTelepon: "",
              alamat: "",
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
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Mahasiswa" : "Tambah Mahasiswa"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui data mahasiswa." : "Lengkapi data mahasiswa baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nim">NIM</Label>
              <Input id="nim" {...register("nim")} />
              {errors.nim && <p className="text-xs text-destructive">{errors.nim.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input id="nama" {...register("nama")} />
              {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
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
            {errors.prodiId && <p className="text-xs text-destructive">{errors.prodiId.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="angkatan">Angkatan</Label>
              <Input id="angkatan" type="number" {...register("angkatan")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="semesterAktif">Semester</Label>
              <Input id="semesterAktif" type="number" {...register("semesterAktif")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ipk">IPK</Label>
              <Input id="ipk" type="number" step="0.01" {...register("ipk")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Status Akademik</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPSI.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="noTelepon">No. Telepon</Label>
              <Input id="noTelepon" {...register("noTelepon")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="alamat">Alamat</Label>
              <Input id="alamat" {...register("alamat")} />
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
