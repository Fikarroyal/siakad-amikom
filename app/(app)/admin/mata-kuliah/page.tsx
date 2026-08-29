"use client";

import * as React from "react";
import { toast } from "sonner";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { ConfirmDialog } from "@/components/tables/confirm-dialog";
import { MataKuliahFormDialog } from "@/components/academic/mata-kuliah-form-dialog";
import { mataKuliahList as matkulAwal, getProdiById } from "@/lib/mock";
import { downloadCsv } from "@/lib/utils";
import type { MataKuliah } from "@/lib/types";

export default function AdminMataKuliahPage() {
  const [data, setData] = React.useState<MataKuliah[]>(matkulAwal);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<MataKuliah | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<MataKuliah | null>(null);

  const columns: DataTableColumn<MataKuliah>[] = [
    { key: "kode", header: "Kode", render: (r) => <span className="font-mono text-xs">{r.kode}</span> },
    { key: "nama", header: "Nama Mata Kuliah", render: (r) => <span className="font-medium">{r.nama}</span>, sortable: true, sortValue: (r) => r.nama },
    { key: "sks", header: "SKS", render: (r) => <Badge variant="outline">{r.sks} SKS</Badge>, sortable: true, sortValue: (r) => r.sks },
    { key: "semester", header: "Semester", render: (r) => r.semester, sortable: true, sortValue: (r) => r.semester },
    { key: "prodi", header: "Program Studi", render: (r) => getProdiById(r.prodiId)?.nama ?? "-" },
  ];

  const handleSubmitForm = (values: Omit<MataKuliah, "id">) => {
    if (editing) {
      setData((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...values } : m)));
      toast.success("Data mata kuliah diperbarui", { description: values.nama });
    } else {
      const baru: MataKuliah = { ...values, id: `mk-baru-${Date.now()}` };
      setData((prev) => [baru, ...prev]);
      toast.success("Mata kuliah baru ditambahkan", { description: values.nama });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Data Mata Kuliah</h1>
        <p className="text-sm text-muted-foreground">{data.length} mata kuliah terdaftar pada sistem</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Mata Kuliah</CardTitle>
          <CardDescription>Kelola data induk mata kuliah: tambah, ubah, hapus, cari, dan ekspor</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Cari nama atau kode mata kuliah..."
            searchFn={(r, q) => r.nama.toLowerCase().includes(q) || r.kode.toLowerCase().includes(q)}
            emptyIcon={BookOpen}
            emptyTitle="Belum ada data mata kuliah"
            addLabel="Tambah Mata Kuliah"
            onAdd={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            onBulkDelete={(ids) => {
              setData((prev) => prev.filter((m) => !ids.includes(m.id)));
              toast(`${ids.length} data mata kuliah dihapus`);
            }}
            onExport={(rows) =>
              downloadCsv(
                "Data-Mata-Kuliah.csv",
                ["Kode", "Nama", "SKS", "Semester", "Program Studi"],
                rows.map((r) => [r.kode, r.nama, r.sks, r.semester, getProdiById(r.prodiId)?.nama ?? "-"])
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

      <MataKuliahFormDialog open={formOpen} onOpenChange={setFormOpen} initialData={editing} onSubmitData={handleSubmitForm} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Hapus Data Mata Kuliah"
        description={`Apakah Anda yakin ingin menghapus mata kuliah ${deleteTarget?.nama}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={() => {
          if (!deleteTarget) return;
          setData((prev) => prev.filter((m) => m.id !== deleteTarget.id));
          toast("Data mata kuliah dihapus", { description: deleteTarget.nama });
        }}
      />
    </div>
  );
}
