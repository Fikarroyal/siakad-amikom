"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/use-auth";

const registerSchema = z
  .object({
    nama: z.string().min(3, "Nama minimal 3 karakter"),
    noTelepon: z.string().min(8, "Nomor telepon minimal 8 digit"),
    email: z.string().min(1, "Email wajib diisi").email("Format email tidak valid"),
    password: z.string().min(8, "Kata sandi minimal 8 karakter"),
    konfirmasiPassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.konfirmasiPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["konfirmasiPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { registerAndLogin } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { nama: "", noTelepon: "", email: "", password: "", konfirmasiPassword: "" },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const result = await registerAndLogin({ ...values, role: "mahasiswa" });
    if (result.success) {
      toast.success("Pendaftaran berhasil", { description: "Selamat datang di SIAKAD Universitas." });
      router.push("/dashboard");
    } else {
      toast.error("Gagal mendaftar", { description: result.message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="nama">Nama Lengkap</Label>
        <Input id="nama" placeholder="Nama sesuai identitas" autoComplete="name" {...register("nama")} />
        {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="noTelepon">Nomor Telepon</Label>
        <Input
          id="noTelepon"
          type="tel"
          placeholder="08xxxxxxxxxx"
          autoComplete="tel"
          {...register("noTelepon")}
        />
        {errors.noTelepon && <p className="text-xs text-destructive">{errors.noTelepon.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nama@university.ac.id"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Kata Sandi</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="konfirmasiPassword">Konfirmasi Kata Sandi</Label>
        <Input
          id="konfirmasiPassword"
          type={showPassword ? "text" : "password"}
          placeholder="Ulangi kata sandi"
          autoComplete="new-password"
          {...register("konfirmasiPassword")}
        />
        {errors.konfirmasiPassword && (
          <p className="text-xs text-destructive">{errors.konfirmasiPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <UserPlus />}
        Daftar Sekarang
      </Button>
    </form>
  );
}
