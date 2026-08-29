"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Wallet } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/cards/status-badge";
import { StudentService } from "@/lib/services/student-service";
import { useAuth } from "@/lib/hooks/use-auth";
import { formatRupiah, formatTanggal } from "@/lib/utils";

export function TagihanWidget() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Awaited<ReturnType<typeof StudentService.getTagihan>> | null>(null);

  React.useEffect(() => {
    if (!user) return;
    StudentService.getTagihan(user).then(setData);
  }, [user]);

  const belumLunas = data?.filter((t) => t.status !== "paid") ?? [];

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Tagihan</CardTitle>
          <CardDescription>Status pembayaran semester ini</CardDescription>
        </div>
        <Link
          href="/mahasiswa/pembayaran"
          className="flex items-center text-xs font-medium text-primary hover:underline shrink-0"
        >
          Detail
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {data === null ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
        ) : belumLunas.length === 0 ? (
          <div className="flex items-center gap-3 rounded-lg bg-success-bg p-3.5">
            <Wallet className="h-5 w-5 text-success" />
            <p className="text-sm font-medium text-success">Semua tagihan telah lunas.</p>
          </div>
        ) : (
          belumLunas.map((t) => (
            <div key={t.id} className="rounded-lg border border-border p-3.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{t.jenis}</p>
                <StatusBadge status={t.status} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-display text-base font-bold text-foreground">
                  {formatRupiah(t.jumlah)}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Jatuh tempo {formatTanggal(t.jatuhTempo)}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
