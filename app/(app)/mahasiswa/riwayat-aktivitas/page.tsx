"use client";

import * as React from "react";
import {
  History,
  LogIn,
  UserPlus,
  UserRound,
  ClipboardList,
  KeyRound,
  BookMarked,
  Users2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/cards/empty-state";
import { useAuth } from "@/lib/hooks/use-auth";
import { ambilAktivitas, type ActivityEntry } from "@/lib/services/activity-log";
import { formatTanggal } from "@/lib/utils";

const ICON_MAP: { match: RegExp; icon: typeof LogIn }[] = [
  { match: /masuk/i, icon: LogIn },
  { match: /mendaftar/i, icon: UserPlus },
  { match: /profil/i, icon: UserRound },
  { match: /krs/i, icon: ClipboardList },
  { match: /sandi/i, icon: KeyRound },
  { match: /pinjam/i, icon: BookMarked },
  { match: /bergabung|organisasi|mendaftar kegiatan/i, icon: Users2 },
];

function getIcon(aksi: string) {
  return ICON_MAP.find((m) => m.match.test(aksi))?.icon ?? History;
}

export default function RiwayatAktivitasPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<ActivityEntry[] | null>(null);

  React.useEffect(() => {
    if (!user) return;
    setData(ambilAktivitas(user.id));
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Riwayat Aktivitas</h1>
        <p className="text-sm text-muted-foreground">Catatan aktivitas terbaru pada akun Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Akun</CardTitle>
          <CardDescription>50 aktivitas terakhir, terbaru di paling atas</CardDescription>
        </CardHeader>
        <CardContent>
          {data === null ? null : data.length === 0 ? (
            <EmptyState icon={History} title="Belum ada aktivitas tercatat" description="Aktivitas Anda pada SIAKAD akan muncul di sini." />
          ) : (
            <div className="space-y-1">
              {data.map((item) => {
                const Icon = getIcon(item.aksi);
                return (
                  <div key={item.id} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.aksi}</p>
                      {item.keterangan && <p className="text-xs text-muted-foreground">{item.keterangan}</p>}
                      <p className="text-[11px] text-muted-foreground mt-0.5">{formatTanggal(item.waktu, true)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
