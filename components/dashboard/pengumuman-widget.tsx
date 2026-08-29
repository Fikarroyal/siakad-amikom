"use client";

import * as React from "react";
import Link from "next/link";
import { Pin, Megaphone, ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { StudentService } from "@/lib/services/student-service";
import { formatTanggal } from "@/lib/utils";

const KATEGORI_LABEL: Record<string, string> = {
  akademik: "Akademik",
  keuangan: "Keuangan",
  umum: "Umum",
  ujian: "Ujian",
};

export function PengumumanWidget() {
  const [data, setData] = React.useState<Awaited<ReturnType<typeof StudentService.getPengumuman>> | null>(null);

  React.useEffect(() => {
    StudentService.getPengumuman(4).then(setData);
  }, []);

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Pengumuman</CardTitle>
          <CardDescription>Informasi terbaru untuk Anda</CardDescription>
        </div>
        <Link
          href="/mahasiswa/pengumuman"
          className="flex items-center text-xs font-medium text-primary hover:underline shrink-0"
        >
          Lihat semua
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-1">
        {data === null
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full mb-2" />)
          : data.map((p) => (
              <Link
                key={p.id}
                href="/mahasiswa/pengumuman"
                className="flex items-start gap-2.5 rounded-lg p-2.5 -mx-2.5 hover:bg-secondary/40 transition-colors"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Megaphone className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {p.isPinned && <Pin className="h-3 w-3 text-primary shrink-0" />}
                    <p className="text-sm font-medium text-foreground truncate">{p.judul}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {KATEGORI_LABEL[p.kategori]}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">{formatTanggal(p.tanggalPublish)}</span>
                  </div>
                </div>
              </Link>
            ))}
      </CardContent>
    </Card>
  );
}
