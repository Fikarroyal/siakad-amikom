"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/forms/register-form";
import { LogoFull, LogoMark } from "@/components/layout/logo";
import { useAuth } from "@/lib/hooks/use-auth";

export default function RegisterPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [isLoading, user, router]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Panel branding */}
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative">
          <LogoFull className="[&_span]:text-white [&_span:last-child]:text-white/70" />
        </div>

        <div className="relative max-w-md">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight">
            Bergabung sebagai Mahasiswa
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            Buat akun mahasiswa untuk mengakses KRS, jadwal kuliah, nilai,
            presensi, pembayaran, dan seluruh layanan kemahasiswaan pada satu
            platform.
          </p>
        </div>

        <p className="relative text-xs text-white/50">
          © 2026 Universitas AMIKOM Yogyakarta. Seluruh hak cipta dilindungi.
        </p>
      </div>

      {/* Panel form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="lg:hidden mb-4">
              <LogoMark className="h-12 w-12" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">Buat Akun Baru</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Lengkapi data berikut untuk mendaftar SIAKAD.
            </p>
          </div>

          <RegisterForm />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
