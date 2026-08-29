"use client";

import * as React from "react";
import { toast } from "sonner";
import { UserRound, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { ConfirmDialog } from "@/components/tables/confirm-dialog";
import { DosenFormDialog } from "@/components/academic/dosen-form-dialog";
import { dosenList as dosenAwal, getProdiById } from "@/lib/mock";
import { downloadCsv } from "@/lib/utils";
import type { Dosen } from "@/lib/types";

export default function AdminDosenPage() {
  const [data, setData] = React.useState<Dosen[]>(dosenAwal);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Dosen | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Dosen | null>(null);

  const columns: DataTableColumn<Dosen>[] = [
    { key: "nidn", header: "NIDN", render: (r) => <span className="font-mono text-xs">{r.nidn}</span>, sortable: true, sortValue: (r) => r.nidn },
    { key: "nama", header: "Nama", render: (r) => <span className="font-medium">{r.nama}</span>, sortable: true, sortValue: (r) => r.nama },
    { key: "prodi", header: "Program Studi", render: (r) => getProdiById(r.prodiId)?.nama ?? "-" },
    { key: "jabatan", header: "Jabatan Akademik", render: (r) => r.jabatanAkademik },
    {
      key: "status",
      header: "Status",
      render: (r) => <Badge variant={r.status === "aktif" ? "success" : "secondary"}>{r.status === "aktif" ? "Aktif" : "Nonaktif"}</Badge>,
    },
  ];

  const handleSubmitForm = (values: Omit<Dosen, "id" | "fakultasId">) => {
    if (editing) {
      setData((prev) => prev.map((d) => (d.id === editing.id ? { ...d, ...values } : d)));
      toast.success("Data dosen diperbarui", { description: values.nama });
    } else {
      const prodi = getProdiById(values.prodiId);
      const baru: Dosen = { ...values, id: `dsn-baru-${Date.now()}`, fakultasId: prodi?.fakultasId ?? "" };
      setData((prev) => [baru, ...prev]);
      toast.success("Dosen baru ditambahkan", { description: values.nama });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    toast("Data dosen dihapus", { description: deleteTarget.nama });
  };

  const handleExport = (rows: Dosen[]) => {
    downloadCsv(
      "Data-Dosen.csv",
      ["NIDN", "Nama", "Email", "Program Studi", "Jabatan Akademik", "Status"],
      rows.map((r) => [r.nidn, r.nama, r.email, getProdiById(r.prodiId)?.nama ?? "-", r.jabatanAkademik, r.status])
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold text-foreground">Data Dosen</h1>
        <p className="text-sm text-muted-foreground">{data.length} dosen terdaftar pada sistem</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Dosen</CardTitle>
          <CardDescription>Kelola data induk dosen: tambah, ubah, hapus, cari, dan ekspor</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Cari nama atau NIDN..."
            searchFn={(r, q) => r.nama.toLowerCase().includes(q) || r.nidn.toLowerCase().includes(q)}
            emptyIcon={UserRound}
            emptyTitle="Belum ada data dosen"
            emptyDescription="Tambahkan data dosen baru untuk memulai."
            addLabel="Tambah Dosen"
            onAdd={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            onBulkDelete={(ids) => {
              setData((prev) => prev.filter((d) => !ids.includes(d.id)));
              toast(`${ids.length} data dosen dihapus`);
            }}
            onExport={handleExport}
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

      <DosenFormDialog open={formOpen} onOpenChange={setFormOpen} initialData={editing} onSubmitData={handleSubmitForm} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Hapus Data Dosen"
        description={`Apakah Anda yakin ingin menghapus data ${deleteTarget?.nama}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
