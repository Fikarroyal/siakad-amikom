"use client";

import * as React from "react";
import { toast } from "sonner";
import { GraduationCap, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/cards/status-badge";
import { DataTable, type DataTableColumn } from "@/components/tables/data-table";
import { ConfirmDialog } from "@/components/tables/confirm-dialog";
import { MahasiswaFormDialog } from "@/components/academic/mahasiswa-form-dialog";
import { mahasiswaList as mahasiswaAwal, getProdiById } from "@/lib/mock";
import { downloadCsv } from "@/lib/utils";
import type { Mahasiswa } from "@/lib/types";

export default function AdminMahasiswaPage() {
  const [data, setData] = React.useState<Mahasiswa[]>(mahasiswaAwal);
  const [formOpen, setFormOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Mahasiswa | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Mahasiswa | null>(null);

  const columns: DataTableColumn<Mahasiswa>[] = [
    { key: "nim", header: "NIM", render: (r) => <span className="font-mono text-xs">{r.nim}</span>, sortable: true, sortValue: (r) => r.nim },
    { key: "nama", header: "Nama", render: (r) => <span className="font-medium">{r.nama}</span>, sortable: true, sortValue: (r) => r.nama },
    { key: "prodi", header: "Program Studi", render: (r) => getProdiById(r.prodiId)?.nama ?? "-" },
    { key: "angkatan", header: "Angkatan", render: (r) => r.angkatan, sortable: true, sortValue: (r) => r.angkatan },
    { key: "semester", header: "Semester", render: (r) => r.semesterAktif, sortable: true, sortValue: (r) => r.semesterAktif },
    { key: "ipk", header: "IPK", render: (r) => r.ipk.toFixed(2), sortable: true, sortValue: (r) => r.ipk },
    { key: "status", header: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];

  const handleAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleEdit = (row: Mahasiswa) => {
    setEditing(row);
    setFormOpen(true);
  };

  const handleSubmitForm = (values: Omit<Mahasiswa, "id" | "fakultasId" | "sksDitempuh" | "totalSks" | "ips">) => {
    if (editing) {
      setData((prev) => prev.map((m) => (m.id === editing.id ? { ...m, ...values } : m)));
      toast.success("Data mahasiswa diperbarui", { description: values.nama });
    } else {
      const prodi = getProdiById(values.prodiId);
      const baru: Mahasiswa = {
        ...values,
        id: `mhs-baru-${Date.now()}`,
        fakultasId: prodi?.fakultasId ?? "",
        sksDitempuh: 0,
        totalSks: 144,
        ips: values.ipk,
      };
      setData((prev) => [baru, ...prev]);
      toast.success("Mahasiswa baru ditambahkan", { description: values.nama });
    }
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    toast("Data mahasiswa dihapus", { description: deleteTarget.nama });
  };

  const handleBulkDelete = (ids: string[]) => {
    setData((prev) => prev.filter((m) => !ids.includes(m.id)));
    toast(`${ids.length} data mahasiswa dihapus`);
  };

  const handleExport = (rows: Mahasiswa[]) => {
    downloadCsv(
      "Data-Mahasiswa.csv",
      ["NIM", "Nama", "Email", "Program Studi", "Angkatan", "Semester", "IPK", "Status"],
      rows.map((r) => [
        r.nim,
        r.nama,
        r.email,
        getProdiById(r.prodiId)?.nama ?? "-",
        r.angkatan,
        r.semesterAktif,
        r.ipk.toFixed(2),
        r.status,
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Data Mahasiswa</h1>
          <p className="text-sm text-muted-foreground">{data.length} mahasiswa terdaftar pada sistem</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Mahasiswa</CardTitle>
          <CardDescription>Kelola data induk mahasiswa: tambah, ubah, hapus, cari, dan ekspor</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            getRowId={(r) => r.id}
            searchPlaceholder="Cari nama atau NIM..."
            searchFn={(r, q) => r.nama.toLowerCase().includes(q) || r.nim.toLowerCase().includes(q)}
            emptyIcon={GraduationCap}
            emptyTitle="Belum ada data mahasiswa"
            emptyDescription="Tambahkan data mahasiswa baru untuk memulai."
            addLabel="Tambah Mahasiswa"
            onAdd={handleAdd}
            onBulkDelete={handleBulkDelete}
            onExport={handleExport}
            renderRowActions={(row) => (
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(row)}>
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

      <MahasiswaFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editing}
        onSubmitData={handleSubmitForm}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Hapus Data Mahasiswa"
        description={`Apakah Anda yakin ingin menghapus data ${deleteTarget?.nama}? Tindakan ini tidak dapat dibatalkan.`}
        onConfirm={handleDelete}
      />
    </div>
  );
}
