"use client";

import * as React from "react";
import { toast } from "sonner";
import { CreditCard, Wallet, Receipt, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard, StatCardSkeleton } from "@/components/cards/stat-card";
import { StatusBadge } from "@/components/cards/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/cards/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { StudentService } from "@/lib/services/student-service";
import { useAuth } from "@/lib/hooks/use-auth";
import { formatRupiah, formatTanggal } from "@/lib/utils";
import type { Tagihan } from "@/lib/types";

export default function PembayaranPage() {
  const { user } = useAuth();
  const [data, setData] = React.useState<Tagihan[] | null>(null);
  const [selected, setSelected] = React.useState<Tagihan | null>(null);
  const [processing, setProcessing] = React.useState(false);

  const load = React.useCallback(() => {
    if (!user) return;
    StudentService.getTagihan(user).then(setData);
  }, [user]);

  React.useEffect(() => {
    load();
  }, [load]);

  const totalTagihan = data?.reduce((acc, t) => acc + t.jumlah, 0) ?? 0;
  const totalDibayar = data?.filter((t) => t.status === "paid").reduce((acc, t) => acc + t.jumlah, 0) ?? 0;
  const sisaTagihan = totalTagihan - totalDibayar;

  const handleBayar = async () => {
    if (!selected) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setData((prev) =>
      prev
        ? prev.map((t) =>
            t.id === selected.id
              ? { ...t, status: "paid", tanggalBayar: new Date().toISOString().slice(0, 10), metodePembayaran: "Virtual Account BCA" }
              : t
          )
        : prev
    );
    setProcessing(false);
    setSelected(null);
    toast.success("Pembayaran berhasil", { description: "Tagihan telah lunas (simulasi)." });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Pembayaran</h1>
        <p className="text-sm text-muted-foreground">Tagihan dan riwayat pembayaran akademik</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {data === null ? (
          Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard icon={Receipt} label="Total Tagihan" value={formatRupiah(totalTagihan)} tone="default" />
            <StatCard icon={CheckCircle2} label="Total Dibayar" value={formatRupiah(totalDibayar)} tone="success" />
            <StatCard icon={Wallet} label="Sisa Tagihan" value={formatRupiah(sisaTagihan)} tone={sisaTagihan > 0 ? "warning" : "success"} />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tagihan</CardTitle>
          <CardDescription>Klik tagihan untuk melihat detail atau melakukan pembayaran</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {data === null ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : data.length === 0 ? (
            <EmptyState icon={CreditCard} title="Belum ada tagihan" description="Tagihan akan muncul setiap awal semester." />
          ) : (
            data.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className="flex w-full items-center justify-between gap-3 rounded-lg border border-border p-4 text-left hover:border-primary/40 hover:bg-accent/30 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.jenis}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    No. Invoice {t.nomorInvoice} &middot; Jatuh tempo {formatTanggal(t.jatuhTempo)}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-display text-sm font-bold text-foreground">{formatRupiah(t.jumlah)}</span>
                  <StatusBadge status={t.status} />
                </div>
              </button>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Detail Tagihan</DialogTitle>
                <DialogDescription>{selected.nomorInvoice}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2.5 rounded-lg border border-border p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jenis</span>
                  <span className="font-medium text-foreground text-right">{selected.jenis}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jumlah</span>
                  <span className="font-semibold text-foreground">{formatRupiah(selected.jumlah)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Jatuh Tempo</span>
                  <span className="font-medium text-foreground">{formatTanggal(selected.jatuhTempo)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge status={selected.status} />
                </div>
                {selected.status === "paid" && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tanggal Bayar</span>
                      <span className="font-medium text-foreground">{selected.tanggalBayar && formatTanggal(selected.tanggalBayar)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Metode</span>
                      <span className="font-medium text-foreground">{selected.metodePembayaran}</span>
                    </div>
                  </>
                )}
              </div>
              {selected.status !== "paid" && (
                <DialogFooter>
                  <Button onClick={handleBayar} disabled={processing} className="w-full sm:w-auto">
                    {processing ? <Loader2 className="animate-spin" /> : <CreditCard />}
                    {processing ? "Memproses pembayaran..." : "Bayar Sekarang (Simulasi)"}
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
