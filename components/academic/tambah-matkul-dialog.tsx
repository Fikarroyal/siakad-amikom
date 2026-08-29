"use client";

import * as React from "react";
import { Search, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/cards/empty-state";
import { SearchX } from "lucide-react";
import type { Dosen, HariKuliah, KelasKuliah, MataKuliah } from "@/lib/types";

export interface KelasTersediaItem {
  kelas: KelasKuliah;
  mataKuliah: MataKuliah;
  dosen?: Dosen;
}

const HARI_OPSI: HariKuliah[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export function TambahMataKuliahDialog({
  open,
  onOpenChange,
  daftarTersedia,
  onTambah,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  daftarTersedia: KelasTersediaItem[];
  onTambah: (item: KelasTersediaItem) => void;
}) {
  const [search, setSearch] = React.useState("");
  const [hariFilter, setHariFilter] = React.useState<string>("semua");

  const filtered = daftarTersedia.filter((item) => {
    const q = search.toLowerCase();
    const cocokSearch =
      item.mataKuliah.nama.toLowerCase().includes(q) ||
      item.mataKuliah.kode.toLowerCase().includes(q) ||
      item.dosen?.nama.toLowerCase().includes(q);
    const cocokHari = hariFilter === "semua" || item.kelas.hari === hariFilter;
    return cocokSearch && cocokHari;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tambah Mata Kuliah</DialogTitle>
          <DialogDescription>
            Pilih mata kuliah dan kelas yang ingin ditambahkan ke KRS semester ini.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari mata kuliah atau dosen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={hariFilter} onValueChange={setHariFilter}>
            <SelectTrigger className="sm:w-40">
              <SelectValue placeholder="Semua Hari" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Hari</SelectItem>
              {HARI_OPSI.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[400px] -mx-1 px-1">
          {filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="Tidak ditemukan"
              description="Coba ubah kata kunci pencarian atau filter hari."
              className="border-none"
            />
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => {
                const penuh = item.kelas.terisi >= item.kelas.kuota;
                return (
                  <div
                    key={item.kelas.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-secondary/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground">{item.mataKuliah.nama}</p>
                        <Badge variant="outline" className="text-[10px]">
                          Kelas {item.kelas.kode}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{item.mataKuliah.sks} SKS</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {item.dosen?.nama} &middot; {item.kelas.hari}, {item.kelas.jamMulai}–{item.kelas.jamSelesai} &middot; {item.kelas.ruangan}
                      </p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span className={penuh ? "text-destructive font-medium" : ""}>
                          {item.kelas.terisi}/{item.kelas.kuota} peserta
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={penuh}
                      onClick={() => onTambah(item)}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Tambah
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
