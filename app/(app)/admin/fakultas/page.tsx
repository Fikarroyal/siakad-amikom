"use client";

import * as React from "react";
import { toast } from "sonner";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { ConfirmDialog } from "@/components/tables/confirm-dialog";
import { FakultasFormDialog } from "@/components/academic/fakultas-form-dialog";
import { fakultasList as fakultasAwal, prodiList } from "@/lib/mock";
import { downloadCsv } from "@/lib/utils";
import type { Fakultas } from "@/lib/types";

export default function AdminFakultasPage() {
  const [data, setData] = React.useState<Fakultas[]>(fakultasAwal);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Fakultas | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Fakultas | null>(null);

  const jumlahProdi = (id: string) => prodiList.filter((p) => p.fakultasId === id).length;

  const columns: DataTableColumn<Fakultas>[] = [
    { key: "kode", header: "Kode", render: (r) => <span className="font-mono text-xs">{r.kode}</span> },
    { key: "nama", header: "Nama Fakultas", render: (r) => <span className="font-medium">{r.nama}</span>, sortable: true, sortValue: (r) => r.nama },
    { key: "dekan", header: "Dekan", render: (r) => r.dekan },
    { key: "prodi", header: "Jumlah Prodi", render: (r) => jumlahProdi(r.id), sortable: true, sortValue: (r) => jumlahProdi(r.id) },
  ];

  const handleSubmitForm = (values: Omit<Fakultas, "id" | "jumlahProdi">) => {
    if (editing) {
      setData((prev) => prev.map((f) => (f.id === editing.id ? { ...f, ...values } : f)));
      toast.success("Data fakultas diperbarui", { description: values.nama });
    } else {
      const baru: Fakultas = { ...values, id: `fak-baru-${Date.now()}`, jumlahProdi: 0 };
      setData((prev) => [baru, ...prev]);
      toast.success("Fakultas baru ditambahkan", { description: values.nama });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Data Fakultas</h1>
        <p className="text-sm text-muted-foreground">{data.length} fakultas terdaftar pada sistem</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Fakultas</CardTitle>
          <CardDescription>Kelola data induk fakultas: tambah, ubah, hapus, cari, dan ekspor</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Cari nama fakultas..."
            searchFn={(r, q) => r.nama.toLowerCase().includes(q) || r.kode.toLowerCase().includes(q)}
            emptyIcon={Building2}
            emptyTitle="Belum ada data fakultas"
            addLabel="Tambah Fakultas"
            onAdd={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            onBulkDelete={(ids) => {
              setData((prev) => prev.filter((f) => !ids.includes(f.id)));
              toast(`${ids.length} data fakultas dihapus`);
            }}
            onExport={(rows) =>
              downloadCsv(
                "Data-Fakultas.csv",
                ["Kode", "Nama", "Dekan", "Jumlah Prodi"],
                rows.map((r) => [r.kode, r.nama, r.dekan, jumlahProdi(r.id)])
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

      <FakultasFormDialog open={formOpen} onOpenChange={setFormOpen} initialData={editing} onSubmitData={handleSubmitForm} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Hapus Data Fakultas"
        description={`Apakah Anda yakin ingin menghapus fakultas ${deleteTarget?.nama}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={() => {
          if (!deleteTarget) return;
          setData((prev) => prev.filter((f) => f.id !== deleteTarget.id));
          toast("Data fakultas dihapus", { description: deleteTarget.nama });
        }}
      />
    </div>
  );
}
