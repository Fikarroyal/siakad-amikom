"use client";

import * as React from "react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import { Plus, Trash2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/tables/confirm-dialog";
import { EmptyState } from "@/components/cards/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/cards/status-badge";
import { useAuth } from "@/lib/hooks/use-auth";
import { catatAktivitas } from "@/lib/services/activity-log";
import { formatTanggal } from "@/lib/utils";

export interface PengajuanItem {
  id: string;
  jenis: string;
  catatan: string;
  tanggalDiajukan: string;
  status: "diajukan" | "diproses" | "disetujui" | "ditolak";
}

function bacaSemua(storageKey: string): Record<string, PengajuanItem[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function tulisSemua(storageKey: string, map: Record<string, PengajuanItem[]>) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {
    // localStorage tidak tersedia
  }
}

export function PengajuanLayananManager({
  storageKey,
  pageTitle,
  pageDescription,
  icon: Icon,
  jenisLabel,
  jenisOptions,
  jenisPlaceholder,
  catatanLabel,
  catatanPlaceholder,
  addLabel = "Ajukan Baru",
  logLabel,
}: {
  storageKey: string;
  pageTitle: string;
  pageDescription: string;
  icon: LucideIcon;
  jenisLabel: string;
  jenisOptions?: string[];
  jenisPlaceholder?: string;
  catatanLabel: string;
  catatanPlaceholder?: string;
  addLabel?: string;
  logLabel: string;
}) {
  const { user } = useAuth();
  const [items, setItems] = React.useState<PengajuanItem[] | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [jenis, setJenis] = React.useState(jenisOptions?.[0] ?? "");
  const [catatan, setCatatan] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState<PengajuanItem | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const fullKey = `siakad_${storageKey}`;

  React.useEffect(() => {
    if (!user) return;
    const semua = bacaSemua(fullKey);
    setItems(semua[user.id] ?? []);
  }, [user, fullKey]);

  const simpan = (list: PengajuanItem[]) => {
    if (!user) return;
    const semua = bacaSemua(fullKey);
    semua[user.id] = list;
    tulisSemua(fullKey, semua);
    setItems(list);
  };

  const handleAjukan = async () => {
    if (!user) return;
    if (jenisOptions && !jenis) {
      toast.error(`Pilih ${jenisLabel.toLowerCase()} terlebih dahulu`);
      return;
    }
    if (!catatan.trim()) {
      toast.error(`${catatanLabel} wajib diisi`);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    const baru: PengajuanItem = {
      id: `pjn-${Date.now()}`,
      jenis: jenisOptions ? jenis : catatan.slice(0, 40),
      catatan,
      tanggalDiajukan: new Date().toISOString(),
      status: "diajukan",
    };
    simpan([baru, ...(items ?? [])]);
    catatAktivitas(user.id, logLabel, baru.jenis);
    toast.success("Pengajuan berhasil dikirim", { description: "Status dapat dipantau pada daftar di bawah." });
    setCatatan("");
    setJenis(jenisOptions?.[0] ?? "");
    setSubmitting(false);
    setFormOpen(false);
  };

  const handleBatalkan = () => {
    if (!deleteTarget || !items) return;
    simpan(items.filter((i) => i.id !== deleteTarget.id));
    toast("Pengajuan dibatalkan");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">{pageDescription}</p>
        </div>
        <Button size="sm" onClick={() => setFormOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengajuan</CardTitle>
          <CardDescription>Daftar pengajuan yang pernah Anda kirim</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {items === null ? (
            Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
          ) : items.length === 0 ? (
            <EmptyState
              icon={Icon}
              title="Belum ada pengajuan"
              description={`Klik "${addLabel}" untuk membuat pengajuan pertama Anda.`}
              actionLabel={addLabel}
              onAction={() => setFormOpen(true)}
            />
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.jenis}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.catatan}</p>
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTanggal(item.tanggalDiajukan, true)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <StatusBadge status={item.status} />
                  {item.status === "diajukan" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setDeleteTarget(item)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{addLabel}</DialogTitle>
            <DialogDescription>Lengkapi formulir berikut untuk mengirimkan pengajuan.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {jenisOptions && (
              <div className="space-y-1.5">
                <Label>{jenisLabel}</Label>
                <Select value={jenis} onValueChange={setJenis}>
                  <SelectTrigger>
                    <SelectValue placeholder={jenisPlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisOptions.map((j) => (
                      <SelectItem key={j} value={j}>
                        {j}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label>{catatanLabel}</Label>
              <Textarea rows={4} placeholder={catatanPlaceholder} value={catatan} onChange={(e) => setCatatan(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleAjukan} disabled={submitting}>
              Kirim Pengajuan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Batalkan Pengajuan"
        description="Apakah Anda yakin ingin membatalkan pengajuan ini?"
        confirmLabel="Batalkan"
        onConfirm={handleBatalkan}
      />
    </div>
  );
}
