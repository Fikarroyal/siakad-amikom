"use client";

import * as React from "react";
import { Search, Megaphone, Pin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/cards/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudentService } from "@/lib/services/student-service";
import { formatTanggal } from "@/lib/utils";
import type { Pengumuman } from "@/lib/types";

const KATEGORI_LABEL: Record<string, string> = {
  akademik: "Akademik",
  keuangan: "Keuangan",
  umum: "Umum",
  ujian: "Ujian",
};

const KATEGORI_VARIANT: Record<string, "info" | "warning" | "secondary" | "destructive"> = {
  akademik: "info",
  keuangan: "warning",
  umum: "secondary",
  ujian: "destructive",
};

export default function PengumumanPage() {
  const [data, setData] = React.useState<Pengumuman[] | null>(null);
  const [search, setSearch] = React.useState("");
  const [kategori, setKategori] = React.useState("semua");

  React.useEffect(() => {
    StudentService.getPengumuman().then(setData);
  }, []);

  const filtered = data?.filter((p) => {
    const cocokKategori = kategori === "semua" || p.kategori === kategori;
    const cocokSearch = p.judul.toLowerCase().includes(search.toLowerCase());
    return cocokKategori && cocokSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Pengumuman</h1>
        <p className="text-sm text-muted-foreground">Seluruh informasi resmi dari kampus</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari pengumuman..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={kategori} onValueChange={setKategori}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kategori</SelectItem>
            {Object.entries(KATEGORI_LABEL).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data === null ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : filtered && filtered.length === 0 ? (
        <EmptyState icon={Megaphone} title="Tidak ada pengumuman" description="Coba ubah kata kunci atau kategori pencarian." />
      ) : (
        <div className="space-y-3">
          {filtered?.map((p) => (
            <Card key={p.id}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Megaphone className="h-[18px] w-[18px]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.isPinned && <Pin className="h-3.5 w-3.5 text-primary shrink-0" />}
                      <p className="text-sm font-semibold text-foreground">{p.judul}</p>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.isi}</p>
                    <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                      <Badge variant={KATEGORI_VARIANT[p.kategori]}>{KATEGORI_LABEL[p.kategori]}</Badge>
                      <span className="text-[11px] text-muted-foreground">
                        {p.penulis} &middot; {formatTanggal(p.tanggalPublish)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
