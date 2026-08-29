"use client";

import * as React from "react";
import { toast } from "sonner";
import { Landmark, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { ConfirmDialog } from "@/components/tables/confirm-dialog";
import { ProdiFormDialog } from "@/components/academic/prodi-form-dialog";
import { prodiList as prodiAwal, getFakultasById } from "@/lib/mock";
import { downloadCsv } from "@/lib/utils";
import type { ProgramStudi } from "@/lib/types";

export default function AdminProdiPage() {
  const [data, setData] = React.useState<ProgramStudi[]>(prodiAwal);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ProgramStudi | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<ProgramStudi | null>(null);

  const columns: DataTableColumn<ProgramStudi>[] = [
    { key: "kode", header: "Kode", render: (r) => <span className="font-mono text-xs">{r.kode}</span> },
    { key: "nama", header: "Nama Program Studi", render: (r) => <span className="font-medium">{r.nama}</span>, sortable: true, sortValue: (r) => r.nama },
    { key: "jenjang", header: "Jenjang", render: (r) => r.jenjang },
    { key: "fakultas", header: "Fakultas", render: (r) => getFakultasById(r.fakultasId)?.nama ?? "-" },
    { key: "akreditasi", header: "Akreditasi", render: (r) => <Badge variant="outline">{r.akreditasi}</Badge> },
  ];

  const handleSubmitForm = (values: Omit<ProgramStudi, "id">) => {
    if (editing) {
      setData((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...values } : p)));
      toast.success("Data program studi diperbarui", { description: values.nama });
    } else {
      const baru: ProgramStudi = { ...values, id: `prodi-baru-${Date.now()}` };
      setData((prev) => [baru, ...prev]);
      toast.success("Program studi baru ditambahkan", { description: values.nama });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Data Program Studi</h1>
        <p className="text-sm text-muted-foreground">{data.length} program studi terdaftar pada sistem</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Program Studi</CardTitle>
          <CardDescription>Kelola data induk program studi: tambah, ubah, hapus, cari, dan ekspor</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Cari nama program studi..."
            searchFn={(r, q) => r.nama.toLowerCase().includes(q) || r.kode.toLowerCase().includes(q)}
            emptyIcon={Landmark}
            emptyTitle="Belum ada data program studi"
            addLabel="Tambah Prodi"
            onAdd={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            onBulkDelete={(ids) => {
              setData((prev) => prev.filter((p) => !ids.includes(p.id)));
              toast(`${ids.length} data program studi dihapus`);
            }}
            onExport={(rows) =>
              downloadCsv(
                "Data-Program-Studi.csv",
                ["Kode", "Nama", "Jenjang", "Fakultas", "Kaprodi", "Akreditasi"],
                rows.map((r) => [r.kode, r.nama, r.jenjang, getFakultasById(r.fakultasId)?.nama ?? "-", r.kaprodi, r.akreditasi])
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

      <ProdiFormDialog open={formOpen} onOpenChange={setFormOpen} initialData={editing} onSubmitData={handleSubmitForm} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Hapus Data Program Studi"
        description={`Apakah Anda yakin ingin menghapus program studi ${deleteTarget?.nama}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={() => {
          if (!deleteTarget) return;
          setData((prev) => prev.filter((p) => p.id !== deleteTarget.id));
          toast("Data program studi dihapus", { description: deleteTarget.nama });
        }}
      />
    </div>
  );
}
