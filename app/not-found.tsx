import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <LogoMark className="h-10 w-10" />
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
        <FileQuestion className="h-8 w-8" />
      </div>
      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold text-foreground">Halaman Tidak Ditemukan</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan. Periksa kembali
          alamat yang Anda tuju.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Kembali ke Dashboard</Link>
      </Button>
    </div>
  );
}
