"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, Loader2, Save, ShieldCheck, IdCard, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/cards/status-badge";
import { getMahasiswaProfil, updateMahasiswaProfil } from "@/lib/services/mahasiswa-profile-store";
import { catatAktivitas } from "@/lib/services/activity-log";
import { useAuth } from "@/lib/hooks/use-auth";
import { getInisial } from "@/lib/utils";
import { LogoMark } from "@/components/layout/logo";
import { prodiList, getProdiById, getFakultasById } from "@/lib/mock";
import type { Mahasiswa } from "@/lib/types";

const profilSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  nim: z.string().min(3, "NIM wajib diisi"),
  nik: z.string().optional(),
  prodiId: z.string().min(1, "Pilih program studi"),
  angkatan: z.coerce.number().min(2015).max(2030),
  noTelepon: z.string().min(8, "Nomor telepon minimal 8 digit"),
  alamat: z.string().min(5, "Alamat wajib diisi"),
});
type ProfilFormValues = z.infer<typeof profilSchema>;

const passwordSchema = z
  .object({
    passwordLama: z.string().min(1, "Kata sandi lama wajib diisi"),
    passwordBaru: z.string().min(8, "Minimal 8 karakter"),
    konfirmasiPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.passwordBaru === data.konfirmasiPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["konfirmasiPassword"],
  });
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfilPage() {
  const { user } = useAuth();
  const [profil, setProfil] = React.useState<Mahasiswa | null>(null);
  const [fotoPreview, setFotoPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) setProfil(getMahasiswaProfil(user));
  }, [user]);

  const {
    register: registerProfil,
    control: controlProfil,
    handleSubmit: handleSubmitProfil,
    reset: resetProfil,
    formState: { errors: errorsProfil, isSubmitting: isSubmittingProfil },
  } = useForm<ProfilFormValues>({ resolver: zodResolver(profilSchema) });

  React.useEffect(() => {
    if (profil) {
      resetProfil({
        nama: profil.nama,
        nim: profil.nim,
        nik: profil.nik ?? "",
        prodiId: profil.prodiId,
        angkatan: profil.angkatan,
        noTelepon: profil.noTelepon ?? "",
        alamat: profil.alamat ?? "",
      });
    }
  }, [profil, resetProfil]);

  const onSubmitProfil = async (values: ProfilFormValues) => {
    if (!user) return;
    await new Promise((r) => setTimeout(r, 500));
    const prodi = getProdiById(values.prodiId);
    const updated = updateMahasiswaProfil(user, { ...values, fakultasId: prodi?.fakultasId ?? profil?.fakultasId ?? "" });
    setProfil(updated);
    catatAktivitas(user.id, "Memperbarui profil", "Data biodata mahasiswa diperbarui");
    toast.success("Profil diperbarui", { description: "Perubahan data biodata berhasil disimpan." });
  };

  const {
    register: registerPass,
    handleSubmit: handleSubmitPass,
    reset: resetPass,
    formState: { errors: errorsPass, isSubmitting: isSubmittingPass },
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  const onSubmitPassword = async (values: PasswordFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    resetPass();
    if (user) catatAktivitas(user.id, "Mengubah kata sandi", "Kata sandi akun diperbarui");
    toast.success("Kata sandi berhasil diubah", { description: "Gunakan kata sandi baru saat masuk berikutnya." });
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFotoPreview(reader.result as string);
      toast.success("Foto profil diperbarui", { description: "Perubahan hanya berlaku pada sesi ini (mode demo)." });
    };
    reader.readAsDataURL(file);
  };

  if (!profil) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const prodiTerpilih = getProdiById(profil.prodiId);
  const fakultasTerpilih = getFakultasById(profil.fakultasId);
  const belumLengkap = !profil.nim || !profil.nik;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Profil Saya</h1>
        <p className="text-sm text-muted-foreground">Kelola informasi pribadi dan keamanan akun Anda</p>
      </div>

      {belumLengkap && (
        <div className="rounded-lg border border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning">
          Lengkapi biodata Anda (NIM, NIK, program studi, dan data lainnya) pada tab Informasi Pribadi agar data akademik Anda akurat.
        </div>
      )}

      <Card>
        <CardContent className="flex flex-col sm:flex-row items-center sm:items-end gap-4 p-6">
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-border">
              <AvatarImage src={fotoPreview ?? undefined} alt={profil.nama} />
              <AvatarFallback className="text-lg">{getInisial(profil.nama)}</AvatarFallback>
            </Avatar>
            <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover transition-colors">
              <Camera className="h-3.5 w-3.5" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFotoChange} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <p className="font-display text-lg font-bold text-foreground">{profil.nama}</p>
            <p className="text-sm text-muted-foreground">
              {profil.nim || "NIM belum diisi"} &middot; {prodiTerpilih?.nama ?? "Belum memilih jurusan"}
            </p>
            <div className="mt-1.5 flex items-center justify-center sm:justify-start gap-2">
              <StatusBadge status={profil.status} />
              <span className="text-xs text-muted-foreground">Angkatan {profil.angkatan}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="informasi">
        <TabsList>
          <TabsTrigger value="informasi">
            <UserRound className="h-3.5 w-3.5" /> Informasi Pribadi
          </TabsTrigger>
          <TabsTrigger value="kartu">
            <IdCard className="h-3.5 w-3.5" /> Kartu Mahasiswa
          </TabsTrigger>
          <TabsTrigger value="keamanan">
            <ShieldCheck className="h-3.5 w-3.5" /> Keamanan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="informasi">
          <Card>
            <CardHeader>
              <CardTitle>Data Pribadi</CardTitle>
              <CardDescription>Lengkapi dan perbarui biodata Anda kapan saja</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProfil(onSubmitProfil)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input id="nama" {...registerProfil("nama")} />
                    {errorsProfil.nama && <p className="text-xs text-destructive">{errorsProfil.nama.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="nim">NIM</Label>
                    <Input id="nim" placeholder="Isi NIM Anda" {...registerProfil("nim")} />
                    {errorsProfil.nim && <p className="text-xs text-destructive">{errorsProfil.nim.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="nik">NIK</Label>
                    <Input id="nik" placeholder="Nomor Induk Kependudukan" {...registerProfil("nik")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input value={profil.email} disabled />
                    <p className="text-[11px] text-muted-foreground">Email terhubung ke akun, tidak dapat diubah di sini.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Program Studi</Label>
                    <Controller
                      control={controlProfil}
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
                  <div className="space-y-1.5">
                    <Label>Fakultas</Label>
                    <Input value={fakultasTerpilih?.nama ?? "Belum memilih jurusan"} disabled />
                    <p className="text-[11px] text-muted-foreground">Mengikuti program studi yang dipilih.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="angkatan">Angkatan</Label>
                    <Input id="angkatan" type="number" {...registerProfil("angkatan")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="noTelepon">Nomor Telepon</Label>
                    <Input id="noTelepon" {...registerProfil("noTelepon")} />
                    {errorsProfil.noTelepon && <p className="text-xs text-destructive">{errorsProfil.noTelepon.message}</p>}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Textarea id="alamat" rows={3} {...registerProfil("alamat")} />
                  {errorsProfil.alamat && <p className="text-xs text-destructive">{errorsProfil.alamat.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmittingProfil}>
                  {isSubmittingProfil ? <Loader2 className="animate-spin" /> : <Save />}
                  Simpan Perubahan
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kartu">
          <div className="max-w-md">
            <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-primary-foreground shadow-soft-md">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }}
              />
              <div className="relative flex items-center justify-between">
                <LogoMark className="h-8 w-8 bg-white/15 [&>rect]:fill-transparent" />
                <span className="text-[10px] font-semibold tracking-wide uppercase text-white/70">Kartu Tanda Mahasiswa</span>
              </div>
              <div className="relative mt-6 flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white/30">
                  <AvatarImage src={fotoPreview ?? undefined} alt={profil.nama} />
                  <AvatarFallback className="bg-white/15 text-white">{getInisial(profil.nama)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-display text-base font-bold leading-tight">{profil.nama}</p>
                  <p className="text-sm text-white/80 mt-0.5">{profil.nim || "-"}</p>
                  <p className="text-xs text-white/70 mt-0.5">{prodiTerpilih?.nama ?? "-"}</p>
                </div>
              </div>
              <div className="relative mt-6 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-white/60">Berlaku Hingga</p>
                  <p className="text-xs font-medium">{profil.angkatan + 5}</p>
                </div>
                <p className="font-mono text-[11px] tracking-widest text-white/80">UAY-{profil.nim || "----"}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Tunjukkan kartu digital ini saat diperlukan untuk keperluan verifikasi identitas di lingkungan kampus.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="keamanan">
          <Card>
            <CardHeader>
              <CardTitle>Ubah Kata Sandi</CardTitle>
              <CardDescription>Gunakan kata sandi yang kuat dan tidak digunakan di layanan lain</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPass(onSubmitPassword)} className="space-y-4 max-w-sm">
                <div className="space-y-1.5">
                  <Label htmlFor="passwordLama">Kata Sandi Saat Ini</Label>
                  <Input id="passwordLama" type="password" {...registerPass("passwordLama")} />
                  {errorsPass.passwordLama && <p className="text-xs text-destructive">{errorsPass.passwordLama.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="passwordBaru">Kata Sandi Baru</Label>
                  <Input id="passwordBaru" type="password" {...registerPass("passwordBaru")} />
                  {errorsPass.passwordBaru && <p className="text-xs text-destructive">{errorsPass.passwordBaru.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="konfirmasiPassword">Konfirmasi Kata Sandi Baru</Label>
                  <Input id="konfirmasiPassword" type="password" {...registerPass("konfirmasiPassword")} />
                  {errorsPass.konfirmasiPassword && <p className="text-xs text-destructive">{errorsPass.konfirmasiPassword.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmittingPass}>
                  {isSubmittingPass ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                  Perbarui Kata Sandi
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
