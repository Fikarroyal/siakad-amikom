"use client";

import * as React from "react";
import { toast } from "sonner";
import { DoorOpen, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { ConfirmDialog } from "@/components/tables/confirm-dialog";
import { RuanganFormDialog } from "@/components/academic/ruangan-form-dialog";
import { ruanganList as ruanganAwal } from "@/lib/mock";
import { downloadCsv } from "@/lib/utils";
import type { Ruangan } from "@/lib/types";

const JENIS_LABEL: Record<Ruangan["jenis"], string> = {
  kelas: "Kelas",
  laboratorium: "Laboratorium",
  aula: "Aula",
};

export default function AdminRuanganPage() {
  const [data, setData] = React.useState<Ruangan[]>(ruanganAwal);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Ruangan | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Ruangan | null>(null);

  const columns: DataTableColumn<Ruangan>[] = [
    { key: "kode", header: "Kode", render: (r) => <span className="font-mono text-xs">{r.kode}</span>, sortable: true, sortValue: (r) => r.kode },
    { key: "nama", header: "Nama Ruangan", render: (r) => <span className="font-medium">{r.nama}</span> },
    { key: "gedung", header: "Gedung", render: (r) => r.gedung },
    { key: "kapasitas", header: "Kapasitas", render: (r) => `${r.kapasitas} orang`, sortable: true, sortValue: (r) => r.kapasitas },
    { key: "jenis", header: "Jenis", render: (r) => <Badge variant="outline">{JENIS_LABEL[r.jenis]}</Badge> },
  ];

  const handleSubmitForm = (values: Omit<Ruangan, "id">) => {
    if (editing) {
      setData((prev) => prev.map((r) => (r.id === editing.id ? { ...r, ...values } : r)));
      toast.success("Data ruangan diperbarui", { description: values.nama });
    } else {
      const baru: Ruangan = { ...values, id: `rg-baru-${Date.now()}` };
      setData((prev) => [baru, ...prev]);
      toast.success("Ruangan baru ditambahkan", { description: values.nama });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Data Ruangan</h1>
        <p className="text-sm text-muted-foreground">{data.length} ruangan terdaftar pada sistem</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Ruangan</CardTitle>
          <CardDescription>Kelola data induk ruangan: tambah, ubah, hapus, cari, dan ekspor</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Cari nama atau kode ruangan..."
            searchFn={(r, q) => r.nama.toLowerCase().includes(q) || r.kode.toLowerCase().includes(q)}
            emptyIcon={DoorOpen}
            emptyTitle="Belum ada data ruangan"
            addLabel="Tambah Ruangan"
            onAdd={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            onBulkDelete={(ids) => {
              setData((prev) => prev.filter((r) => !ids.includes(r.id)));
              toast(`${ids.length} data ruangan dihapus`);
            }}
            onExport={(rows) =>
              downloadCsv(
                "Data-Ruangan.csv",
                ["Kode", "Nama", "Gedung", "Kapasitas", "Jenis"],
                rows.map((r) => [r.kode, r.nama, r.gedung, r.kapasitas, JENIS_LABEL[r.jenis]])
              )
            }
            renderRowActions={(row) => (
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditing(row);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(row)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          />
        </CardContent>
      </Card>

      <RuanganFormDialog open={formOpen} onOpenChange={setFormOpen} initialData={editing} onSubmitData={handleSubmitForm} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Hapus Data Ruangan"
        description={`Apakah Anda yakin ingin menghapus ruangan ${deleteTarget?.nama}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={() => {
          if (!deleteTarget) return;
          setData((prev) => prev.filter((r) => r.id !== deleteTarget.id));
          toast("Data ruangan dihapus", { description: deleteTarget.nama });
        }}
      />
    </div>
  );
}
