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
import type { Dosen } from "@/lib/types";

const JABATAN_OPSI = ["Tenaga Pengajar", "Asisten Ahli", "Lektor", "Lektor Kepala", "Guru Besar"];

const schema = z.object({
  nidn: z.string().min(3, "NIDN wajib diisi"),
  nama: z.string().min(3, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  prodiId: z.string().min(1, "Pilih program studi"),
  jabatanAkademik: z.string().min(1, "Pilih jabatan akademik"),
  status: z.enum(["aktif", "nonaktif"]),
});
type FormValues = z.infer<typeof schema>;

export function DosenFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmitData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Dosen | null;
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
              nidn: initialData.nidn,
              nama: initialData.nama,
              email: initialData.email,
              prodiId: initialData.prodiId,
              jabatanAkademik: initialData.jabatanAkademik,
              status: initialData.status,
            }
          : {
              nidn: "",
              nama: "",
              email: "",
              prodiId: prodiList[0]?.id ?? "",
              jabatanAkademik: "Asisten Ahli",
              status: "aktif",
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
          <DialogTitle>{initialData ? "Edit Dosen" : "Tambah Dosen"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Perbarui data dosen." : "Lengkapi data dosen baru."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nidn">NIDN</Label>
              <Input id="nidn" {...register("nidn")} />
              {errors.nidn && <p className="text-xs text-destructive">{errors.nidn.message}</p>}
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Jabatan Akademik</Label>
              <Controller
                control={control}
                name="jabatanAkademik"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {JABATAN_OPSI.map((j) => (
                        <SelectItem key={j} value={j}>
                          {j}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aktif">Aktif</SelectItem>
                      <SelectItem value="nonaktif">Nonaktif</SelectItem>
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
