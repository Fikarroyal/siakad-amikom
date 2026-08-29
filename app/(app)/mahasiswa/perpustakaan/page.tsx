"use client";

import * as React from "react";
import { toast } from "sonner";
import { Search, Library, BookMarked, Undo2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { EmptyState } from "@/components/cards/empty-state";
import { useAuth } from "@/lib/hooks/use-auth";
import { catatAktivitas } from "@/lib/services/activity-log";
import { formatTanggal } from "@/lib/utils";

interface Buku {
  id: string;
  judul: string;
  penulis: string;
  kategori: string;
  stok: number;
}

interface Peminjaman {
  id: string;
  bukuId: string;
  tanggalPinjam: string;
  tenggatKembali: string;
}

const KATALOG_AWAL: Buku[] = [
  { id: "bk-1", judul: "Algoritma dan Pemrograman", penulis: "Rinaldi Munir", kategori: "Ilmu Komputer", stok: 4 },
  { id: "bk-2", judul: "Basis Data Terapan", penulis: "Fathansyah", kategori: "Ilmu Komputer", stok: 2 },
  { id: "bk-3", judul: "Rekayasa Perangkat Lunak", penulis: "Roger Pressman", kategori: "Ilmu Komputer", stok: 0 },
  { id: "bk-4", judul: "Pengantar Manajemen", penulis: "James Stoner", kategori: "Manajemen", stok: 5 },
  { id: "bk-5", judul: "Akuntansi Keuangan Menengah", penulis: "Kieso", kategori: "Akuntansi", stok: 3 },
  { id: "bk-6", judul: "Statistika untuk Penelitian", penulis: "Sugiyono", kategori: "Metodologi", stok: 6 },
  { id: "bk-7", judul: "Kecerdasan Buatan", penulis: "Stuart Russell", kategori: "Ilmu Komputer", stok: 1 },
  { id: "bk-8", judul: "Manajemen Pemasaran", penulis: "Philip Kotler", kategori: "Manajemen", stok: 4 },
  { id: "bk-9", judul: "Hukum Perdata Indonesia", penulis: "Subekti", kategori: "Hukum", stok: 2 },
  { id: "bk-10", judul: "Fisika Dasar", penulis: "Halliday Resnick", kategori: "MIPA", stok: 3 },
  { id: "bk-11", judul: "Metodologi Penelitian Sosial", penulis: "Sugiyono", kategori: "Metodologi", stok: 0 },
  { id: "bk-12", judul: "Jaringan Komputer", penulis: "Andrew Tanenbaum", kategori: "Ilmu Komputer", stok: 3 },
];

function bacaKatalog(): Buku[] {
  if (typeof window === "undefined") return KATALOG_AWAL;
  try {
    const raw = window.localStorage.getItem("siakad_perpustakaan_katalog");
    return raw ? JSON.parse(raw) : KATALOG_AWAL;
  } catch {
    return KATALOG_AWAL;
  }
}
function tulisKatalog(list: Buku[]) {
  try {
    window.localStorage.setItem("siakad_perpustakaan_katalog", JSON.stringify(list));
  } catch {
    // localStorage tidak tersedia
  }
}
function bacaPeminjaman(): Record<string, Peminjaman[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem("siakad_perpustakaan_peminjaman");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisPeminjaman(map: Record<string, Peminjaman[]>) {
  try {
    window.localStorage.setItem("siakad_perpustakaan_peminjaman", JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export default function PerpustakaanPage() {
  const { user } = useAuth();
  const [katalog, setKatalog] = React.useState<Buku[] | null>(null);
  const [peminjaman, setPeminjaman] = React.useState<Peminjaman[] | null>(null);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!user) return;
    setKatalog(bacaKatalog());
    setPeminjaman(bacaPeminjaman()[user.id] ?? []);
  }, [user]);

  const handlePinjam = (buku: Buku) => {
    if (!user || !katalog || !peminjaman) return;
    if (buku.stok <= 0) return;
    const katalogBaru = katalog.map((b) => (b.id === buku.id ? { ...b, stok: b.stok - 1 } : b));
    setKatalog(katalogBaru);
    tulisKatalog(katalogBaru);

    const tenggat = new Date();
    tenggat.setDate(tenggat.getDate() + 7);
    const item: Peminjaman = {
      id: `pjm-${Date.now()}`,
      bukuId: buku.id,
      tanggalPinjam: new Date().toISOString(),
      tenggatKembali: tenggat.toISOString(),
    };
    const peminjamanBaru = [item, ...peminjaman];
    setPeminjaman(peminjamanBaru);
    const semua = bacaPeminjaman();
    semua[user.id] = peminjamanBaru;
    tulisPeminjaman(semua);

    catatAktivitas(user.id, "Meminjam buku perpustakaan", buku.judul);
    toast.success("Buku berhasil dipinjam", { description: `Kembalikan sebelum ${formatTanggal(tenggat.toISOString())}` });
  };

  const handleKembalikan = (item: Peminjaman) => {
    if (!user || !katalog || !peminjaman) return;
    const katalogBaru = katalog.map((b) => (b.id === item.bukuId ? { ...b, stok: b.stok + 1 } : b));
    setKatalog(katalogBaru);
    tulisKatalog(katalogBaru);

    const peminjamanBaru = peminjaman.filter((p) => p.id !== item.id);
    setPeminjaman(peminjamanBaru);
    const semua = bacaPeminjaman();
    semua[user.id] = peminjamanBaru;
    tulisPeminjaman(semua);

    toast.success("Buku berhasil dikembalikan");
  };

  const filtered = katalog?.filter(
    (b) => b.judul.toLowerCase().includes(search.toLowerCase()) || b.penulis.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Perpustakaan</h1>
        <p className="text-sm text-muted-foreground">Cari, pinjam, dan kelola pengembalian buku kampus</p>
      </div>

      <Tabs defaultValue="katalog">
        <TabsList>
          <TabsTrigger value="katalog">
            <Library className="h-3.5 w-3.5" /> Katalog Buku
          </TabsTrigger>
          <TabsTrigger value="peminjaman">
            <BookMarked className="h-3.5 w-3.5" /> Sedang Dipinjam
          </TabsTrigger>
        </TabsList>

        <TabsContent value="katalog">
          <Card>
            <CardHeader>
              <CardTitle>Katalog Buku</CardTitle>
              <CardDescription>{katalog?.length ?? 0} judul tersedia di perpustakaan</CardDescription>
              <div className="relative pt-2 w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari judul atau penulis..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered?.map((buku) => (
                  <div key={buku.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3.5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{buku.judul}</p>
                      <p className="text-xs text-muted-foreground">{buku.penulis}</p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{buku.kategori}</Badge>
                        <span className={`text-[11px] ${buku.stok === 0 ? "text-destructive" : "text-muted-foreground"}`}>
                          Stok: {buku.stok}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" disabled={buku.stok === 0} onClick={() => handlePinjam(buku)}>
                      Pinjam
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="peminjaman">
          <Card>
            <CardHeader>
              <CardTitle>Buku Sedang Dipinjam</CardTitle>
              <CardDescription>Kembalikan tepat waktu untuk menghindari denda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {peminjaman === null ? null : peminjaman.length === 0 ? (
                <EmptyState icon={BookMarked} title="Tidak ada buku yang dipinjam" description="Pinjam buku dari katalog untuk mulai membaca." />
              ) : (
                peminjaman.map((item) => {
                  const buku = katalog?.find((b) => b.id === item.bukuId);
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3.5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{buku?.judul ?? "Buku tidak ditemukan"}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Dipinjam {formatTanggal(item.tanggalPinjam)} &middot; Tenggat {formatTanggal(item.tenggatKembali)}
                        </p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => handleKembalikan(item)}>
                        <Undo2 className="h-3.5 w-3.5" />
                        Kembalikan
                      </Button>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
